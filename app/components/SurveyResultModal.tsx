// app/components/SurveyResultModal.tsx

"use client";

import React from "react";

interface SurveyResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const SurveyResultModal: React.FC<SurveyResultModalProps> = ({ isOpen, onClose, userName }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-8 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{userName} 님 문진 결과 보기</h2>

        {/* 여기에 문진 결과 관련 내용 추가 */}
        <div className="mb-4">
          <p>문진 결과 내용이 여기에 표시됩니다.</p>
        </div>

        {/* 취소 버튼을 오른쪽으로 정렬 */}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-6 rounded hover:bg-gray-400"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyResultModal;
