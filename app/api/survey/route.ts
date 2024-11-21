import { openDb } from "@/app/db/sqlite";
import { NextResponse } from "next/server";

const db = await openDb();

export async function POST(request: Request) {
  try {
    const { token, answers } = await request.json();

    // 토큰 검증 요청
    const verifyResponse = await fetch("http://localhost:3000/api/verifyToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const verifyResult = await verifyResponse.json();
    if (!verifyResponse.ok) {
      return NextResponse.json({ message: verifyResult.message }, { status: verifyResponse.status });
    }

    const { email } = verifyResult.data;

    // 설문 응답 처리
    const scoreArray = answers.map((answer: string) =>
      answer === "전혀없다" ? "0" : answer === "약간있다" ? "1" : "2"
    );
    const scoreString = scoreArray.join(",");

    db.run(
      "INSERT INTO health (email, score) VALUES (?, ?)",
      [email, scoreString],
      function (err) {
        if (err) {
          console.error("점수 저장 중 오류:", err.message);
          throw new Error("점수 저장 실패");
        }
      }
    );

    return NextResponse.json({ message: "문진 결과 저장 완료" });
  } catch (error) {
    console.error("문진 처리 중 오류:", error);
    return NextResponse.json({ message: "문진 처리 실패" }, { status: 500 });
  }
}
