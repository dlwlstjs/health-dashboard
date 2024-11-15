"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const QUESTIONS = [
  "걷는 데 어려움이 있나요?",
  "혼자 씻거나 옷을 입을 때 어려움이 있나요?",
  "일상 활동에 어려움이 있나요?",
  "통증이나 불편감이 있나요?",
  "불안감이나 우울감이 있나요?",
];
const OPTIONS = ["전혀없다", "약간있다", "많이있다"];

type AnswerState = {
  [key: string]: string;
};

export default function Survey() {
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const searchParams = useSearchParams();
  const name = searchParams.get("name");
  const router = useRouter();

  const handleRadioChange = (question: string, value: string) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [question]: value }));
  };

  const handleSubmit = async () => {
    if (Object.values(answers).length < QUESTIONS.length) {
      alert("모든 질문에 답변을 완료해야 합니다.");
      return;
    }

    try {
      const response = await fetch("/api/surveyresult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, answers }),
      });

      response.ok ? setIsCompleted(true) : alert("문진 결과 저장에 실패했습니다.");
    } catch (error) {
      console.error("문진 결과 저장 오류:", error);
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
                <label key={option}>
                  <input
                    type="radio"
                    name={`question${index + 1}`}
                    value={option}
                    checked={answers[`question${index + 1}`] === option}
                    onChange={() => handleRadioChange(`question${index + 1}`, option)}
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-8 flex justify-center">
          <button onClick={handleSubmit} className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44">완료</button>
        </div>
      </div>

      {isCompleted && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-16 rounded-lg shadow-xl text-center max-w-lg">
            <h2 className="text-2xl font-semibold mb-6">문진을 완료했습니다!</h2>
            <div className="flex justify-center mt-10">
              <button onClick={() => router.push("/")} className="rounded-full ...">확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
