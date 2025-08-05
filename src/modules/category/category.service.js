const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.create = async({name})=>{
    if(!name) throw new Error('name required');
    return prisma.category.create({data:{name}});
};

exports.list = async()=> prisma.category.findMany(); 