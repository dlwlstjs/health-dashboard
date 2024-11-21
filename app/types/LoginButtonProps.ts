export interface LoginButtonProps {
  userId: string;
  password: string;
  setErrorMessage: (message: string) => void;
}