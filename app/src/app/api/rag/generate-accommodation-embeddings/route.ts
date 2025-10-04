import { NextRequest, NextResponse } from 'next/server';
import { AccommodationEmbeddingService } from '@/features/rag';

export async function POST(request: NextRequest) {
  try {
    const service = new AccommodationEmbeddingService();
    const stats = await service.generateAndSaveEmbeddings();

    return NextResponse.json({
      success: true,
      message: 'Accommodation embeddings generated and saved successfully',
      stats,
    });
  } catch (error) {
    console.error('Error generating accommodation embeddings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
