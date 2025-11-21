import { PrismaClient, Role, Validation } from '@prisma/client';

const prisma = new PrismaClient();

function buildStoreId(n: number): string {
  return `store_${n.toString().padStart(5, '0')}`;
}

async function main() {
  // ----- STORES -----
  const stores = [
    { id: buildStoreId(1), name: 'Croma - Mumbai Oberoi Mall', city: 'Mumbai', state: 'Maharashtra' },
    { id: buildStoreId(2), name: 'Croma - Noida Mall of India', city: 'Noida', state: 'Uttar Pradesh' },
    { id: buildStoreId(3), name: 'Vijay Sales - Pune Chinchwad', city: 'Pune', state: 'Maharashtra' },
    { id: buildStoreId(4), name: 'Croma - Bengaluru Indiranagar', city: 'Bengaluru', state: 'Karnataka' },
    { id: buildStoreId(5), name: 'Croma - Delhi Rohini', city: 'Delhi', state: 'Delhi' },
  ];

  for (const store of stores) {
    await prisma.store.upsert({
      where: { id: store.id },
      update: {
        name: store.name,
        city: store.city,
        state: store.state,
      },
      create: store,
    });
  }

  // ----- HELPERS FOR ZBM / ZSE -----
  async function ensureZbm(
    username: string,
    fullName: string,
    phone: string,
    region: string,
  ) {
    let user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: 'Password@123', // demo only
          role: Role.ZBM,
          validation: Validation.APPROVED,
          metadata: {},
        },
      });
    }

    await prisma.zBM.upsert({
      where: { userId: user.id },
      update: {
        fullName,
        phone,
        region,
      },
      create: {
        userId: user.id,
        fullName,
        phone,
        region,
      },
    });
  }

  async function ensureZse(
    username: string,
    fullName: string,
    phone: string,
    region: string,
  ) {
    let user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          username,
          password: 'Password@123', // demo only
          role: Role.ZSE,
          validation: Validation.APPROVED,
          metadata: {},
        },
      });
    }

    await prisma.zSE.upsert({
      where: { userId: user.id },
      update: {
        fullName,
        phone,
        region,
      },
      create: {
        userId: user.id,
        fullName,
        phone,
        region,
      },
    });
  }

  // ----- 5 ZBMs (Indian names) -----
  await Promise.all([
    ensureZbm('zbm.mumbai', 'Rajesh Sharma', '9876543210', 'Mumbai'),
    ensureZbm('zbm.delhi', 'Amit Verma', '9876501234', 'Delhi NCR'),
    ensureZbm('zbm.pune', 'Sandeep Kulkarni', '9876512345', 'Pune'),
    ensureZbm('zbm.bengaluru', 'Rohit Nair', '9876523456', 'Bengaluru'),
    ensureZbm('zbm.kolkata', 'Anirban Ghosh', '9876534567', 'Kolkata'),
  ]);

  // ----- 5 ZSEs (Indian names) -----
  await Promise.all([
    ensureZse('zse.mumbai', 'Neha Gupta', '9867543210', 'Mumbai'),
    ensureZse('zse.delhi', 'Pooja Singh', '9867501234', 'Delhi NCR'),
    ensureZse('zse.pune', 'Kiran Patil', '9867512345', 'Pune'),
    ensureZse('zse.bengaluru', 'Smita Rao', '9867523456', 'Bengaluru'),
    ensureZse('zse.kolkata', 'Soumya Banerjee', '9867534567', 'Kolkata'),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
