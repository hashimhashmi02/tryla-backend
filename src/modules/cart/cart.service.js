const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Flat shipping fee (you can make it configurable later)
const SHIPPING_FEE = 0;

/**
 * @param {string} userId
 * @returns {Promise<{ items: Array, summary: { subtotal:number, shipping:number, total:number } }>}
 */
exports.getCart = async (userId) => {
  
  const rawItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true }
  });

  const items = rawItems.map(ci => ({
    id: ci.id,
    quantity: ci.quantity,
    product: {
      id:           ci.product.id,
      title:        ci.product.title,
      price:        Number(ci.product.price),
      images:       ci.product.images,
      availability: ci.product.availability,
      categoryId:   ci.product.categoryId
      
    }
  }));


  const subtotal = items.reduce(
    (sum, it) => sum + it.product.price * it.quantity,
    0
  );
  const shipping = SHIPPING_FEE;
  const total    = subtotal + shipping;

  return { items, summary: { subtotal, shipping, total } };
};

/**
 * @param {string} userId
 * @param {string} productId
 * @param {number} quantity
 * @returns {Promise<CartItem>}
 */
exports.create = async (userId, productId, quantity = 1) => {
  if (!productId) {
    const err = new Error('productId is required');
    err.status = 400;
    throw err;
  }
  if (quantity < 1) {
    const err = new Error('Quantity must be at least 1');
    err.status = 400;
    throw err;
  }


  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_productId: { userId, productId }
    }
  });

  if (existing) {
    return prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity }
    });
  }

  return prisma.cartItem.create({
    data: {
      userId,
      productId,
      quantity
    }
  });
};

/**

 * @param {string} itemId
 * @param {number} quantity
 * @returns {Promise<CartItem>}
 */
exports.update = async (itemId, quantity) => {
  if (quantity < 1) {
    const err = new Error('Quantity must be at least 1');
    err.status = 400;
    throw err;
  }
  return prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity }
  });
};

/**

 * @param {string} itemId
 * @returns {Promise<void>}
 */
exports.remove = async (itemId) => {
  await prisma.cartItem.delete({
    where: { id: itemId }
  });
};
