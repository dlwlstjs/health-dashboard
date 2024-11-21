import { openDb } from "@/app/db/sqlite";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    console.log("문진 데이터 저장 시작...");

    // SQLite 연결
    const db = await openDb();
    console.log("데이터베이스 연결 성공");

    // 클라이언트에서 전달받은 데이터
    const body = await request.json();
    console.log("클라이언트 데이터:", body);

    const { email, answers } = body;

    // 필수 데이터 확인
    if (!email || !answers) {
      console.error("이메일 또는 답변이 누락됨:", { email, answers });
      return NextResponse.json(
        { error: "이메일과 답변이 모두 필요합니다." },
        { status: 400 }
      );
    }

    // `answers`가 객체인지 확인
    if (typeof answers !== "object" || Array.isArray(answers)) {
      console.error("answers는 객체여야 합니다:", answers);
      return NextResponse.json(
        { error: "answers는 객체여야 합니다." },
        { status: 400 }
      );
    }

    // 이메일 존재 여부 확인
    const existingEntry = await db.get("SELECT * FROM Health WHERE email = ?", [email]);

    if (existingEntry) {
      // 이미 존재하면 에러 메시지 반환
      console.log("이미 문진이 완료된 사용자입니다:", email);
      return NextResponse.json(
        { message: "이미 문진을 완료했습니다." },
        { status: 400 }
      );
    }

    // 객체의 키를 정렬하여 순서대로 점수 변환
    const scoreArray = Object.keys(answers)
      .sort() // question1, question2... 순서로 정렬
      .map((key) => {
        const answer = answers[key];
        return answer === "전혀없다" ? "0" : answer === "약간있다" ? "1" : "2";
      });
    const scoreString = scoreArray.join(","); // "1,1,1,0,2" 형태로 변환
    console.log("변환된 점수 문자열:", scoreString);

    // 새 데이터 삽입
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
