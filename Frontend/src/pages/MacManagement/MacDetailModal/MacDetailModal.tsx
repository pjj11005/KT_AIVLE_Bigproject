import React, { useEffect, useState } from 'react';
import styles from './MacDetailModal.module.scss';
import Icon from '../../../components/Icon';
import { getData } from '../../../api';
import { APIResponse } from '../../../interface/commonResponse';
import { Role } from '../../../types';

export interface MacDetailModalProps {
  userId: string;
  onClose: () => void;
  phone: string;
  name: string;
}

interface ManagerInfo {
  name: string;
  pid: string;
  imageUrl: string;
}

interface UserInfo {
  name: string;
  phone: string;
  id: string;
  avatar: string;
  role: Role;
}

interface ConsultantHistory {
  date: string;
  manager: ManagerInfo;
  time: number;
  category: string;
  memo: string;
  summary: string;
}

interface ConsultantHistory2 {
  id: number;
  date: string;
  summary: string;
  opinion: string;
  keyword: string[];
  user: UserInfo;
  customer: string;
  context: string;
}

export interface ClientConsultantInfo {
  user: UserInfo;
  history: ConsultantHistory[];
}

const MacDetailModal: React.FC<MacDetailModalProps> = ({
  userId,
  phone,
  name,
  onClose,
}: MacDetailModalProps) => {
  const [history, setHistory] = useState<ConsultantHistory2[]>([]);

  useEffect(() => {
    const getHistory = async () => {
      try {
        const response: APIResponse<ConsultantHistory2[]> = await getData(
          `/call/callnote/${phone}`,
        );

        return response.result;
      } catch (e) {
        console.error(e);
      }
    };
    if (phone) {
      getHistory().then((r) => {
        if (r) {
          setHistory((prev) => r);
        }
      });
    }
  }, []);

  const renderChatContent = (context: string) => {
    const lines = context.split('\n');
    return lines
      .map((line, index) => {
        const [dateTime, role, ...messageParts] = line.split(': ');
        const message = messageParts.join(': ');
        const [date, time] = dateTime.split(' ');
        const isClient = role === '민원인';

        if (!message.trim()) {
          return null;
        }

        return (
          <div
            key={index}
            className={`${styles.message} ${isClient ? styles.client : styles.counselor}`}
          >
            <div className={styles.bubble}>{message}</div>
            <div className={styles.time}>{time}</div>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={styles['container']}>
      <div className={styles['title-container']}>
        <Icon
          name={'close.png'}
          onClickEvent={() => {
            setHistory([]);
            onClose();
          }}
        />
      </div>
      <div className={styles['content-container']}>
        <div className={styles['client-info-container']}>
          <h3>고객정보</h3>
          <ul>
            <li>
              <span>이름</span>
              {': ' + (name || '임수진')}
            </li>
            <li>
              <span>전화번호 </span>
              {': ' + (phone === '101' ? '010-1234-2' + phone : phone)}
            </li>
          </ul>
        </div>
        <div className={styles['history-container']}>
          <h3 className={styles['history-title']}>이전 상담 내역</h3>
          <div className={styles['history-inner-container']}>
            {history.length ? (
              [...history].reverse().map((h, index) => {
                const date = new Date(h.date);
                return (
                  <div
                    key={'history' + h.id + index}
                    className={styles['history-card']}
                  >
                    <div className={styles['top']}>
                      <h3>
                        {date.getFullYear() +
                          '년 ' +
                          (date.getMonth() + 1) +
                          '월 ' +
                          date.getDate() +
                          '일'}
                      </h3>
                    </div>

                    <div className={styles['manager-box']}>
                      <img
                        src={'/image/user.png'}
                        alt={'manager profile image'}
                      />

                      <div className={styles['manager-info']}>
                        <div>상담사: {h.user.name}</div>
                        <div>상담사 사번: {h.user.id}</div>
                        <div>
                          직급: {h.user.role === 'A' ? '관리자' : '사원'}
                        </div>
                      </div>
                    </div>

                    <div className={styles['consultant-box']}>
                      <div className={styles['summary']}>
                        <div className={styles['title']}>All</div>
                        <div className={styles['all-content']}>
                          {h.context ? (
                            renderChatContent(h.context)
                          ) : (
                            <h3>정보 없음</h3>
                          )}
                        </div>
                      </div>
                      <div className={styles['summary']}>
                        <div className={styles['title']}>Keyword</div>
                        <div className={styles['summary-content']}>
                          {h.keyword.map((r) => {
                            return r + ', ';
                          })}
                        </div>
                      </div>
                      <div className={styles['summary']}>
                        <div className={styles['title']}>Summary</div>
                        <div className={styles['summary-content']}>
                          {h.summary}
                        </div>
                      </div>

                      <div className={styles['summary']}>
                        <div className={styles['title']}>Memo</div>
                        <div className={styles['summary-content']}>
                          {h.opinion}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <span>이전 상담내역이 존재하지 않습니다.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacDetailModal;
