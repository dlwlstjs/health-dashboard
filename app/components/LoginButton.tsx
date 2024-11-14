import React from "react";

// LoginButton 컴포넌트에 필요한 타입을 정의
interface LoginButtonProps {
  userId: string;
  password: string;
}

const LoginButton: React.FC<LoginButtonProps> = ({ userId, password }) => {
  const handleLoginClick = async () => {
    try {
      // 로그인 API 호출
      const response = await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, password }),
      });

      const result = await response.json();

      if (response.ok) {
        alert('로그인 성공!');
        // 로그인 성공 후 추가 로직 작성 가능
      } else {
        alert(`로그인 실패: ${result.message}`);
      }
    } catch (error) {
      alert('로그인 중 오류가 발생했습니다.');
      console.error('로그인 오류:', error);
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
