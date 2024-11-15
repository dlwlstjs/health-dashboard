import { NextResponse } from "next/server";
import { openDb } from "@/app/db/sqlite";

const mapAnswerToScore: Record<string, number> = {
  "전혀없다": 1,
  "약간있다": 2,
  "많이있다": 3,
};

interface SurveyAnswers {
  question1: "전혀없다" | "약간있다" | "많이있다";
  question2: "전혀없다" | "약간있다" | "많이있다";
  question3: "전혀없다" | "약간있다" | "많이있다";
  question4: "전혀없다" | "약간있다" | "많이있다";
  question5: "전혀없다" | "약간있다" | "많이있다";
}

export async function POST(req: Request) {
  const { name, answers } = await req.json() as { name: string; answers: SurveyAnswers };

  const scores = [
    mapAnswerToScore[answers.question1],
    mapAnswerToScore[answers.question2],
    mapAnswerToScore[answers.question3],
    mapAnswerToScore[answers.question4],
    mapAnswerToScore[answers.question5],
  ];

  const scoreString = scores.join(",");

  try {
    const db = await openDb();
    await db.run(
      `INSERT INTO health (email, score) VALUES ((SELECT email FROM patient WHERE name = ?), ?)`,
      name,
      scoreString
    );

    return NextResponse.json({ message: "문진 결과가 성공적으로 저장되었습니다." });
  } catch (error) {
    console.error("DB 저장 오류:", error);
    return NextResponse.json({ message: "문진 결과 저장에 실패했습니다." }, { status: 500 });
  }
}
