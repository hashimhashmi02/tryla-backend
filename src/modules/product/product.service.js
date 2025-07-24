const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = async (query = {}) => {
  const { categoryId, search, minPrice, maxPrice, skip = 0, take = 20 } = query;

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  return prisma.product.findMany({
    where,
    skip: Number(skip),
    take: Number(take),
    orderBy: { createdAt: 'desc' }
  });
};

exports.getOne = (id) =>
  prisma.product.findUnique({ where: { id } });

exports.create = async ({ title, description, price, stock = 0, images = [], categoryId }) => {
  if (!title || !price || !categoryId) throw new Error('Missing fields');
  return prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      stock,
      images,
      categoryId
    }
  });
};

exports.update = (id, data) => {
  if (data.price) data.price = parseFloat(data.price);
  return prisma.product.update({ where: { id }, data });
};

exports.remove = (id) =>
  prisma.product.delete({ where: { id } });
