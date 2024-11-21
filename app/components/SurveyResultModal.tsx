"use client";

import React, { useState, useEffect } from "react";

interface SurveyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  name: string;
}

const QUESTIONS = [
  "걷는 데 어려움이 있나요?",
  "혼자 씻거나 옷을 입을 때 어려움이 있나요?",
  "일상 활동에 어려움이 있나요?",
  "통증이나 불편감이 있나요?",
  "불안감이나 우울감이 있나요?",
];

const OPTIONS = ["전혀없다", "약간있다", "많이있다"] as const;

const SurveyResultModal: React.FC<SurveyResultModalProps> = ({
  isOpen,
  onClose,
  email,
  name,
}) => {
  const [answers, setAnswers] = useState<{
    [key: string]: "전혀없다" | "약간있다" | "많이있다";
  }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchSurveyResults = async () => {
        try {
          const response = await fetch(
            `/api/surveyresult?email=${encodeURIComponent(email)}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          const data = await response.json();

          if (response.ok) {
            const scores = data.score.split(",");
            const resultAnswers: {
              [key: string]: "전혀없다" | "약간있다" | "많이있다";
            } = {};

            scores.forEach((score: string, index: number) => {
              const scoreIndex = parseInt(score);
              resultAnswers[`question${index + 1}`] = OPTIONS[scoreIndex];
            });

            setAnswers(resultAnswers);
            setErrorMessage(null);
          } else {
            setErrorMessage(data.message);
            setAnswers({});
          }
        } catch (e) {
          console.error("문진 결과를 가져오는 데 실패했습니다.", e);
          setErrorMessage("문진 결과를 가져오는 데 실패했습니다.");
        }
      };

      fetchSurveyResults();
    }
  }, [isOpen, email]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-10 rounded-lg shadow-xl max-w-3xl w-full">
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-black text-white py-0.8 px-2 rounded hover:bg-gray-800"
          >
            X
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-center">
          {name}님의 사전 문진 결과
        </h1>

        {Object.keys(answers).length > 0 ? (
          QUESTIONS.map((question, index) => (
            <div key={index} className="mb-6">
              <p className="mb-6">
                {index + 1}. {question}
              </p>
              <div className="flex justify-center gap-12">
                {OPTIONS.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="radio"
                      name={`question${index + 1}`}
                      value={option}
                      checked={answers[`question${index + 1}`] === option}
                      readOnly
                      disabled
                      className="mr-2 h-4 w-4 border-2 border-gray-700 appearance-none rounded-full checked:bg-gray-700 checked:ring-1 checked:ring-gray-800"
                    />
                    <span className="ml-2 text-gray-800">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", fontWeight: "bold" }}>
            아직 환자 분께서 문진을 완료하지 않았습니다.
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500 text-center mt-4">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default SurveyResultModal;
