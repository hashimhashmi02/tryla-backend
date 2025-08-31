const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const SHIPPING_FEE = 0;

const bad = (m) => Object.assign(new Error(m), { status: 400 });

exports.getCart = async (userId) => {
  const rawItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  const items = rawItems.map(ci => ({
    id: ci.id,
    size: ci.size,                      // <-- include size in response
    quantity: ci.quantity,
    product: {
      id:           ci.product.id,
      title:        ci.product.title,
      price:        Number(ci.product.price),
      images:       ci.product.images,
      availability: ci.product.availability,
      categoryId:   ci.product.categoryId,
    }
  }));

  const subtotal = items.reduce((s, it) => s + it.product.price * it.quantity, 0);
  const shipping = SHIPPING_FEE;
  const total = subtotal + shipping;

  return { items, summary: { subtotal, shipping, total } };
};

/**
 * Create / merge cart item by (userId, productId, size)
 */
exports.create = async (userId, productId, quantity = 1, size) => {
  if (!productId) throw bad('productId is required');
  if (!size) throw bad('size is required');
  if (quantity < 1) throw bad('quantity must be at least 1');

  // merge same product+size
  const existing = await prisma.cartItem.findFirst({
    where: { userId, productId, size }
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
  }

  return prisma.cartItem.create({
    data: { userId, productId, quantity, size } // <-- persist size
  });
};

exports.update = async (itemId, quantity) => {
  if (quantity < 1) throw bad('quantity must be at least 1');
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });
};

exports.remove = async (itemId) => {
  await prisma.cartItem.delete({ where: { id: itemId } });
};
