const { PrismaClient } = require('@prisma/client');
const prisma            = new PrismaClient();
const SIZES        = ['S','M','L','XL'];
const AVAILABILITY = ['IN_STOCK','OUT_OF_STOCK'];

exports.getFilters = async () => {
  const categories = await prisma.category.findMany({
    select: { id: true, name: true }
  });
  return { sizes: SIZES, availability: AVAILABILITY, categories };
};

exports.list = async ({
  categoryId,
  search,
  minPrice,
  maxPrice,
  skip = 0,
  take = 20
} = {}) => {
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
    skip:   Number(skip),
    take:   Number(take),
    orderBy:{ createdAt: 'desc' }
  });
};

exports.getOne = (id) =>
  prisma.product.findUnique({ where: { id } });

exports.create = async ({
  title,
  description,
  price,
  stock            = 0,
  images           = [],
  sizes            = [],
  categoryId,
  availability     = 'IN_STOCK',
  features         = [],
  material         = null,
  careInstructions = null,
  fit              = null,
  length           = null
}) => {
  if (!title || price == null || !categoryId) {
    throw new Error('Missing required fields: title, price, categoryId');
  }
  return prisma.product.create({
    data: {
      title,
      description,
      price:            parseFloat(price),
      stock,
      images,
      sizes,
      categoryId,
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

exports.remove = (id) =>
  prisma.product.delete({ where: { id } });
