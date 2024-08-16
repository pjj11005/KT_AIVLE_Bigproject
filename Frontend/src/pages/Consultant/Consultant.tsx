import React, { useEffect, useRef, useState } from 'react';
import styles from './Consultant.module.scss';
import Pagination from '../../components/Pagenation/Pagenation';
import ConsultantModal from './ConsultantModal/ConsultantModal';
import { getData } from '../../api';
import { APIResponse } from '../../interface/commonResponse';
import { maskName, maskPhoneNumber } from '../../utils/utils';

export type Position = '인턴' | '사원' | '관리자';

export interface ConsultantInfo {
  name: string;
  id: string;
  email: string;
  phone: string;
  role: Position;
}

const positions: Position[] = ['인턴', '사원', '관리자'];

function generateRandomName(): string {
  const lastNames = [
    '김',
    '이',
    '박',
    '최',
    '정',
    '강',
    '조',
    '윤',
    '장',
    '임',
    '한',
    '오',
    '서',
    '신',
    '권',
    '황',
    '안',
    '송',
    '전',
    '홍',
  ];
  const firstNames = [
    '민준',
    '서윤',
    '도윤',
    '서연',
    '예준',
    '지우',
    '주원',
    '하은',
    '지호',
    '윤서',
    '건우',
    '민서',
    '준서',
    '유진',
    '현우',
    '지민',
    '우진',
    '선우',
    '연우',
    '다은',
  ];
  return (
    lastNames[Math.floor(Math.random() * lastNames.length)] +
    firstNames[Math.floor(Math.random() * firstNames.length)]
  );
}

function generateRandomPhone(): string {
  return `010-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
}

const mockData: ConsultantInfo[] = Array.from({ length: 100 }, (_, index) => {
  const name = generateRandomName();
  const role = positions[Math.floor(Math.random() * positions.length)];
  const id = `EMP${String(index + 1).padStart(3, '0')}`;
  const email = `${name.toLowerCase().replace(/\s/g, '.')}@company.com`;
  const phone = generateRandomPhone();

  return {
    name,
    role,
    id,
    email,
    phone,
  };
});
const Consultant: React.FC = () => {
  const [selectedConsultant, setSelectedConsultant] =
    useState<ConsultantInfo | null>(null);

  const [consultants, setConsultants] = useState<ConsultantInfo[]>(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState<Position | 'all'>('all');
  const [filteredEmployees, setFilteredEmployees] = useState<ConsultantInfo[]>(
    [],
  );
  const [employeesPerPage, setEmployeesPerPage] = useState(10);

  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const getConsultant = async () => {
      try {
        const consultant: APIResponse<ConsultantInfo[]> =
          await getData('/adminpage/user/');

        const cons: ConsultantInfo[] = [];
        consultant.result.map((c) => {
          cons.push({
            name: c.name,
            role: c.role,
            id: c.id,
            email: c.email,
            phone: c.phone,
          });
        });

        setConsultants((prev) => cons);
      } catch (e) {
        console.error(e);
      }
    };

    getConsultant();
  }, []);

  useEffect(() => {
    const updateEmployeesPerPage = () => {
      if (tableRef.current) {
        const tableTop = tableRef.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        const tableHeaderHeight = 40;
        const rowHeight = 40;
        const footerHeight = 100;
        const availableHeight =
          windowHeight - tableTop - tableHeaderHeight - footerHeight;
        const newEmployeesPerPage = Math.floor(availableHeight / rowHeight);
        setEmployeesPerPage(Math.max(newEmployeesPerPage, 1));
      }
    };

    updateEmployeesPerPage();
    window.addEventListener('resize', updateEmployeesPerPage);

    return () => window.removeEventListener('resize', updateEmployeesPerPage);
  }, []);

  useEffect(() => {
    const filtered = consultants.filter(
      (employee) =>
        (employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (positionFilter === 'all' || employee.role === positionFilter),
    );
    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [searchTerm, positionFilter, consultants]);

  const indexOfLastEmployee = currentPage * employeesPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
  const currentEmployees = filteredEmployees.slice(
    indexOfFirstEmployee,
    indexOfLastEmployee,
  );
  const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleConsultantClick = (consultant: ConsultantInfo) => {
    setSelectedConsultant(consultant);
  };

  return (
    <div style={{ padding: '20px' }}>
      <div className={styles['title-container']}>상담사 리스트</div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: '10px', padding: '5px' }}
        />
        <select
          value={positionFilter}
          onChange={(e) =>
            setPositionFilter(e.target.value as Position | 'all')
          }
          style={{ padding: '5px' }}
        >
          <option value="all">전체</option>
          <option value="관리자">관리자</option>
          <option value="사원">사원</option>
          <option value="인턴">인턴</option>
        </select>
      </div>
      <table ref={tableRef} className={styles.table}>
        <thead className={styles['table-top']}>
          <tr>
            <th className={styles['col-name']}>이름</th>
            <th className={styles['col-position']}>직급</th>
            <th className={styles['col-id']}>사번</th>
            <th className={styles['col-email']}>이메일</th>
            <th className={styles['col-phone']}>전화번호</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map((consultant) => (
            <tr
              key={consultant.id}
              className={styles.item}
              onClick={() => handleConsultantClick(consultant)}
            >
              <td>{maskName(consultant.name)}</td>
              <td>{consultant.role}</td>
              <td>{consultant.id}</td>
              <td>{consultant.email}</td>
              <td>{maskPhoneNumber(consultant.phone)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: '10px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <ConsultantModal
        consultant={selectedConsultant}
        onClose={() => setSelectedConsultant(null)}
      />
    </div>
  );
};

export default Consultant;
