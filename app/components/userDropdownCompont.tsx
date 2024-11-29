import { useState, useRef, useEffect } from 'react';

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false); // 드롭다운 열림 상태
  const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 참조

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false); // 외부 클릭 시 드롭다운 닫기
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return { isOpen, toggleDropdown, dropdownRef };
};

export default useDropdown;
