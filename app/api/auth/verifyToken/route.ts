// app/api/verifyToken/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  // 여기에서 토큰 검증 로직을 수행
  if (!token || !isValidToken(token)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  return NextResponse.json({ name: "홍길동" }); // 예시 응답
}

function isValidToken(token: string): boolean {
  // 실제 토큰 검증 로직 추가
  return token === "valid-token-example";
}
