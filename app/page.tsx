"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  userId: string;
  name: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 임시 데이터 설정
    const tempUsers = [
      {
        id: 1,
        userId: "user1",
        name: "김철수",
        gender: "남",
        birthYear: 1990,
        birthMonth: 5,
        birthDay: 15,
        email: "chulsoo@example.com"
      },
      {
        id: 2,
        userId: "user2",
        name: "이영희",
        gender: "여",
        birthYear: 1985,
        birthMonth: 8,
        birthDay: 25,
        email: "younghee@example.com"
      },
      {
        id: 3,
        userId: "user3",
        name: "박지민",
        gender: "남",
        birthYear: 1992,
        birthMonth: 2,
        birthDay: 10,
        email: "jimin@example.com"
      }
    ];

    // 임시 데이터를 상태에 설정
    setUsers(tempUsers);
  }, []);

  const handleLogout = () => {
    // 로그아웃 로직
    router.push("/login");
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] flex justify-center items-start mt-20">
      <div className="w-full max-w-5xl">
        {/* 상단: 로그아웃 버튼 */}
        <div className="absolute top-8 right-8">
          <button
            onClick={handleLogout}
            className="rounded-full border border-solid border-black transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            로그아웃
          </button>
        </div>

        {/* 환자 목록과 환자 추가 버튼 */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl">환자 목록</h1>
          <button className="rounded border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44">
            환자 추가
          </button>
        </div>

        {/* 환자 목록 표 */}
        <div className="flex justify-center">
          <table className="table-auto w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b py-2 px-4 w-[80px] text-left">번호</th>
                <th className="border-b py-2 px-4 w-[400px] text-left">이름</th>
                <th className="border-b py-2 px-4 w-[120px] text-center">
                  문진 링크 발송
                </th>
                <th className="border-b py-2 px-4 w-[120px] text-center">
                  문진 결과 보기
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="border-b py-2 px-4">{user.id}</td>
                  <td className="border-b py-2 px-4">{user.name}</td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-black text-white py-1 px-2 rounded hover:bg-gray-800"
                      onClick={() => alert(`문진 링크 발송: 사용자 ${user.id}`)}
                    >
                      발송
                    </button>
                  </td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-white text-black py-1 px-2 rounded border border-black hover:bg-gray-100"
                      onClick={() => alert(`문진 결과 보기: 사용자 ${user.id}`)}
                    >
                      보기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
