import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

export async function POST(req: NextRequest) {
  const { userName } = await req.json();
  
  const db = await openDb();
  
  try {
    // 환자의 문진 결과를 가져오기
    const result = db.prepare('SELECT * FROM survey_results WHERE name = ?').get(userName);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ message: '문진 결과가 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('데이터베이스 오류:', error);
    return NextResponse.json({ message: '문진 결과 조회에 실패했습니다.' }, { status: 500 });
  } finally {
    db.close();
  }
}
