const { PrismaClient, Prisma } = require('@prisma/client')
const prisma = new PrismaClient()

/**
 
 * @param {string} userId
 * @param {string} shippingAddress
 * @param {string} recipientName
 * @param {string} recipientPhone
 * @returns {Promise<Order>}
 */
exports.createOrder = async (
  userId,
  shippingAddress,
  recipientName,
  recipientPhone
) => {
 
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  })
  if (cartItems.length === 0) {
    const err = new Error('Cart is empty')
    err.status = 400
    throw err
  }

  let total = 0
  const orderItemsData = cartItems.map(ci => {
    const price = Number(ci.product.price)
    total += price * ci.quantity
    return {
      productId: ci.productId,
      quantity:  ci.quantity,
      price,                   // snapshot of unit price
    }
  })


  const order = await prisma.$transaction(async tx => {
    const o = await tx.order.create({
      data: {
        userId,
        total,
        shippingAddress,
        recipientName,
        recipientPhone,
        items: { create: orderItemsData },
      },
      include: { items: true },
    })
    // clear cart
    await tx.cartItem.deleteMany({ where: { userId } })
    return o
  })

  return order
}

/**

 * @param {{ id: string, role: string }} user
 * @returns {Promise<Order[]>}
 */
exports.listOrders = async user => {
  const where = user.role === Prisma.OrderStatus.ADMIN ? {} : { userId: user.id }
  return prisma.order.findMany({
    where,
    include: {
      user:  true,
      items: { include: { product: true } }
    },
    orderBy: { createdAt: 'desc' }
  })
}

/**

 * @param {{ id: string, role: string }} user
 * @param {string} orderId
 * @returns {Promise<Order|null>}
 */
exports.getOrder = async (user, orderId) => {
  const where = user.role === Prisma.OrderStatus.ADMIN
    ? { id: orderId }
    : { id: orderId, userId: user.id }

  return prisma.order.findUnique({
    where,
    include: {
      user:  true,
      items: { include: { product: true } }
    }
  })
}

/**

 * @param {string} orderId
 * @param {string} status  // e.g. 'PENDING'|'PAID'|'SHIPPED'|'DELIVERED'
 * @returns {Promise<Order>}
 */
exports.updateStatus = async (orderId, status) => {
  return prisma.order.update({
    where: { id: orderId },
    data: { status }
  })
}
