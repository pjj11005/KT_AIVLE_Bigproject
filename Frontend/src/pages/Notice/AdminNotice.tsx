import React, { useEffect, useState } from 'react';
import styles from './Notice.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ROUTES } from '../../utils/routes';
import { getNotice, NoticeItem } from '../../api/notice';
import Calendar from 'react-calendar';
import { Value } from 'react-calendar/dist/cjs/shared/types';

const AdminNotice: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [notices, setNotices] = useState<NoticeItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const navigate = useNavigate();
  const handleAddNotice = () => {
    navigate(ROUTES.CREATE_NOTICE);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const result = await getNotice();
      const sortedNotices = result.sort(
        (a, b) => (b.id as unknown as number) - (a.id as unknown as number),
      );
      setNotices(sortedNotices);
      setError(null);
    } catch (e) {
      setError('데이터를 불러오는 데 실패했습니다.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (value: Value) => {
    if (Array.isArray(value)) {
      setDateRange(value as [Date, Date]);
      setShowCalendar(false);
    }
  };

  const filteredNotices = notices?.filter((notice) => {
    const noticeDate = new Date(notice.date);
    return dateRange[0] && dateRange[1]
      ? noticeDate >= dateRange[0] && noticeDate <= dateRange[1]
      : true;
  });

  const formatDateRange = () => {
    if (dateRange[0] && dateRange[1]) {
      return `${dateRange[0].toISOString().split('T')[0]} - ${dateRange[1].toISOString().split('T')[0]}`;
    }
    return 'Date';
  };

  if (error)
    return (
      <div
        style={{
          marginLeft: '1rem',
        }}
      >
        {error}
      </div>
    );
  if (!notices) return <div>데이터가 없습니다.</div>;

  return (
    <div className={styles['container']}>
      <div className={styles['notice-container']}>
        <div className={styles['title-container']}>
          <h2>공지사항</h2>
          <div className={styles['btns']}>
            {user && user.role === '관리자' && (
              <button
                className={styles['add-notice']}
                onClick={handleAddNotice}
              >
                ﹢ 공지사항 작성
              </button>
            )}
            <button
              className={styles['select-notice']}
              onClick={() => setShowCalendar(!showCalendar)}
            >
              <div className={styles['cal-img']}>
                <img src="/icon/calendar.svg" alt="calendar" />
              </div>
              <span
                className={
                  formatDateRange() === 'Date'
                    ? styles['date-btn-text']
                    : styles['date-btn-text-range']
                }
              >
                {formatDateRange()}
              </span>{' '}
            </button>
            {showCalendar && (
              <Calendar
                onChange={handleDateChange}
                selectRange={true}
                className={styles['react-calendar']}
                value={dateRange}
              />
            )}
          </div>
        </div>
        <div className={styles['notice-list-container-wrapper']}>
          <div className={styles['notice-list-container']}>
            {filteredNotices?.length === 0 ? (
              <div
                style={{
                  margin: '1rem 0 0 1rem',
                  fontSize: '2rem',
                  fontWeight: '500',
                }}
              >
                공지사항이 없습니다.
              </div>
            ) : (
              filteredNotices?.map((notice) => {
                const date = new Date(notice.date);
                return (
                  <Link
                    key={notice.id}
                    to={`/notice/${notice.id}`}
                    className={styles['notice-link']}
                  >
                    <div className={styles['notice-item']}>
                      <span className={styles['notice-id']}>{notice.id}</span>
                      <div className={styles['col']}>
                        <div className={styles['row']}>
                          <span className={styles['notice-category']}>
                            {notice.category}
                          </span>
                          <span className={styles['notice-title']}>
                            {notice.title}
                          </span>
                        </div>
                        <div className={styles['row']}>
                          <span>
                            {date.getFullYear()}.{date.getMonth() + 1}.
                            {date.getDate()}
                          </span>
                          <span>{notice.author}</span>
                        </div>
                      </div>
                      <span className={styles['notice-count']}>
                        {notice.views}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
