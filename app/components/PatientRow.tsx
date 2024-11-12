"use client";

interface User {
  id: number;
  userId: string;
  name: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  email: string;
  // 추가적인 필드가 있을 경우 여기에 정의
}

interface PatientRowProps {
  user: User;
  onSendSurvey: (userId: number) => void;
  onViewSurveyResults: (userId: number) => void;
}

const PatientRow: React.FC<PatientRowProps> = ({ user, onSendSurvey, onViewSurveyResults }) => {
  return (
    <tr key={user.id}>
      <td className="border-b py-2 px-4">{user.id}</td>
      <td className="border-b py-2 px-4">{user.name}</td>
      <td className="border-b py-2 px-4 text-center">
        <button
          className="border border-black text-black py-1 px-2 rounded hover:bg-gray-100"
          onClick={() => onSendSurvey(user.id)}
        >
          발송
        </button>
      </td>
      <td className="border-b py-2 px-4 text-center">
        <button
          className="border border-black text-black py-1 px-2 rounded hover:bg-gray-100"
          onClick={() => onViewSurveyResults(user.id)}
        >
          보기
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;
