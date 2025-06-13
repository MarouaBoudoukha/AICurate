import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { userId, answers } = await req.json();
  // answers: array of { questionId, answer, score? }
  const results = await Promise.all(
    answers.map(async (a: any) =>
      prisma.userQuizResult.upsert({
        where: { userId_questionId: { userId, questionId: a.questionId } },
        update: { answer: a.answer, score: a.score },
        create: { userId, questionId: a.questionId, answer: a.answer, score: a.score }
      })
    )
  );
  return NextResponse.json({ success: true, results });
} 