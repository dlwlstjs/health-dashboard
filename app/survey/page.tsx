"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SCORE_MAP, Answer } from "@/scoreMap"; // scoreMap.ts에서 SCORE_MAP 임포트

// 질문과 답변 옵션
const QUESTIONS = [
  "걷는 데 어려움이 있나요?",
  "혼자 씻거나 옷을 입을 때 어려움이 있나요?",
  "일상 활동에 어려움이 있나요?",
  "통증이나 불편감이 있나요?",
  "불안감이나 우울감이 있나요?",
];
const OPTIONS = ["전혀없다", "약간있다", "많이있다"];

type AnswerState = {
  [key: string]: Answer;
};

function SurveyContent() {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "이름 없음";
  const router = useRouter();

  const handleRadioChange = (question: string, value: Answer) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: value }));
    setErrorMessage(null); // 질문이 변경될 때 에러 메시지 초기화
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < QUESTIONS.length) {
      setErrorMessage("모든 질문에 답변을 완료해야 합니다.");
      return;
    }

    // answers를 기반으로 점수 계산
    const score = QUESTIONS.reduce((total, question) => {
      const answer = answers[question];
      return total + (answer ? SCORE_MAP[answer] : 0);
    }, 0);

    try {
      const response = await fetch("/api/surveyresult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, answers, score }), // score 포함
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error("문진 결과 저장 오류:", responseText);
        setErrorMessage("문진 결과 저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      setIsCompleted(true);
    } catch (error) {
      console.error("문진 결과 저장 오류:", error);
      setErrorMessage("서버 오류로 문진 결과 저장에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">{name} 님의 사전 문진 항목</h1>

        {QUESTIONS.map((question, index) => (
          <div key={index} className="mb-6">
            <p className="mb-6">{index + 1}. {question}</p>
            <div className="flex justify-center gap-12">
              {OPTIONS.map((option) => (
                <label key={option} className="flex items-center">
                  <input
                    type="radio"
                    name={`question${index + 1}`}
                    value={option}
                    checked={answers[`question${index + 1}`] === option}
                    onChange={() => handleRadioChange(`question${index + 1}`, option as Answer)}
                    className="mr-2 peer" // peer 추가
                  />
                  <span className="peer-checked:text-black">{option}</span> {/* peer-checked 사용 */}
                </label>
              ))}
            </div>
          </div>
        ))}

        {errorMessage && (
          <div className="text-red-500 text-center mt-4">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-black text-white gap-2 hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
          >
            완료
          </button>
        </div>
      </div>

      {isCompleted && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-16 rounded-lg shadow-xl text-center max-w-lg">
            <h2 className="text-2xl font-semibold mb-6">문진을 완료했습니다!</h2>
            <div className="flex justify-center mt-10">
              <button
                onClick={() => router.push("/")}
                className="rounded-full bg-black text-white px-8 py-3"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SurveyPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <SurveyContent />
    </Suspense>
  );
}
