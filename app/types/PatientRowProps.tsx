interface PatientRowProps {
    id: number;
    name: string;
    gender: string;
    birthDate?: string; // 선택 사항으로 정의 (만약 필요하다면)
    onSendSurveyLink: (name: string) => void;
    onViewSurveyResults: (name: string) => void;
  }