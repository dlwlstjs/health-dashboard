"use client";
import { useState } from "react";
import SignupForm from "@/app/components/SignupForm"; 

const SignupPage = () => {
  const handleSignupFormSubmit = () => {
    alert("가입이 완료되었습니다!");
    // 가입 완료 후 처리 (예: 폼 숨기기, 리디렉션 등)
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 gap-8">
      <div className="w-12 h-12 "></div>
      <h1 className="text-2xl font-semibold">회원가입</h1>
      <div className="w-5 h-5 "></div>
      <div className="w-full max-w-md">
        <SignupForm onSubmit={handleSignupFormSubmit} />
      </div>
      <div className="w-8 h-8 "></div>
    </div>
  );
};

export default SignupPage;
