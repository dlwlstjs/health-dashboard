import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_SECRET_KEY as string);
    return NextResponse.json({ authenticated: true, user: decoded });
  } catch (error) {
    console.error("토큰 검증 실패:", error);
    return NextResponse.json({ authenticated: false });
  }
}