import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/stores
// Returns all stores for dropdowns etc.
export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      stores: stores.map((s) => ({
        id: s.id,
        name: s.name,
        city: s.city ?? null,
        state: s.state ?? null,
      })),
    });
  } catch (error) {
    // If the DB is temporarily unreachable (e.g. Mongo Atlas network issue),
    // log the detailed error but do NOT crash the page – instead return
    // an empty list so the frontend can still render with "No stores configured".
    console.error('Error in GET /api/stores', error);

    return NextResponse.json(
      { stores: [], warning: 'Store DB unavailable – returning empty list' },
      { status: 200 },
    );
  }
}

// POST /api/stores
// Bulk upsert stores (for Croma / VS Excel import etc.)
// Body shape:
// {"stores": [{"id": "store_00001", "name": "Croma ...", "city": "...", "state": "..."}, ...]}
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const stores = Array.isArray(body)
      ? body
      : Array.isArray(body?.stores)
      ? body.stores
      : [];

    if (!Array.isArray(stores) || stores.length === 0) {
      return NextResponse.json(
        { error: 'Request body must be an array of stores or { stores: [...] }' },
        { status: 400 },
      );
    }

    const results = [] as { id: string; name: string }[];

    for (const raw of stores) {
      const id = typeof raw?.id === 'string' && raw.id.trim() ? raw.id.trim() : null;
      const name = typeof raw?.name === 'string' && raw.name.trim() ? raw.name.trim() : null;

      if (!id || !name) {
        // Skip invalid rows instead of failing whole batch
        console.warn('Skipping store without id/name', raw);
        continue;
      }

      const city = typeof raw.city === 'string' ? raw.city : null;
      const state = typeof raw.state === 'string' ? raw.state : null;

      const upserted = await prisma.store.upsert({
        where: { id },
        update: {
          name,
          city,
          state,
        },
        create: {
          id,
          name,
          city,
          state,
        },
      });

      results.push({ id: upserted.id, name: upserted.name });
    }

    return NextResponse.json(
      {
        insertedOrUpdated: results.length,
        stores: results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in POST /api/stores', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
