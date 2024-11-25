"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PatientAddModal from "@/app/components/PatientAddModal";
import SurveyResultModal from "@/app/components/SurveyResultModal";
import { User } from "./types/UserProps";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(users.length == 0 ? 1 : users.length / itemsPerPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    email: string;
    name: string;
  } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doctorId, setDoctorId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          method: "GET",
          credentials: "include",
        });

        const data = await response.json();

        if (data.authenticated) {
          setIsAuthenticated(true);
          setDoctorId(data.user.id);
          fetchPatients(); 
        } else {
          router.push("/login"); 
        }
      } catch (error) {
        console.error("인증 상태 확인 오류:", error);
        router.push("/login");
      }
    };

    checkAuthentication();
  }, [router]);

  const fetchPatients = async () => {
    try {
      const response = await fetch("/api/patients", {
        method: "GET",
        credentials: "include",
      });

      const data = await response.json();

      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error("API에서 올바르지 않은 데이터 형식 반환:", data);
        setUsers([]);
      }
    } catch (error) {
      console.error("환자 목록을 가져오는 데 실패했습니다:", error);
      setUsers([]); 
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
        body: JSON.stringify({ ...newUser, doctor_id: doctorId }),
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

  const handleDeletePatient = async (email: string) => {
    const confirmDelete = confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/patients?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPatients();
      } else {
        alert("삭제 실패. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("삭제 요청 실패:", error);
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleViewSurveyResults = (user: User) => {
    setSelectedUser({ email: user.email, name: user.name });
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

  if (!isAuthenticated) return null;
  const currentUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen p-8 sm:p-20 flex flex-col justify-between items-center">
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
                <th className="border-b py-2 px-4 w-[120px] text-center">
                  삭제
                </th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr key={user.email}>
                  <td className="border-b py-2 px-4">
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </td>
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
                      onClick={() => handleViewSurveyResults(user)}
                    >
                      보기
                    </button>
                  </td>
                  <td className="border-b py-2 px-4 text-center">
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                      onClick={() => handleDeletePatient(user.email)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 flex justify-center items-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className={`px-4 py-2 border rounded ${
            currentPage === 1
              ? "opacity-0 pointer-events-none"
              : "bg-white text-black"
          }`}
        >
          이전
        </button>
        <div className="px-4 py-2 border rounded bg-white-100 text-black">
          {currentPage} / {totalPages}
        </div>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages
              ? "opacity-0 pointer-events-none"
              : "bg-white text-black"
          }`}
        >
          다음
        </button>
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
          email={selectedUser.email}
          name={selectedUser.name}
        />
      )}
    </div>
  );
}
