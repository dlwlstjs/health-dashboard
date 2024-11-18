import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginButtonProps } from "../types/LoginButtonProps";

const LoginButton: React.FC<LoginButtonProps> = ({ userId, password }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLoginClick = async () => {
    if (!userId || !password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
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
        router.push("/");
      } else {
        setErrorMessage(result.message || "로그인 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      setErrorMessage("로그인 중 오류가 발생했습니다.");
      console.error("로그인 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
        onClick={handleLoginClick}
        disabled={loading} // 로딩 중에는 버튼 비활성화
      >
        {loading ? "로딩 중..." : "로그인"}
      </button>
      {errorMessage && (
        <span className="text-red-500 text-sm mt-2">{errorMessage}</span>
      )}
    </div>
  );
};

export default LoginButton;
