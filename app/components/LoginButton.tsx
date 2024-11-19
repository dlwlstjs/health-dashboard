import React from "react";

interface LoginButtonProps {
  userId: string;
  password: string;
  setErrorMessage: (message: string) => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({
  userId,
  password,
  setErrorMessage,
}) => {
  const handleLoginClick = async () => {
    if (!userId.trim()) {
      setErrorMessage("아이디를 입력해주세요.");
      return;
    } else if (!password.trim()){
      setErrorMessage("비밀번호를 입력해주세요.");
      return;
    }

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
        credentials: "include", // 쿠키 포함
      });

      const result = await response.json();

      if (response.ok) {
        alert("로그인 성공!");
        window.location.href = "/";
      } else {
        setErrorMessage(result.message || "로그인 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
      console.error("로그인 오류:", error);
    }
  };

  return (
    <button
      className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
      onClick={handleLoginClick}
    >
      로그인
    </button>
  );
};

export default LoginButton;
