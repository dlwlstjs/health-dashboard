import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { SignupFormProps } from "../types/SignupFormProps";

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
    name: "",
    hospital:"",
    gender: "male",
    birthYear: currentYear.toString(),
    birthMonth: currentMonth.toString(),
    birthDay: currentDay.toString(),
    emailPrefix: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = `${formData.emailPrefix}`;

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: formData.user_id,
          password: formData.password,
          name: formData.name,
          gender: formData.gender,
          birthYear: formData.birthYear,
          birthMonth: formData.birthMonth,
          birthDay: formData.birthDay,
          email,
          hospital : formData.hospital
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("회원가입이 완료되었습니다!");
        setFormData({
          user_id: "",
          password: "",
          name: "",
          hospital:"",
          gender: "",
          birthYear: currentYear.toString(),
          birthMonth: currentMonth.toString(),
          birthDay: currentDay.toString(),
          emailPrefix: "",
        });
        onSubmit();
      } else {
        alert((result.error || "서버 응답 확인 필요"));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  const years = Array.from({ length: 100 }, (_, index) => currentYear - index);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const days: number[] = Array.from({ length: 31 }, (_, index) => index + 1);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-4xl mx-auto"
    >
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">아이디</label>
        <input
          type="text"
          name="user_id"
          value={formData.user_id}
          onChange={handleChange}
          className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
          placeholder="아이디를 입력하세요"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">비밀번호</label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
            placeholder="비밀번호를 입력하세요"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="ml-2 text-black"
          >
            {showPassword ? (
              <VisibilityIcon />
            ) : (
              <VisibilityOffIcon />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">병원</label>
        <input
          type="text"
          name="hospital"
          value={formData.hospital}
          onChange={handleChange}
          className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
          placeholder="소속 병원을 입력하세요"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">이름</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
          placeholder="이름을 입력하세요"
          required
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">성별</label>
        <div className="flex gap-4">
          <div className="flex items-center">
            <input
              type="radio"
              id="male"
              name="gender"
              value="male"
              checked={formData.gender === "male"}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="male" className="text-sm sm:text-base">
              남성
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="radio"
              id="female"
              name="gender"
              value="female"
              checked={formData.gender === "female"}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="female" className="text-sm sm:text-base">
              여성
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">생년월일</label>
        <div className="flex gap-4">
          <div className="flex flex-col gap-2 w-1/3">
            <select
              name="birthYear"
              value={formData.birthYear}
              onChange={handleChange}
              className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
              required
            >
              <option value="">연도</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <select
              name="birthMonth"
              value={formData.birthMonth}
              onChange={handleChange}
              className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
              required
            >
              <option value="">월</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2 w-1/3">
            <select
              name="birthDay"
              value={formData.birthDay}
              onChange={handleChange}
              className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
              required
            >
              <option value="">일</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm sm:text-base">이메일</label>
        <div className="flex gap-2 mt-0">
          <input
            type="text"
            name="emailPrefix"
            value={formData.emailPrefix}
            onChange={handleChange}
            className="border border-gray-300 rounded h-10 sm:h-12 px-2 w-full"
            placeholder="이메일 주소를 입력하세요"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
      >
        가입하기
      </button>
    </form>
  );
};

export default SignupForm;
