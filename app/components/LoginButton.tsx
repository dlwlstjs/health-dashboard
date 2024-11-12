import React from "react";

// LoginButton 컴포넌트에 필요한 타입을 정의
interface LoginButtonProps {
  userId: string;
  password: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ userId, password }) => {
  const handleLoginClick = () => {
    // 로그인 처리 로직
    if (userId === "testUser" && password === "testPassword") {
      alert("로그인 성공!");
      // 로그인 성공 후 리다이렉트 처리 등 추가
    } else {
      alert("로그인 실패! 아이디 또는 비밀번호를 확인하세요.");
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
