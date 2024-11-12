import React, { useState } from "react";

interface PatientAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPatient: { name: string; email: string }) => void;
}

const PatientAddModal: React.FC<PatientAddModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    onSubmit({ name, email });
    setName(""); // Reset name
    setEmail(""); // Reset email
    onClose(); // Close modal after submitting
  };

  if (!isOpen) return null; // Don't render if modal is not open

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">환자 추가</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium">이름</label>
          <input
            id="name"
            type="text"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력하세요"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium">이메일</label>
          <input
            id="email"
            type="email"
            className="w-full p-2 border border-gray-300 rounded mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-2 bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="bg-black text-white px-4 py-2 rounded"
          >
            추가
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientAddModal;
