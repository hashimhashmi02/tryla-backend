const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getFilters = async () => {
  // 1) enums
  const sizes        = ['XS','S','M','L','XL','XXL'];
  const availability = ['IN_STOCK','OUT_OF_STOCK'];

  // 2) fetch categories
  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });

  return { sizes, availability, categories };
};

exports.list = async (query = {}) => {
  const {
    categoryId, search,
    minPrice, maxPrice,
    skip = 0, take = 20
  } = query;

  const where = {};
  if (categoryId) where.categoryId = categoryId;
  if (search) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  if (minPrice != null || maxPrice != null) {
    where.price = {};
    if (minPrice != null) where.price.gte = parseFloat(minPrice);
    if (maxPrice != null) where.price.lte = parseFloat(maxPrice);
  }

  return prisma.product.findMany({
    where,
    skip: Number(skip),
    take: Number(take),
    orderBy: { createdAt: 'desc' }
  });
};

exports.getOne = async (id) => {
  return prisma.product.findUnique({
    where: { id }
  });
};

exports.create = async (data) => {
  const {
    title, description,
    price, stock = 0,
    images = [], categoryId,
    sizes = [], availability,
    features = [], material,
    careInstructions, fit, length
  } = data;

  if (!title || price == null || !categoryId) {
    throw new Error('Missing required fields: title, price, categoryId');
  }

  return prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      stock,
      images,
      categoryId,
      sizes,
      availability,
      features,
      material,
      careInstructions,
      fit,
      length
    }
  });
};

exports.update = async (id, data) => {
  if (data.price != null) {
    data.price = parseFloat(data.price);
  }
  return prisma.product.update({
    where: { id },
    data
  });
};

exports.remove = async (id) => {
  return prisma.product.delete({
    where: { id }
  });
};
