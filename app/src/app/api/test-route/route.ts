import { NextRequest, NextResponse } from 'next/server';

// GET request handler
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name') || 'World';
    
    return NextResponse.json({
      message: `Hello, ${name}!`,
      method: 'GET',
      timestamp: new Date().toISOString(),
      query: Object.fromEntries(searchParams.entries())
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// POST request handler
export async function POST(request: NextRequest) {
  try {
    // Parse JSON body
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Data received successfully',
      method: 'POST',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON or request failed' },
      { status: 400 }
    );
  }
}

// PUT request handler
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Resource updated successfully',
      method: 'PUT',
      updatedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 400 }
    );
  }
}

// DELETE request handler
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      message: `Resource with ID ${id} deleted successfully`,
      method: 'DELETE',
      deletedId: id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    );
  }
}