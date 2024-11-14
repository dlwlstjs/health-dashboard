"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientAddModal from "@/app/components/PatientAddModal"; // 모달 컴포넌트 가져오기
import SurveyResultModal from "@/app/components/SurveyResultModal"; // 문진 결과 모달 컴포넌트 가져오기

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
  const [isModalOpen, setIsModalOpen] = useState(false); // 환자 추가 모달 상태
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false); // 문진 결과 모달 상태
  const [selectedUserName, setSelectedUserName] = useState(""); // 선택된 사용자 이름
  const router = useRouter();

  // 데이터베이스에서 환자 목록 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/patients"); // API 경로 확인
        if (!response.ok) {
          throw new Error("네트워크 응답이 올바르지 않습니다.");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다:", error);
      }
    };
  
    fetchData();
  }, []);  

  const handleLogout = () => {
    router.push("/login");
  };

  const handleAddPatient = async (newPatient: { name: string; gender: string; birthDate: string; email: string }) => {
    // 새 환자 추가
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
        setUsers((prevUsers) => [...prevUsers, newUser]);
      } else {
        console.error("환자 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleViewSurveyResults = (userName: string) => {
    setSelectedUserName(userName); // 선택된 사용자 이름 저장
    setIsSurveyModalOpen(true); // 문진 결과 모달 열기
  };

  const handleSendSurveyLink = (userName: string) => {
    // 'name' 쿼리 파라미터와 함께 '/survey'로 이동
    router.push(`/survey?name=${userName}`);
  };

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false); // 문진 결과 모달 닫기
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
          <h1 className="text-3xl font-bold">환자 목록</h1>
          <button
            onClick={() => setIsModalOpen(true)} // 환자 추가 버튼 클릭 시 모달 열기
            className="rounded border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-6 sm:min-w-44"
          >
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
                      onClick={() => handleSendSurveyLink(user.name)} // 발송 버튼 클릭 시 문진 링크 발송
                    >
                      발송
                    </button>
                  </td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-white text-black py-1 px-2 rounded border border-black hover:bg-gray-100"
                      onClick={() => handleViewSurveyResults(user.name)} // 문진 결과 보기 클릭 시 모달 열기
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

      {/* 환자 추가 모달 */}
      <PatientAddModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        onAddPatient={async (newPatient) => {
          try {
            // 비동기 API 요청 로직 작성
            const response = await fetch("/api/patients", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(newPatient),
            });
        
            if (!response.ok) {
              // 서버 응답 상태 코드와 메시지 출력
              const errorMessage = await response.text();
              console.error(`환자 추가에 실패했습니다. 상태 코드: ${response.status}, 메시지: ${errorMessage}`);
              return;
            }
        
            // 성공 시 추가된 환자를 가져오거나 상태 업데이트
            console.log("환자 추가 성공!");
          } catch (error) {
            console.error("API 요청 실패:", error);
          }
        }}
        
      />

      {/* 문진 결과 모달 */}
      <SurveyResultModal
        isOpen={isSurveyModalOpen}
        onClose={handleCloseSurveyModal} // 문진 결과 모달 닫기
        userName={selectedUserName} // 문진 결과에서 사용자 이름 전달
      />
    </div>
  );
}
