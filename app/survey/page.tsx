"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function Survey() {
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  });

  const [isCompleted, setIsCompleted] = useState(false); // 문진 완료 상태
  const searchParams = useSearchParams(); // URL에서 query 파라미터 읽기
  const name = searchParams.get("name"); // "name" 파라미터 값을 가져옴

  const router = useRouter();

  const handleRadioChange = (question: string, value: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [question]: value,
    }));
  };

  const handleSubmit = () => {
    // 모든 질문에 답변이 있는지 확인
    if (Object.values(answers).includes("")) {
      alert("모든 질문에 답변을 완료해야 합니다.");
      return;
    }

    setIsCompleted(true); // 문진 완료 상태 변경
  };

  const handleConfirmation = () => {
    // 확인 버튼 클릭 시 홈으로 리디렉션
    router.push("/"); // 홈으로 이동
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-3xl bg-white p-10 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {name} 님의 사전 문진 항목
        </h1>

        {/* 설문 항목들 */}
        <div className="space-y-8">
          <div>
            <p className="mb-6">1. 걷는 데 어려움이 있나요?</p>
            <div className="flex justify-center gap-12">
              <label>
                <input
                  type="radio"
                  name="question1"
                  value="전혀없다"
                  checked={answers.question1 === "전혀없다"}
                  onChange={() => handleRadioChange("question1", "전혀없다")}
                />
                전혀없다
              </label>
              <label>
                <input
                  type="radio"
                  name="question1"
                  value="약간있다"
                  checked={answers.question1 === "약간있다"}
                  onChange={() => handleRadioChange("question1", "약간있다")}
                />
                약간있다
              </label>
              <label>
                <input
                  type="radio"
                  name="question1"
                  value="많이있다"
                  checked={answers.question1 === "많이있다"}
                  onChange={() => handleRadioChange("question1", "많이있다")}
                />
                많이있다
              </label>
            </div>
          </div>

          <div>
            <p className="mb-6">2. 혼자 씻거나 옷을 입을 때 어려움이 있나요?</p>
            <div className="flex justify-center gap-12">
              <label>
                <input
                  type="radio"
                  name="question2"
                  value="전혀없다"
                  checked={answers.question2 === "전혀없다"}
                  onChange={() => handleRadioChange("question2", "전혀없다")}
                />
                전혀없다
              </label>
              <label>
                <input
                  type="radio"
                  name="question2"
                  value="약간있다"
                  checked={answers.question2 === "약간있다"}
                  onChange={() => handleRadioChange("question2", "약간있다")}
                />
                약간있다
              </label>
              <label>
                <input
                  type="radio"
                  name="question2"
                  value="많이있다"
                  checked={answers.question2 === "많이있다"}
                  onChange={() => handleRadioChange("question2", "많이있다")}
                />
                많이있다
              </label>
            </div>
          </div>

          <div>
            <p className="mb-6">3. 일상 활동에 어려움이 있나요?</p>
            <div className="flex justify-center gap-12">
              <label>
                <input
                  type="radio"
                  name="question3"
                  value="전혀없다"
                  checked={answers.question3 === "전혀없다"}
                  onChange={() => handleRadioChange("question3", "전혀없다")}
                />
                전혀없다
              </label>
              <label>
                <input
                  type="radio"
                  name="question3"
                  value="약간있다"
                  checked={answers.question3 === "약간있다"}
                  onChange={() => handleRadioChange("question3", "약간있다")}
                />
                약간있다
              </label>
              <label>
                <input
                  type="radio"
                  name="question3"
                  value="많이있다"
                  checked={answers.question3 === "많이있다"}
                  onChange={() => handleRadioChange("question3", "많이있다")}
                />
                많이있다
              </label>
            </div>
          </div>

          <div>
            <p className="mb-6">4. 통증이나 불편감이 있나요?</p>
            <div className="flex justify-center gap-12">
              <label>
                <input
                  type="radio"
                  name="question4"
                  value="전혀없다"
                  checked={answers.question4 === "전혀없다"}
                  onChange={() => handleRadioChange("question4", "전혀없다")}
                />
                전혀없다
              </label>
              <label>
                <input
                  type="radio"
                  name="question4"
                  value="약간있다"
                  checked={answers.question4 === "약간있다"}
                  onChange={() => handleRadioChange("question4", "약간있다")}
                />
                약간있다
              </label>
              <label>
                <input
                  type="radio"
                  name="question4"
                  value="많이있다"
                  checked={answers.question4 === "많이있다"}
                  onChange={() => handleRadioChange("question4", "많이있다")}
                />
                많이있다
              </label>
            </div>
          </div>

          <div>
            <p className="mb-6">5. 불안감이나 우울감이 있나요?</p>
            <div className="flex justify-center gap-12">
              <label>
                <input
                  type="radio"
                  name="question5"
                  value="전혀없다"
                  checked={answers.question5 === "전혀없다"}
                  onChange={() => handleRadioChange("question5", "전혀없다")}
                />
                전혀없다
              </label>
              <label>
                <input
                  type="radio"
                  name="question5"
                  value="약간있다"
                  checked={answers.question5 === "약간있다"}
                  onChange={() => handleRadioChange("question5", "약간있다")}
                />
                약간있다
              </label>
              <label>
                <input
                  type="radio"
                  name="question5"
                  value="많이있다"
                  checked={answers.question5 === "많이있다"}
                  onChange={() => handleRadioChange("question5", "많이있다")}
                />
                많이있다
              </label>
            </div>
          </div>
        </div>

        {/* 완료 버튼 */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleSubmit}
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
          >
            완료
          </button>
        </div>
      </div>
      {isCompleted && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-16 rounded-lg shadow-xl text-center max-w-lg">
            <h2 className="text-2xl font-semibold mb-6">
              문진을 완료했습니다!
            </h2>
            <div className="flex justify-center mt-10">
              {" "}
              {/* 버튼을 감싸는 div */}
              <button
                onClick={handleConfirmation}
                className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-base h-[2.5rem] w-[10rem]"
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
