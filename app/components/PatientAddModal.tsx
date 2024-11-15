import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: { name: string; gender: string; birthDate: string; email: string }) => Promise<void>;
}

const PatientAddModal: React.FC<ModalProps> = ({ isOpen, onClose, onAddPatient }) => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("남");
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split("T")[0]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null); // 에러 상태 추가

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setGender("남");
    setBirthDate(new Date().toISOString().split("T")[0]);
    setEmail("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPatient = {
      name,
      gender: gender === '남' ? 'male' : 'female',
      birthDate,
      email,
    };

    try {
      await onAddPatient(newPatient); // Prop을 통한 환자 추가 호출
      resetForm(); // 상태 초기화
      onClose(); // 모달 닫기
    } catch (error) {
      setError("환자 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("환자 추가 실패:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-96 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-lg text-gray-500"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4">환자 추가</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>} {/* 에러 메시지 출력 */}

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
              <label>
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

          <div className="mt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="text-black py-2 px-6 rounded border-2"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-black text-white py-2 px-6 rounded hover:bg-black-600"
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
