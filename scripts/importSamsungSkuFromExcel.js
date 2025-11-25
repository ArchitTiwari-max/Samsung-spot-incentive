const { PrismaClient } = require('@prisma/client');
const XLSX = require('xlsx');

const prisma = new PrismaClient();

const HEADER_CATEGORY = 'Category';
const HEADER_MODEL_NAME = 'Model_Name';
const HEADER_SCREEN_PROTECT = 'Screen Protect ( 1 Yr )';
const HEADER_ADLD = 'ADLD ( 1 Yr )';
const HEADER_COMBO = 'Combo ( 2Yrs )';
const HEADER_EXTENDED_WARRANTY = 'Extended Warranty ( 1 Yr )';

function toInt(value) {
  if (value == null || value === '') return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[\s,]/g, ''));
  return Number.isFinite(num) ? Math.round(num) : null;
}

async function main() {
  try {
    const workbook = XLSX.readFile('Samsung SKU with Plan Price (1).xlsx');
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: null });

    console.log('Rows in Excel:', rows.length);

    const cleaned = rows
      .map((row) => {
        const categoryRaw = row[HEADER_CATEGORY];
        const modelNameRaw = row[HEADER_MODEL_NAME];

        const category = typeof categoryRaw === 'string' ? categoryRaw.trim() : String(categoryRaw ?? '').trim();
        const modelName = typeof modelNameRaw === 'string' ? modelNameRaw.trim() : String(modelNameRaw ?? '').trim();

        if (!category || !modelName) return null;

        return {
          category,
          modelName,
          screenProtect1Yr: toInt(row[HEADER_SCREEN_PROTECT]),
          adld1Yr: toInt(row[HEADER_ADLD]),
          combo2Yrs: toInt(row[HEADER_COMBO]),
          extendedWarranty1Yr: toInt(row[HEADER_EXTENDED_WARRANTY]),
        };
      })
      .filter(Boolean);

    console.log('Valid rows:', cleaned.length);

    let count = 0;
    for (const row of cleaned) {
      await prisma.samsungSku.upsert({
        where: { modelName: row.modelName },
        update: {
          category: row.category,
          screenProtect1Yr: row.screenProtect1Yr,
          adld1Yr: row.adld1Yr,
          combo2Yrs: row.combo2Yrs,
          extendedWarranty1Yr: row.extendedWarranty1Yr,
        },
        create: {
          category: row.category,
          modelName: row.modelName,
          screenProtect1Yr: row.screenProtect1Yr,
          adld1Yr: row.adld1Yr,
          combo2Yrs: row.combo2Yrs,
          extendedWarranty1Yr: row.extendedWarranty1Yr,
        },
      });
      count += 1;
    }

    console.log('Upserted rows:', count);
  } catch (err) {
    console.error('Error importing from Excel:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
