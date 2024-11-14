import React from "react";
import { useRouter } from "next/navigation"; // Next.js의 useRouter 훅 사용

interface LoginButtonProps {
  userId: string;
  password: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ userId, password }) => {
  const router = useRouter(); // useRouter 훅 초기화

  const handleLoginClick = async () => {
    try {
      // 로그인 API 호출
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("로그인 성공!");
        router.push("/"); // 로그인 성공 시 메인 페이지로 이동
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    } catch (error) {
      alert("로그인 중 오류가 발생했습니다.");
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
