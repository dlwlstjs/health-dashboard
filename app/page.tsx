"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  const [selectedUser, setSelectedUser] = useState<{ email: string; name: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // 로그인 상태 관리
  const [doctorId, setDoctorId] = useState<number | null>(null); // doctor_id 저장
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include", // 쿠키를 포함하여 요청
        });

        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setDoctorId(data.user.id); // doctor_id 저장
          fetchPatients(); // 로그인 되어 있으면 환자 목록을 불러옴
        } else {
          router.push("/login"); // 로그인되지 않았다면 로그인 페이지로 리디렉션
        }
      } catch (error) {
        console.error("인증 상태 확인 오류:", error);
        router.push("/login"); // 오류가 발생하면 로그인 페이지로 리디렉션
      }
    };

    checkAuthentication();
  }, [router]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients", {
        method: "GET",
        credentials: "include", // 쿠키 인증 포함
      });
  
      const data = await response.json();
  
      // 데이터가 배열인지 확인
      if (Array.isArray(data)) {
        setUsers(data); // 배열일 경우만 설정
      } else {
        console.error("API에서 올바르지 않은 데이터 형식 반환:", data);
        setUsers([]); // 기본값으로 빈 배열 설정
      }
    } catch (error) {
      console.error("환자 목록을 가져오는 데 실패했습니다:", error);
      setUsers([]); // 실패 시 빈 배열 설정
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("로그아웃 성공!");
        router.push("/login");
      } else {
        alert("로그아웃 실패");
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
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
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...newUser, doctor_id: doctorId }), // doctor_id 포함
      });

      if (response.ok) {
        fetchPatients();
      } else {
        console.error("환자 추가에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  };

  const handleViewSurveyResults = (user: User) => {
    setSelectedUser({ email: user.email, name: user.name }); // email과 name 저장
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

      const result = await response.json();

      if (response.ok) {
        alert(`${user.name}님에게 문진 링크가 발송되었습니다.`);
      } else {
        alert(`문진 링크 발송 실패: ${result.message}`);
      }
    } catch (error) {
      console.error("문진 링크 발송 오류:", error);
      alert("문진 링크 발송 중 오류가 발생했습니다.");
    }
  };

  const handleCloseSurveyModal = () => {
    setIsSurveyModalOpen(false);
  };

  if (!isAuthenticated) return null; // 인증되지 않았으면 아무것도 렌더링하지 않음

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
                <tr key={user.email}>
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
                      onClick={() => handleViewSurveyResults(user)} // user 전달
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

      {selectedUser && (
        <SurveyResultModal
          isOpen={isSurveyModalOpen}
          onClose={handleCloseSurveyModal}
          email={selectedUser.email} // email 전달
          name={selectedUser.name} // name 전달
        />
      )}
    </div>
  );
}
