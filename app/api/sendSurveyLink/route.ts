import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// URL-safe Base64 인코딩 함수
function toBase64Url(buffer: Buffer): string {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// 사용자 데이터를 암호화하여 고유 링크 생성
function generateEncryptedToken(data: object): string {
  const secret = process.env.SECRET_KEY as string;

  // AES-256-CBC 키와 IV 생성
  const key = Buffer.from(secret.padEnd(32, "0").slice(0, 32), "utf-8");
  const iv = crypto.randomBytes(16); // 랜덤 IV 생성

  // 암호화
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encryptedData = Buffer.concat([
    cipher.update(JSON.stringify(data)),
    cipher.final(),
  ]);

  const payload = Buffer.concat([iv, encryptedData]); // IV와 암호화된 데이터 결합
  return toBase64Url(payload); // URL-safe 형태로 반환
}

// 이메일 전송 함수
async function sendSurveyEmail(email: string, name: string, token: string): Promise<void> {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("이메일 환경 변수가 설정되지 않았습니다.");
  }

  const surveyLink = `http://localhost:3000/survey?token=${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: `${name}님, 문진 링크가 도착했습니다.`,
    text: `안녕하세요, ${name}님!\n\n문진을 위해 아래 링크를 클릭해 주세요:\n${surveyLink}\n\n감사합니다.`,
  };

  await transporter.sendMail(mailOptions);
}

// API 핸들러
export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: "이메일 또는 이름이 필요합니다." }, { status: 400 });
    }

    if (!process.env.SECRET_KEY || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ message: "환경 변수가 설정되지 않았습니다." }, { status: 500 });
    }

    // 토큰 생성 및 암호화
    const token = generateEncryptedToken({ email, name, timestamp: Date.now() });

    // 이메일 전송
    await sendSurveyEmail(email, name, token);

    return NextResponse.json({ message: "문진 링크 이메일 발송 완료" });
  } catch (error) {
    console.error("문진 링크 전송 중 오류:", error);
    return NextResponse.json(
      { message: "문진 링크 전송 실패", error: error instanceof Error ? error.message : "알 수 없는 오류" },
      { status: 500 }
    );
  }
}
