import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error("이메일 발송에 필요한 환경 변수가 설정되지 않았습니다.");
    }

    const surveyLink = `http://localhost:3000/survey?name=${encodeURIComponent(
      name
    )}`;

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
      text: `안녕하세요, ${name}님!
      
문진을 위해 아래 링크를 클릭해 주세요:
${surveyLink}
      
감사합니다.`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "이메일 발송 성공" });
  } catch (_error) {
    console.error("이메일 발송 중 오류 발생:", _error);
    return NextResponse.json(
      {
        message: "이메일 발송 실패",
        error: _error instanceof Error ? _error.message : "알 수 없는 오류",
      },
      { status: 500 }
    );
  }
}
