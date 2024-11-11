// app/components/LoginButton.js
import React from "react";

const LoginButton = () => {
  const handleLoginClick = () => {
    // 로그인 처리 로직을 여기에 추가
    const userId = prompt("아이디를 입력하세요");
    const password = prompt("비밀번호를 입력하세요");

    // 간단한 로그인 검증 (예시)
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
