const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function badRequest(msg) {
  const err = new Error(msg);
  err.status = 400;
  return err;
}

exports.getFilters = async () => {
  const sizes        = ['XS','S','M','L','XL','XXL'];
  const availability = ['IN_STOCK','OUT_OF_STOCK'];

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

exports.getOne = (id) =>
  prisma.product.findUnique({ where: { id } });

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
    throw badRequest('Missing required fields: title, price, categoryId');
  }

  if (!Array.isArray(images))   throw badRequest('`images` must be an array');
  if (!Array.isArray(sizes))    throw badRequest('`sizes` must be an array');
  if (!Array.isArray(features)) throw badRequest('`features` must be an array');

  return prisma.product.create({
    data: {
      title,
      description,
      price: parseFloat(price),
      stock: Number(stock) || 0,
      images,                  // JSON[] column
      categoryId,
      sizes,                   // JSON[] column
      availability,
      features,                // JSON[] column
      material,
      careInstructions,
      fit,
      length
    }
  });
};

exports.update = async (id, body) => {
  const data = {};

  if ('title' in body)        data.title = body.title;
  if ('description' in body)  data.description = body.description;

  if ('price' in body) {
    const p = parseFloat(body.price);
    if (Number.isNaN(p)) throw badRequest('`price` must be a number');
    data.price = p;
  }

  if ('stock' in body) {
    const s = Number.parseInt(body.stock, 10);
    if (!Number.isFinite(s)) throw badRequest('`stock` must be a number');
    data.stock = s;
  }

  if ('categoryId' in body)   data.categoryId = body.categoryId;
  if ('availability' in body) data.availability = body.availability;
  if ('material' in body)     data.material = body.material;
  if ('careInstructions' in body) data.careInstructions = body.careInstructions;
  if ('fit' in body)          data.fit = body.fit;
  if ('length' in body)       data.length = body.length;

  // Array fields — replace the list using Prisma { set: [...] }
  if ('images' in body) {
    if (!Array.isArray(body.images)) throw badRequest('`images` must be an array of strings');
    data.images = { set: body.images };
  }
  if ('sizes' in body) {
    if (!Array.isArray(body.sizes)) throw badRequest('`sizes` must be an array of strings');
    data.sizes = { set: body.sizes };
  }
  if ('features' in body) {
    if (!Array.isArray(body.features)) throw badRequest('`features` must be an array of strings');
    data.features = { set: body.features };
  }

  // Nothing valid to update?
  if (Object.keys(data).length === 0) {
    throw badRequest('No valid fields to update');
  }

  return prisma.product.update({
    where: { id },
    data
  });
};

exports.remove = (id) =>
  prisma.product.delete({ where: { id } });

exports.search = (q) =>
  prisma.product.findMany({
    where: {
      OR: [
        { title:       { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  });
