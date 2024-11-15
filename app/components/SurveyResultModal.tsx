// app/components/SurveyResultModal.tsx
"use client";

import React, { useEffect, useState } from "react";

interface SurveyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SurveyResultModal: React.FC<SurveyResultModalProps> = ({ isOpen, onClose, userName }) => {
  const [surveyResult, setSurveyResult] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurveyResult = async () => {
      if (isOpen) {
        try {
          const response = await fetch("/api/getSurveyResult", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userName }),
          });

          if (response.ok) {
            const result = await response.json();
            setSurveyResult(result.result); // 예: 문진 결과가 `result` 필드에 있다고 가정
          } else {
            setSurveyResult("문진 결과를 불러오는 데 실패했습니다.");
          }
        } catch (error) {
          console.error("문진 결과 조회 오류:", error);
          setSurveyResult("문진 결과를 불러오는 중 오류가 발생했습니다.");
        }
      }
    };

    fetchSurveyResult();
  }, [isOpen, userName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{userName} 님 문진 결과</h2>

        {/* 문진 결과 내용 표시 */}
        <div className="mb-4">
          <p>{surveyResult || "문진 결과 내용이 여기에 표시됩니다."}</p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-6 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyResultModal;
