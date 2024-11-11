"use client";

import { useState } from "react";
import Image from "next/image";
import SignupButton from "./components/SignupButton";
import LoginButton from "./components/LoginButton";
import SignupForm from "./components/SignupForm";
import { useRouter } from "next/navigation";

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  const handleSignupClick = () => {
    router.push("/signup");
  };

  const handleSignupFormSubmit = () => {
    alert("가입이 완료되었습니다!");
    setShowSignup(false);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div>
        <div className="flex justify-center">
          <Image
            src="/doctor.png"
            alt="Doctor Image"
            width={80}
            height={80}
            priority
          />
        </div>

        {!showSignup && (
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
              />
            </div>
          </div>
        )}
        {!showSignup && (
          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <LoginButton />
            <SignupButton onSignup={handleSignupClick} />
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
