import React from "react";

// SignupButton 컴포넌트에 필요한 타입을 정의
interface SignupButtonProps {
  onClick: () => void;
}

const SignupButton: React.FC<SignupButtonProps> = ({ onClick }) => {
  return (
    <button
      className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
      onClick={onClick}
    >
      회원가입
    </button>
  );
};

export default SignupButton;
