import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    console.log("수신자 이메일:", email); // 수신자 이메일 출력
    console.log("수신자 이름:", name); // 수신자 이름 출력

    const surveyLink = `http://localhost:3000/survey?name=${name}`;

    const transporter = nodemailer.createTransport({
      service: "gmail", // 이메일 서비스 제공자 (Gmail, Outlook 등)
      auth: {
        user: process.env.EMAIL_USER, // 이메일 발신 계정
        pass: process.env.EMAIL_PASS, // 이메일 발신 계정의 비밀번호 또는 앱 비밀번호
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `${name}님, 문진 링크가 도착했습니다.`,
      text: `안녕하세요, ${name}님!
      
      문진을 위해 아래 링크를 클릭해 주세요: ${surveyLink}
      
      
      감사합니다.`,
    };
    
    // 이메일 전송 시도
    console.log("이메일 전송 시도 중...");
    await transporter.sendMail(mailOptions);
    console.log("이메일 전송 성공!");

    return NextResponse.json({ message: "이메일 발송 성공" });
  } catch (error) {
    console.error("이메일 발송 오류:", error); // 오류 메시지 출력
    return NextResponse.json({ message: "이메일 발송 실패" }, { status: 500 });
  }
}
