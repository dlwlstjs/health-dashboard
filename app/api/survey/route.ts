import { openDb } from "@/app/db/sqlite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("문진 데이터 저장 시작...");

    const db = await openDb();
    console.log("데이터베이스 연결 성공");

    const body = await request.json();
    console.log("클라이언트 데이터:", body);

    const { email, answers } = body;

    if (!email || !answers) {
      console.error("이메일 또는 답변이 누락됨:", { email, answers });
      return NextResponse.json(
        { error: "이메일과 답변이 모두 필요합니다." },
        { status: 400 }
      );
    }

    if (typeof answers !== "object" || Array.isArray(answers)) {
      console.error("answers는 객체여야 합니다:", answers);
      return NextResponse.json(
        { error: "answers는 객체여야 합니다." },
        { status: 400 }
      );
    }

    const existingEntry = await db.get("SELECT * FROM Health WHERE email = ?", [email]);

    if (existingEntry) {
      console.log("이미 문진이 완료된 사용자입니다:", email);
      return NextResponse.json(
        { message: "이미 문진을 완료했습니다." },
        { status: 400 }
      );
    }

    const scoreArray = Object.keys(answers)
      .sort() 
      .map((key) => {
        const answer = answers[key];
        return answer === "전혀없다" ? "0" : answer === "약간있다" ? "1" : "2";
      });
    const scoreString = scoreArray.join(","); // "1,1,1,0,2" 형태로 변환
    console.log("변환된 점수 문자열:", scoreString);

    console.log("새 데이터 삽입 중...");
    await db.run(
      "INSERT INTO Health (email, score) VALUES (?, ?)",
      [email, scoreString]
    );
    console.log("데이터 삽입 성공:", { email, scoreString });

    return NextResponse.json({ message: "문진 결과 저장 완료" });
  } catch (error) {
    console.error("문진 처리 중 오류:", error);
    return NextResponse.json(
      { error: "문진 처리 실패. 서버 내부 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
