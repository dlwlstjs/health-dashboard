interface PatientRowProps {
  id: number;
  name: string;
  gender: string;
  birthDate?: string; // 선택 사항으로 정의 (만약 필요하다면)
  onSendSurveyLink: (name: string) => void;
  onViewSurveyResults: (name: string) => void;
}

const PatientRow: React.FC<PatientRowProps> = ({
  id,
  name,
  onSendSurveyLink,
  onViewSurveyResults,
}) => {
  return (
    <tr>
      <td className="border-b py-2 px-4">{id}</td>
      <td className="border-b py-2 px-4">{name}</td>
      <td className="border-b py-2 px-4 text-center">
        <button
          className="bg-black text-white py-1 px-2 rounded hover:bg-gray-800"
          onClick={() => onSendSurveyLink(name)}
        >
          발송
        </button>
      </td>
      <td className="border-b py-2 px-4 text-center">
        <button
          className="bg-white text-black py-1 px-2 rounded border border-black hover:bg-gray-100"
          onClick={() => onViewSurveyResults(name)}
        >
          보기
        </button>
      </td>
    </tr>
  );
};

export default PatientRow;
