import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

type HealthRecord = {
  score: string;
};

export async function GET(req: Request) {
  const db = await openDb();
  const url = new URL(req.url);
  const email = url.searchParams.get('email');

  if (!email) {
    return NextResponse.json({ message: '이메일이 제공되지 않았습니다.' }, { status: 400 });
  }

  try {
    const result = (await db.get(
      `SELECT score FROM health WHERE email = ?`,
      [email]
    )) as unknown as HealthRecord | undefined;

    if (!result) {
      return NextResponse.json({ message:'' }, { status: 404 });
    }

    return NextResponse.json({
      score: result.score,
    });
  } catch (error) {
    console.error('데이터 조회 중 오류 발생:', error);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await db.close();
  }
}
