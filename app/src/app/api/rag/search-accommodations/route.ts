import { NextRequest, NextResponse } from 'next/server';
import { AccommodationSearchService } from '@/features/rag';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 3 } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Query parameter is required and must be a string',
        },
        { status: 400 }
      );
    }

    const service = new AccommodationSearchService();
    const results = await service.searchAccommodations(query, limit);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching accommodations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: 'Query parameter is required',
        },
        { status: 400 }
      );
    }

    const service = new AccommodationSearchService();
    const results = await service.searchAccommodations(query, limit);

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Error searching accommodations:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
