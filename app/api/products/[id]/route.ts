import { NextRequest, NextResponse } from 'next/server';
import { PerseusCatalog } from '../../../../lib/catalog';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    // Search in official PerseusCatalog by ID, filename, or slug
    let item = PerseusCatalog.find(p => p.id === id || p.file.includes(id));
    
    if (!item) {
      // Fallback: try by index or loose match
      const numericPart = id.replace(/[^0-9]/g, '');
      if (numericPart) {
        const idx = parseInt(numericPart, 10);
        if (idx > 0 && idx <= PerseusCatalog.length) {
          item = PerseusCatalog[idx - 1];
        }
      }
    }

    if (!item && PerseusCatalog.length > 0) {
      // Graceful fallback to first item if completely missing
      item = PerseusCatalog[0];
    }

    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json(PerseusCatalog[0] || { error: 'Not found' });
  }
}
