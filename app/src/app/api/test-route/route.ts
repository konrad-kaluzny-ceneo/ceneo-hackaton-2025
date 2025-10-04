import container from '@/infrastructure/DIContainer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST() {
  const handler = container.addItemHandler;
  await handler.handle('Sample Item');
  return NextResponse.json({ message: 'Hello from test-route POST' });
}

export async function GET(request: NextRequest) {
  try {
    const handler = container.getItemsHandler;
    const result = await handler.handle();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}