// app/api/survey/route.ts

import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import crypto from "crypto";

// SQLite 연결
const db = new sqlite3.Database('./database.sqlite');

// 토큰 복호화 함수
function verifySignedToken(token: string) {
  const secret = process.env.SECRET_KEY as string; // 환경 변수에서 비밀 키 가져오기
  const [, hash] = token.split('.'); // 타임스탬프는 이제 사용하지 않음
  const data = ""; // 데이터에는 타임스탬프 대신 빈 문자열을 사용

  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  const calculatedHash = hmac.digest("hex");

  if (calculatedHash === hash) {
    return true; // 토큰이 유효하면 true 반환
  } else {
    throw new Error("유효하지 않은 토큰입니다.");
  }
}

export async function POST(request: Request) {
  try {
    const { token, answers } = await request.json();

    // 토큰 검증
    if (!verifySignedToken(token)) {
      return NextResponse.json({ message: "유효하지 않은 토큰입니다." }, { status: 400 });
    }

    // 답변을 점수 배열로 변환
    const scoreArray = answers.map((answer: string) => {
      // 예시: '전혀없다' -> 0, '약간있다' -> 1, '많이있다' -> 2
      return answer === "전혀없다" ? 0 : answer === "약간있다" ? 1 : 2;
    });

    const scoreString = scoreArray.join(",");

    // Health 테이블에 점수 저장
    db.run(
      "INSERT INTO Health (email, score) VALUES (?, ?)",
      ["example@example.com", scoreString],
      function (err) {
        if (err) {
          console.error("점수 저장 중 오류:", err.message);
          return NextResponse.json({ message: "점수 저장 실패" }, { status: 500 });
        }
      }
    );

    // 성공적으로 저장된 경우 반환
    return NextResponse.json({ message: "문진 결과 저장 완료" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류";
    console.error("문진 결과 처리 중 오류:", errorMessage);

    return NextResponse.json({ message: "문진 처리 실패", error: errorMessage }, { status: 500 });
  }
}
