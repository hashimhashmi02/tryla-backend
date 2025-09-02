const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const badRequest = (m) => Object.assign(new Error(m), { status: 400 });

exports.create = ({ name }) => {
  if (!name) throw badRequest("name is required");
  return prisma.category.create({ data: { name } });
};

exports.list = () => prisma.category.findMany({ orderBy: { createdAT: 'desc' } });

exports.getOne = (id) => prisma.category.findUnique({ where: { id } });

exports.update = (id, { name }) => {
  if (!name) throw badRequest('name is required');
  return prisma.category.update({ where: { id }, data: { name } });
};
