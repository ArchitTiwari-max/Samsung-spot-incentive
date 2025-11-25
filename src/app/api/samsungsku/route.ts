import { NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { prisma } from '@/lib/prisma';

// We need Node.js runtime because we may read a local XLSX file from disk
export const runtime = 'nodejs';

// Column names as they appear in the Excel sheet
const HEADER_CATEGORY = 'Category';
const HEADER_MODEL_NAME = 'Model_Name';
const HEADER_SCREEN_PROTECT = 'Screen Protect ( 1 Yr )';
const HEADER_ADLD = 'ADLD ( 1 Yr )';
const HEADER_COMBO = 'Combo ( 2Yrs )';
const HEADER_EXTENDED_WARRANTY = 'Extended Warranty ( 1 Yr )';

// Helper to convert any cell value to an integer (or null)
function toInt(value: unknown): number | null {
  if (value == null || value === '') return null;
  const num = typeof value === 'number' ? value : Number(String(value).replace(/[,\s]/g, ''));
  return Number.isFinite(num) ? Math.round(num) : null;
}

// GET /api/samsungsku
// Returns information for device dropdowns, including plan prices
export async function GET() {
  try {
    const rows = await prisma.samsungSku.findMany({
      orderBy: [
        { category: 'asc' },
        { modelName: 'asc' },
      ],
      select: {
        id: true,
        category: true,
        modelName: true,
        screenProtect1Yr: true,
        adld1Yr: true,
        combo2Yrs: true,
        extendedWarranty1Yr: true,
      },
    });

    return NextResponse.json({
      devices: rows.map((row) => ({
        id: row.id,
        category: row.category,
        modelName: row.modelName,
        // Convenience label for dropdowns like "Premium - A55"
        label: `${row.category} - ${row.modelName}`,
        plans: [
          row.screenProtect1Yr != null
            ? { key: 'screenProtect1Yr', label: 'Screen Protect (1 Yr)', price: row.screenProtect1Yr }
            : null,
          row.adld1Yr != null
            ? { key: 'adld1Yr', label: 'ADLD (1 Yr)', price: row.adld1Yr }
            : null,
          row.combo2Yrs != null
            ? { key: 'combo2Yrs', label: 'Combo (2 Yrs)', price: row.combo2Yrs }
            : null,
          row.extendedWarranty1Yr != null
            ? { key: 'extendedWarranty1Yr', label: 'Extended Warranty (1 Yr)', price: row.extendedWarranty1Yr }
            : null,
        ].filter(Boolean),
      })),
    });
  } catch (error) {
    console.error('Error in GET /api/samsungsku', error);
    return NextResponse.json({ devices: [] }, { status: 200 });
  }
}

// POST /api/samsungsku
// Imports Samsung SKUs from an Excel file into MongoDB (collection "samsungsku").
// It supports two modes:
// 1) multipart/form-data with a "file" field (recommended for UI upload)
// 2) no body: falls back to the local file "Samsung SKU with Plan Price (1).xlsx" in the project root
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get('content-type') ?? '';

    let jsonRows: any[] = [];

    if (contentType.startsWith('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');

      if (!file || !(file instanceof Blob)) {
        return NextResponse.json(
          { error: 'Expected a file field named "file" in multipart/form-data body' },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await (file as Blob).arrayBuffer());
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonRows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    } else {
      // Fallback: read the known Excel file in the project root
      const workbook = XLSX.readFile('Samsung SKU with Plan Price (1).xlsx');
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      jsonRows = XLSX.utils.sheet_to_json(sheet, { defval: null });
    }

    if (!Array.isArray(jsonRows) || jsonRows.length === 0) {
      return NextResponse.json({ error: 'No rows found in Excel file' }, { status: 400 });
    }

    const cleaned = jsonRows
      .map((row) => {
        const categoryRaw = (row as any)[HEADER_CATEGORY];
        const modelNameRaw = (row as any)[HEADER_MODEL_NAME];

        const category = typeof categoryRaw === 'string' ? categoryRaw.trim() : String(categoryRaw ?? '').trim();
        const modelName = typeof modelNameRaw === 'string' ? modelNameRaw.trim() : String(modelNameRaw ?? '').trim();

        if (!category || !modelName) return null;

        return {
          category,
          modelName,
          screenProtect1Yr: toInt((row as any)[HEADER_SCREEN_PROTECT]),
          adld1Yr: toInt((row as any)[HEADER_ADLD]),
          combo2Yrs: toInt((row as any)[HEADER_COMBO]),
          extendedWarranty1Yr: toInt((row as any)[HEADER_EXTENDED_WARRANTY]),
        };
      })
      .filter(Boolean) as {
      category: string;
      modelName: string;
      screenProtect1Yr: number | null;
      adld1Yr: number | null;
      combo2Yrs: number | null;
      extendedWarranty1Yr: number | null;
    }[];

    if (cleaned.length === 0) {
      return NextResponse.json({ error: 'No valid rows with Category and Model_Name found' }, { status: 400 });
    }

    const upserted: { id: string; modelName: string }[] = [];

    for (const row of cleaned) {
      const result = await prisma.samsungSku.upsert({
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

      upserted.push({ id: result.id, modelName: result.modelName });
    }

    return NextResponse.json({
      insertedOrUpdated: upserted.length,
      devices: upserted,
    });
  } catch (error) {
    console.error('Error in POST /api/samsungsku', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
