import * as XLSX from 'xlsx';
import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

function buildStoreId(n: number): string {
  return `store_${n.toString().padStart(5, '0')}`;
}

interface ExcelRow {
  'Store Name'?: string;
  'City'?: string;
  'State'?: string;
  'Id'?: string;
  // Handle various possible column names
  [key: string]: any;
}

async function main() {
  const excelPath = path.join(__dirname, '..', 'Croma & VS Store.xlsx');
  console.log('Reading Excel file: Croma & VS Store.xlsx');
  console.log('From path:', excelPath);
  
  const workbook = XLSX.readFile(excelPath);
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];

  console.log(`Processing sheet: ${firstSheetName}`);
  
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(sheet, { defval: '' });
  
  console.log(`Found ${rows.length} rows in Excel`);

  let imported = 0;
  let skipped = 0;
  let updated = 0;
  let startIndex = 1;

  // Get current max store number and existing store IDs
  const existingStores = await prisma.store.findMany({ select: { id: true } });
  const existingIds = new Set(existingStores.map(s => s.id));
  const existingNumbers = existingStores
    .map(s => {
      const match = s.id.match(/store_(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(n => n > 0);
  
  if (existingNumbers.length > 0) {
    startIndex = Math.max(...existingNumbers) + 1;
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    // Try to find store name in various possible columns
    const storeName = row['Store Name'] || row['store_name'] || row['name'] || row['Name'] || '';
    
    if (!storeName || typeof storeName !== 'string' || !storeName.trim()) {
      console.log(`Row ${i + 1}: Skipping - no store name found`);
      skipped++;
      continue;
    }

    const city = (row['City'] || row['city'] || '').toString().trim() || null;
    const state = (row['State'] || row['state'] || '').toString().trim() || null;
    
    // Use provided ID or generate one
    const id = row['Id'] && row['Id'].toString().trim() 
      ? row['Id'].toString().trim()
      : buildStoreId(startIndex + i);

    try {
      // Check if store already exists
      if (existingIds.has(id)) {
        // Update existing store
        await prisma.store.update({
          where: { id },
          data: {
            name: storeName.trim(),
            city,
            state,
          },
        });
        updated++;
        console.log(`Row ${i + 1}: ↻ Updated ${storeName.trim()} (${id})`);
      } else {
        // Create new store
        await prisma.store.create({
          data: {
            id,
            name: storeName.trim(),
            city,
            state,
          },
        });
        existingIds.add(id); // Add to set to avoid duplicate checks
        imported++;
        console.log(`Row ${i + 1}: ✓ Imported ${storeName.trim()} (${id})`);
      }
    } catch (error: any) {
      // Handle duplicate key error specifically
      if (error.code === 11000 || error.code === 'P2002') {
        console.log(`Row ${i + 1}: Skipping - ${storeName.trim()} (${id}) already exists`);
      } else {
        console.error(`Row ${i + 1}: Failed to import ${storeName}:`, error.message || error);
      }
      skipped++;
    }
  }

  console.log('\n=== Import Summary ===');
  console.log(`Total rows in Excel: ${rows.length}`);
  console.log(`Successfully imported: ${imported}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped/Failed: ${skipped}`);
  
  // Show all stores now in DB
  const allStores = await prisma.store.findMany({ orderBy: { name: 'asc' } });
  console.log(`\nTotal stores in database: ${allStores.length}`);
  if (allStores.length <= 20) {
    console.log('\nAll stores:');
    allStores.forEach((store, idx) => {
      console.log(`  ${idx + 1}. ${store.name} - ${store.city || 'N/A'} - ${store.state || 'N/A'}`);
    });
  } else {
    console.log(`\nShowing first 10 stores (total: ${allStores.length}):`);
    allStores.slice(0, 10).forEach((store, idx) => {
      console.log(`  ${idx + 1}. ${store.name} - ${store.city || 'N/A'} - ${store.state || 'N/A'}`);
    });
    console.log('  ...');
  }
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
