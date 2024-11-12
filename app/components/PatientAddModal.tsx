// components/PatientAddModal.tsx

import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: { name: string; gender: string; birthDate: string; email: string }) => void;
}

const PatientAddModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남");
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split("T")[0]); // 오늘 날짜 기본값
  const [email, setEmail] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient = {
      name,
      gender,
      birthDate,
      email,
    };
    
    onAddPatient(newPatient); // 환자 추가 처리
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg text-gray-500"
        >
          &times;
        </button>

        <form onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">성별</label>
            <div className="flex">
              <label className="mr-6">
                <input
                  type="radio"
                  name="gender"
                  value="남"
                  checked={gender === "남"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="ml-2">남</span>
              </label>
              <label className="mr-6">
                <input
                  type="radio"
                  name="gender"
                  value="여"
                  checked={gender === "여"}
                  onChange={(e) => setGender(e.target.value)}
                />
                <span className="ml-2">여</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label className="block mb-2">생년월일</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block mb-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          {/* 버튼 섹션: 취소 버튼을 추가 버튼 왼쪽에 배치 */}
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={onClose} // 취소 버튼 클릭 시 모달 닫기
              className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              추가
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientAddModal;
