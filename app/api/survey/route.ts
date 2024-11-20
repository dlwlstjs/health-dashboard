import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const name = url.searchParams.get('name');
  const token = url.searchParams.get('token');

  if (!name || !token) {
    return NextResponse.json({ message: '이름과 토큰이 필요합니다.' }, { status: 400 });
  }

  try {
    console.log('추출된 이름:', name); // 이름 확인 (디버그용)
    console.log('추출된 토큰:', token); // 토큰 확인 (디버그용)

    return NextResponse.json({ message: '이름과 토큰 추출 성공', name });
  } catch (error) {
    console.error('파라미터 처리 오류:', error);
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
  }
}
