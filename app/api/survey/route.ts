import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

// SurveyResult 타입 정의
interface SurveyResult {
  id: number;
  email: string;
  score: string;  // 콤마로 구분된 점수 배열을 문자열로 저장
  status: string;
}

// 서버에서만 사용되는 비밀키 환경변수
const secretKey = process.env.NEXT_SECRET_KEY;

// secretKey가 정의되지 않았을 경우 예외 처리
if (!secretKey) {
  throw new Error("SECRET_KEY가 정의되지 않았습니다. 환경 변수를 확인하세요.");
}

export async function POST(req: Request) {
  const db = await openDb();
  const { email } = await req.json();

  try {
    // 이메일로 설문 결과 찾기
    const result = await db.get(
      'SELECT * FROM health WHERE LOWER(email) = LOWER(?)',
      [email.toLowerCase()]
    ) as unknown as SurveyResult | undefined;

    // 결과가 존재하면 반환
    if (result && result.id) {
      return NextResponse.json({
        message: '설문 결과 가져오기 성공!',
        data: {
          email: result.email,
          score: result.score.split(','), // 점수를 배열 형태로 변환
          status: result.status
        }
      });
    }

    // 결과가 없을 때
    return NextResponse.json({ message: '설문 결과가 없습니다.' }, { status: 404 });
  } catch (error) {
    console.error('설문 결과 가져오기 오류:', error);
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
  } finally {
    await db.close();
  }
}
