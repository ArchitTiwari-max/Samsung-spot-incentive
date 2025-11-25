const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.samsungSku.count();
    console.log('SamsungSku count:', count);
    const first = await prisma.samsungSku.findFirst();
    console.log('Sample document:', first);
  } catch (err) {
    console.error('Error querying SamsungSku:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
