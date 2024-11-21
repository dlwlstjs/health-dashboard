import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import sqlite3 from "sqlite3";

// SQLite 연결
const db = new sqlite3.Database('./database.sqlite');

// 토큰 생성 함수
function generateSignedToken(patientInfo: {
  email: string;
  name: string;
  gender: string;
  birthdate: string;
  link?: string;
  doctor?: string;
}): string {
  const secret = process.env.SECRET_KEY as string; // 환경 변수에서 비밀 키 가져오기
  const timestamp = Math.floor(Date.now() / 1000); // 현재 타임스탬프
  const data = {
    ...patientInfo,
    timestamp,
  };

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(data)); // 객체를 문자열로 변환하여 해시값 생성

  const token = hmac.digest("hex");
  return `${timestamp}.${token}`; // "timestamp.hash" 형태로 반환
}

export async function POST(request: Request) {
  try {
    const { email, name, gender, birthdate } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ message: "이메일 또는 이름이 필요합니다." }, { status: 400 });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ message: "이메일 환경 변수가 설정되지 않았습니다." }, { status: 500 });
    }

    // 환자 정보 객체 생성
    const patientInfo = { email, name, gender, birthdate };

    // 토큰 생성
    const token = generateSignedToken(patientInfo);
    const surveyLink = `http://localhost:3000/survey?token=${token}`;  // 이름 파라미터 제거

    // 환자 테이블에서 해당 이메일의 link 필드 업데이트
    db.run(
      "UPDATE patient SET link = ? WHERE email = ?",
      [surveyLink, email],
      function (err) {
        if (err) {
          console.error("환자 정보 업데이트 중 오류:", err.message);
          return NextResponse.json({ message: "환자 정보 업데이트 실패" }, { status: 500 });
        }
      }
    );

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
