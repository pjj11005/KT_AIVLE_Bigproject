import React from 'react';
import styles from './NoticeList.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const notices = [
  { id: 1, title: '7월 휴가 신청 안내', date: '2023-06-15' },
  { id: 2, title: '신규 상담 매뉴얼 배포', date: '2023-06-10' },
  { id: 3, title: '6월 성과 우수자 발표', date: '2023-06-05' },
];

const NoticeList: React.FC = () => {
  const navigate = useNavigate();
  const handleOnClick = (event: React.MouseEvent<HTMLLIElement>) => {
    event.preventDefault();
    navigate(`/notice/${event.currentTarget.id}`);
  };
  return (
    <div className={styles['notice-list']}>
      <Link to={'/notice'}>
        <h2>공지사항</h2>
      </Link>
      <ul>
        {notices.map((notice) => (
          <li id={notice.id.toString()} key={notice.id} onClick={handleOnClick}>
            <span className={styles.title}>{notice.title}</span>
            <span className={styles.date}>{notice.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NoticeList;
