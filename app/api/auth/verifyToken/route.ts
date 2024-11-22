import { NextResponse } from "next/server";
import crypto from "crypto";

function fromBase64Url(base64Url: string): Buffer {
  return Buffer.from(base64Url.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function decryptEncryptedToken(token: string): object {
  const secret = process.env.SECRET_KEY as string;
  const key = Buffer.from(secret.padEnd(32, "0").slice(0, 32), "utf-8");
  const payload = fromBase64Url(token);
  const iv = payload.slice(0, 16);
  const encryptedData = payload.slice(16);

  // 복호화
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decryptedData = Buffer.concat([
    decipher.update(encryptedData),
    decipher.final(),
  ]);

  return JSON.parse(decryptedData.toString("utf-8"));
}

// 토큰 복호화 및 검증 함수
export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: "토큰이 제공되지 않았습니다." },
        { status: 400 }
      );
    }

    const data = decryptEncryptedToken(token);

    return NextResponse.json({ message: "토큰 검증 성공", data }, { status: 200 });
  } catch (error) {
    console.error("복호화 중 오류:", error);
    return NextResponse.json(
      { message: "토큰 검증 실패", error: (error as Error).message || "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
