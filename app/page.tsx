// app/page.tsx
"use client";

import { useEffect, useState } from "react";

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

  // 사용자 목록 불러오기
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-2xl">사용자 목록</h1>
        <ul className="flex flex-col gap-4 w-full max-w-4xl">
          {users.map((user) => (
            <li key={user.id} className="border border-gray-300 rounded p-4">
              <p>아이디: {user.userId}</p>
              <p>이름: {user.name}</p>
              <p>성별: {user.gender}</p>
              <p>생년월일: {user.birthYear}년 {user.birthMonth}월 {user.birthDay}일</p>
              <p>이메일: {user.email}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
