import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const data = await req.json();
  const session = await prisma.agentSession.create({ data });
  return NextResponse.json(session);
}

export async function PUT(req: NextRequest) {
  const data = await req.json();
  const session = await prisma.agentSession.update({
    where: { id: data.id },
    data
  });
  return NextResponse.json(session);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const session = await prisma.agentSession.findUnique({ where: { id } });
  if (!session) return NextResponse.json({ error: 'Session not found' }, { status: 404 });
  return NextResponse.json(session);
} 