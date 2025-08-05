const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.list = () =>
  prisma.navLink.findMany({ orderBy: { order: 'asc' } });

exports.create = ({ label, url, order }) =>
  prisma.navLink.create({ data: { label, url, order } });

exports.update = (id, data) =>
  prisma.navLink.update({ where: { id }, data });

exports.remove = id =>
  prisma.navLink.delete({ where: { id } });
