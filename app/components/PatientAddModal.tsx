import React, { useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPatient: (newPatient: {
    name: string;
    gender: string;
    birthDate: string;
    email: string;
  }) => Promise<void>;
}

const PatientAddModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onAddPatient,
}) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("남");
  const [birthYear, setBirthYear] = useState(currentYear.toString());
  const [birthMonth, setBirthMonth] = useState(currentMonth.toString());
  const [birthDay, setBirthDay] = useState(currentDay.toString());
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetForm = () => {
    setName("");
    setGender("남");
    setBirthYear(currentYear.toString());
    setBirthMonth(currentMonth.toString());
    setBirthDay(currentDay.toString());
    setEmail("");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const birthDate = `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`;

    const newPatient = {
      name,
      gender: gender === "남" ? "male" : "female",
      birthDate,
      email,
    };

    try {
      await onAddPatient(newPatient);
      resetForm();
      onClose();
    } catch (error) {
      setError("환자 추가 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("환자 추가 실패:", error);
    }
  };

  const years = Array.from({ length: 100 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days = Array.from({ length: 31 }, (_, index) => index + 1);

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
        {error && <div className="text-red-500 mb-4">{error}</div>}
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
            <div className="flex gap-2">
              <select
                value={birthYear}
                onChange={(e) => setBirthYear(e.target.value)}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">연도</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select
                value={birthMonth}
                onChange={(e) => setBirthMonth(e.target.value)}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">월</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select
                value={birthDay}
                onChange={(e) => setBirthDay(e.target.value)}
                className="w-1/3 px-4 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">일</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
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
              className="text-black py-2 px-6 rounded border-2 border-gray-300 hover:bg-gray-100"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800"
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