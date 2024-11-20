import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// 토큰 생성 함수
function generateSignedToken(): string {
  const secret = process.env.SECRET_KEY as string; // 환경 변수에서 비밀 키 가져오기
  const timestamp = Math.floor(Date.now() / 1000); // 현재 타임스탬프
  const data = `${timestamp}`; // 데이터 포맷: "timestamp"

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);

  const token = hmac.digest("hex");
  return `${timestamp}.${token}`; // "timestamp.hash" 형태로 반환
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: "이메일 또는 이름이 필요합니다." }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ message: "이메일 환경 변수가 설정되지 않았습니다." }, { status: 500 });
    }

    // 토큰 생성
    const token = generateSignedToken();
    const surveyLink = `http://localhost:3000/survey?name=${encodeURIComponent(name)}&token=${token}`;

    // 이메일 전송 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${name}님, 문진 링크가 도착했습니다.`,
      text: `안녕하세요, ${name}님!\n\n문진을 위해 아래 링크를 클릭해 주세요:\n${surveyLink}\n\n감사합니다.`,
    };

    // 이메일 전송
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "이메일 발송 성공" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("이메일 발송 중 오류:", errorMessage);

    return NextResponse.json(
      { message: "이메일 발송 실패", error: errorMessage },
      { status: 500 }
    );
  }
}
