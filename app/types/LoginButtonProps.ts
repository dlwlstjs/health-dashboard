export interface LoginButtonProps {
  user_id: string;
  password: string;
  setErrorMessage: (message: string) => void;
}