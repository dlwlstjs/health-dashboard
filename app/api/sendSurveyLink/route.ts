import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

// 인코딩 함수 링크의 -+=를 변환한다. -> 안그러면 오해할 일이 생기기 때문. 예를들어 +:공백, /:구분자, =:잘못된 파라미터로 오해
//URL-safe한 형식 만들기
// function toBase64Url(buffer: Buffer): string {
//   return buffer
//     .toString("base64") //데이터를 6byte씩 잘라서 string으로 만듦.
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_")
//     .replace(/=+$/, "");
// }

function generateEncryptedToken(data: object): string {
  const secret = process.env.SECRET_KEY as string;

  // AES-256-CBC 키와 IV 생성
  const key = Buffer.from(secret, "utf-8"); //byte를 32로 맞춤, 문자열을 버퍼 객체로 변환
  const iv = crypto.randomBytes(16);        //16바이트의 랜덤값 생성. 동일한 입력 데이터라도 IV가 다르면 암호화된 결과가 달라져 패턴이 드러나는 것을 방지

  // 암호화
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv); //256바꾸면 오류남. 메일 전송이 안됨. -> 애초에 생성이 안됐기 때문.
  const encryptedData = Buffer.concat([
    cipher.update(JSON.stringify(data)),  //데이터가 블록 크기의 배수가 아니라면
    cipher.final(),                       //final에서 절반을 암호화한다.
  ]);

  const payload = Buffer.concat([iv, encryptedData]);   //한번 더 iv와 조합
  return payload.toString("hex"); // "base64" -> "hex"로 바꿔서 인코딩했다.
}

async function sendSurveyEmail(email: string, name: string, token: string): Promise<void> {
  const { EMAIL_USER, EMAIL_PASS } = process.env;

  if (!EMAIL_USER || !EMAIL_PASS) {
    throw new Error("이메일 환경 변수가 설정되지 않았습니다.");
  }

  const surveyLink = `http://localhost:3000/survey?token=${token}`;
  const transporter = nodemailer.createTransport({ //-> email 정보는 담는 객체 생성 함수
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  const mailOptions = { //->이메일로 보낼 내용 담는 함수
    from: EMAIL_USER,
    to: email,
    subject: `${name}님, 문진 링크가 도착했습니다.`,
    text: `안녕하세요, ${name}님!\n\n문진을 위해 아래 링크를 클릭해 주세요:\n${surveyLink}\n\n감사합니다.`,
  };
  await transporter.sendMail(mailOptions); //-> 전송
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();
    if (!email || !name) {
      return NextResponse.json({ message: "이메일 또는 이름이 필요합니다." }, { status: 400 });
    }
    if (!process.env.SECRET_KEY || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ message: "환경 변수가 설정되지 않았습니다." }, { status: 500 });
    }
    const token = generateEncryptedToken({ email, name, timestamp: Date.now() });
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