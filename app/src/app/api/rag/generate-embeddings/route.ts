import { NextRequest, NextResponse } from 'next/server';
import { EmbeddingGenerationService } from '@/features/rag';

export async function POST(request: NextRequest) {
  try {
    const service = new EmbeddingGenerationService();
    const stats = await service.generateAndSaveEmbeddings();

    return NextResponse.json({
      success: true,
      message: 'Embeddings generated and saved successfully',
      stats,
    });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
