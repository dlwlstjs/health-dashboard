"use client";

import { useState } from "react";
import Image from "next/image";
import LoginButton from "../components/LoginButton"; // LoginButton 컴포넌트 import
import SignupButton from "../components/SignupButton"; // SignupButton 컴포넌트 import
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // useRouter 사용

  const handleSignupClick = () => {
    router.push("/signup"); // 회원가입 페이지로 리다이렉트
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
          {/* 이미지 추가 */}
          <div className="flex justify-center">
            <Image
              src="/doctor.png" // 이미지 파일 경로
              alt="Doctor Image"
              width={80}
              height={80}
              priority
            />
          </div>

          {/* 로그인 폼 */}
          <div className="flex flex-col gap-4 mt-12 mb-12">
            <div className="flex items-center gap-2 justify-end">
              <div>
                <label className="text-sm sm:text-base font-[family-name:var(--font-geist-mono)]">
                  ID:
                </label>
              </div>
              <input
                type="text"
                className="border border-gray-300 rounded h-10 sm:h-12 px-2"
                placeholder="ID를 입력하세요"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 justify-end">
              <div>
                <label className="text-sm sm:text-base font-[family-name:var(--font-geist-mono)]">
                  PASSWORD:
                </label>
              </div>
              <input
                type="password"
                className="border border-gray-300 rounded h-10 sm:h-12 px-2"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 로그인 버튼 및 회원가입 버튼을 옆으로 배치 */}
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            {/* LoginButton 컴포넌트 사용 */}
            <LoginButton userId={userId} password={password} />

            {/* SignupButton 컴포넌트 사용 */}
            <SignupButton onClick={handleSignupClick} />
          </div>
        </div>
      </main>
    </div>
  );
}
