import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  // 토큰 값 확인
  //console.log("받은 토큰:", token);

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_SECRET_KEY as string);
    
    // 디코딩된 데이터 확인
    console.log("디코딩된 토큰 내용:", decoded);

    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return NextResponse.json({ authenticated: false });
  }
}
