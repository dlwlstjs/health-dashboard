export interface PatientRowProps {
    id: number;
    name: string;
    gender: string;
    birthDate?: string;
    onSendSurveyLink: (name: string) => void;
    onViewSurveyResults: (name: string) => void;
  }