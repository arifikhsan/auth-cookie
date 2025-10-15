// app/api/echo-token/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader) {
    return NextResponse.json(
      { message: 'No Authorization header found' },
      { status: 200 }
    );
  }

  return NextResponse.json(
    {
      message: 'Authorization header received',
      authorization: authHeader,
    },
    { status: 200 }
  );
}
