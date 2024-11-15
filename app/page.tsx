"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 'useRouter'는 한 번만 사용해야 합니다.
import PatientAddModal from "@/app/components/PatientAddModal";
import SurveyResultModal from "@/app/components/SurveyResultModal";

interface User {
  id: number;
  name: string;
  gender: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  email: string;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedUserName, setSelectedUserName] = useState("");
  const router = useRouter()

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("네트워크 응답이 올바르지 않습니다.");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("데이터를 가져오는데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleLogout = () => {
    router.push("/login");
  };

  const handleAddPatient = async (newPatient: {
    name: string;
    gender: string;
    birthDate: string;
    email: string;
  }) => {
    const newUser = {
      id: users.length + 1,
      ...newPatient,
      birthYear: parseInt(newPatient.birthDate.split("-")[0]),
      birthMonth: parseInt(newPatient.birthDate.split("-")[1]),
      birthDay: parseInt(newPatient.birthDate.split("-")[2]),
    };

    try {
      const response = await fetch("/api/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        // 새로고침을 대신해서 데이터를 다시 불러오는 방식 -> 실패...
        fetchPatients();
      } else {
        console.error("환자 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleViewSurveyResults = (userName: string) => {
    setSelectedUserName(userName);
    setIsSurveyModalOpen(true);
  };

  const handleSendSurveyLink = async (user: User) => {
    try {
      const response = await fetch("/api/sendSurveyLink", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user.email, name: user.name }),
      });

      if (response.ok) {
        alert(`${user.name}님에게 문진 링크가 발송되었습니다.`);
      } else {
        console.error("문진 링크 발송에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
  };

  return (
    <div className="min-h-screen p-8 sm:p-20 flex justify-center items-start mt-20">
      <div className="w-full max-w-5xl">
        <div className="absolute top-8 right-8">
          <button
            onClick={handleLogout}
            className="rounded-full border transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            로그아웃
          </button>
        </div>

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">환자 목록</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded border transition-colors bg-foreground text-background hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
          >
            환자 추가
          </button>
        </div>

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
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td className="border-b py-2 px-4">{index + 1}</td>
                  <td className="border-b py-2 px-4">{user.name}</td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-black text-white py-1 px-2 rounded hover:bg-gray-800"
                      onClick={() => handleSendSurveyLink(user)}
                    >
                      발송
                    </button>
                  </td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-white text-black py-1 px-2 rounded border border-black hover:bg-gray-100"
                      onClick={() => handleViewSurveyResults(user.name)}
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

      <PatientAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddPatient={handleAddPatient}
      />

      <SurveyResultModal
        isOpen={isSurveyModalOpen}
        onClose={handleCloseSurveyModal}
        userName={selectedUserName}
      />
    </div>
  );
}
