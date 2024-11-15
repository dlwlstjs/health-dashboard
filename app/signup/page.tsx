"use client";
import SignupForm from "@/app/components/SignupForm";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();

  const handleSignupFormSubmit = () => {
    router.push("/login");
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
