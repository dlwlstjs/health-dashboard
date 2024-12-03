"use client";
import { useState } from "react";
import Image from "next/image";
import LoginButton from "@/app/components/LoginButton";
import SignupButton from "@/app/components/SignupButton";
import { useRouter } from "next/navigation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function LoginPage() {
  const [user_id, setuser_id] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지를 관리하는 상태
  const router = useRouter();

  const handleSignupClick = () => {
    router.push("/signup");
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
          <div className="flex flex-col gap-4 mt-12 mb-12">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 justify-end">
                <label className="text-sm sm:text-base font-[family-name:var(--font-geist-mono)]">
                  ID:
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded h-10 sm:h-12 px-2"
                  placeholder="ID를 입력하세요"
                  value={user_id}
                  onChange={(e) => setuser_id(e.target.value)}
                />
                <div className="w-6 h-6"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 justify-end">
                <label className="text-sm sm:text-base font-[family-name:var(--font-geist-mono)]">
                  PASSWORD:
                </label>
                <div className="flex items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="border border-gray-300 rounded h-10 sm:h-12 px-2"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="ml-2 text-black"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </button>
                </div>
              </div>
          {errorMessage && (
            <div className="text-red-500 text-sm sm:text-base text-center mb-4">
              {errorMessage}
            </div>
          )}
            </div>
          </div>

          <div className="flex gap-4 items-center flex-col sm:flex-row">
            <LoginButton
              user_id={user_id}
              password={password}
              setErrorMessage={setErrorMessage}
            />
            <SignupButton onClick={handleSignupClick} />
          </div>
        </div>
      </main>
    </div>
  );
}
