import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './Call.module.scss';
import Register from 'components/Register';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import BeforeCallDetailModal from '../BeforeCall/modal/BeforeCallDetailModal.module';
import moment from 'moment';
import CheckName from 'components/CheckName';
import { getData, patchData } from '../../api';
import { Role } from '../../types';

const ITEMS_PER_PAGE = 15;

interface CallNote {
  id: number;
  date: string;
  summary: string;
  opinion: string;
  keyword: string[];
  user: {
    id: string;
    name: string;
    role: Role;
    avatar: string;
  };
  customer: {
    name: string;
    phone: string;
    counts: number;
  };
}

interface CheckCRM {
  counts: number;
  id: string;
  last_call: string;
  name: string;
  phone: string;
  special_reg: boolean;
  special_req: boolean;
}

const Call: React.FC = () => {
  const [name, setName] = useState('');
  const [phoneNum, setPhoneNum] = useState('');

  const [result, setResult] = useState<string | null>(null);
  const [registeredUser, setRegisteredUser] = useState<CheckCRM | null>(null);
  const [callHistory, setCallHistory] = useState<CallNote[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CallNote | null>(null);

  const [seconds, setSeconds] = useState(0);

  const [userName, setUserName] = useState('Client');
  const [userPhoneNumber, setUserPhoneNumber] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const [memoText, setMemoText] = useState('');
  const navigate = useNavigate();
  const [userCallPhone, setUserCallPhone] = useState<string>('');

  const currentSession = useSelector(
    (state: RootState) => state.call.currentSession,
  );

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMemoText(e.target.value);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (currentSession) {
      setUserCallPhone((prev) => currentSession?.remote_identity?.uri?.user);
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      const userPhone =
        currentSession?.remote_identity?.uri?.user || '010-0000-0000';
      setUserPhoneNumber((prev) => userPhone);
    } else {
      if (timer) {
        clearInterval(timer);
      }
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentSession, navigate]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}분 ${seconds.toString().padStart(2, '0')}초`;
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePhoneNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNum(e.target.value);
  };

  const handleRegister = async () => {
    if (!phoneNum) {
      setResult('전화번호를 입력해주세요.');
      setCallHistory([]);
      setRegisteredUser(null);
      return;
    }

    try {
      const response = await getData<CheckCRM>(`/crm/from/101`)
        .then((r) => {
          return r.result;
        })
        .catch((e) => console.error(e));

      if (response && response.name && response.phone) {
        setRegisteredUser(response);
        setUserName((prev) => response.name);
        setUserPhoneNumber((prev) => response.phone);
        setUserId((prev) => response.id);

        const voc_records = await getData<CallNote[]>(`/call/callnote/101`);
        setCallHistory((prev) => voc_records.result);
        setResult(null);
      } else {
        setUserName((prev) => 'Client');
        setUserId('');
        setResult('고객 정보를 등록해주세요.');
      }
    } catch (error) {
      console.error('API 호출 중 오류 발생:', error);
      setRegisteredUser(null);
      setCallHistory([]);
      setResult('고객정보가 없습니다.');
      setUserName('Client');
    }

    setName('');
    setPhoneNum('');
  };

  const handleUserCardClick = (item: CallNote) => {
    setSelectedItem(item);
    setUserName(userName);
    setUserPhoneNumber(userPhoneNumber);
    setOpenModal(true);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false);
    }
  };

  const setModalClose = () => {
    setOpenModal(false);
  };

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageItems = callHistory.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleSpecRequest = async (phone: string) => {
    try {
      const response = await axios.patch(`/crm/spec/req`, { phone });
      if (response.data.errorCode === 0) {
        setRegisteredUser((prev) =>
          prev ? { ...prev, special_req: true } : null,
        );

        alert('요청이 성공적으로 처리되었습니다.');
      } else {
        alert('요청 처리 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('API 요청 중 오류 발생:', error);
      alert('요청 처리 중 오류가 발생했습니다.');
    }
  };
  const handleRequestClick = () => {
    if (registeredUser && registeredUser.phone) {
      handleSpecRequest(registeredUser.phone);
    }
  };

  const handleSave = async () => {
    try {
      if (userId) {
        const response = await patchData('/call/callmemo', {
          memo: memoText,
          customer: userId,
        });

        if (response.statusCode === 200) {
          navigate(-1);
        }
      } else {
        const customer_id = await getData<{
          customer_id: string;
        }>(`/crm/101`)
          .then((r) => {
            return r.result.customer_id;
          })
          .catch((e) => console.error(e));

        const response = await patchData('/call/callmemo', {
          memo: memoText,
          customer: customer_id,
        });

        if (response.statusCode === 200) {
          navigate(-1);
        }
      }
    } catch (error) {
      console.error('Failed to save memo:', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles['title-container']}>
          <h2>상담 페이지</h2>
        </div>
        <div className={styles['content-container']}>
          <div className={styles['chat-container']}>
            <div className={styles['chat-top-container']}>
              <div className={`${styles.ti} ${styles.t1}`}>
                {formatTime(seconds)}
              </div>
              <div className={`${styles.ti} ${styles.t2}`}>
                {registeredUser ? (
                  registeredUser.special_req === true &&
                  registeredUser.special_reg === false ? (
                    <div className={styles['name']}>
                      <CheckName
                        check={'caution'}
                        size={'large'}
                        name={userName}
                      />
                      <button disabled>요청 완료</button>
                    </div>
                  ) : registeredUser.special_req === false &&
                    registeredUser.special_reg === true ? (
                    <CheckName
                      check={'caution'}
                      size={'large'}
                      name={userName}
                    />
                  ) : registeredUser.special_req === false &&
                    registeredUser.special_reg === false ? (
                    <div className={styles['name']}>
                      {userName}
                      <button onClick={handleRequestClick}>요청</button>
                    </div>
                  ) : (
                    userName
                  )
                ) : (
                  userName
                )}
              </div>
              <div className={`${styles.ti} ${styles.t3}`}>
                010-1234-2{userPhoneNumber}
              </div>
            </div>
            <div className={styles['message-container']}>
              {result ? (
                <div className={styles['me']}>{result}</div>
              ) : registeredUser ? (
                <div className={styles['call-history']}>
                  <h3>{registeredUser.name}님의 통화 내역</h3>
                  <div className={styles['call-container']}>
                    {currentPageItems.length > 0 ? (
                      currentPageItems.map((item, index) => (
                        <div
                          className={styles['notice-link']}
                          key={item.id}
                          onClick={() => handleUserCardClick(item)}
                        >
                          <span>{callHistory.length - startIndex - index}</span>
                          <span>{formatDate(item.date)}</span>
                          <span>{registeredUser.name}</span>
                          <span>
                            {Array.isArray(item.keyword)
                              ? item?.keyword.map((r: string) => {
                                  return r + ', ';
                                })
                              : '키워드 없음'}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className={styles['no-record']}>
                        <span className={styles['me']}>
                          이전 기록이 없습니다!
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.pagination}>
                    {Array.from(
                      {
                        length: Math.ceil(callHistory.length / ITEMS_PER_PAGE),
                      },
                      (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageClick(index + 1)}
                          className={
                            currentPage === index + 1 ? styles.active : ''
                          }
                        >
                          {index + 1}
                        </button>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className={styles['me']}>고객 정보를 등록해주세요.</div>
              )}
            </div>
          </div>
          <div className={styles['side-container']}>
            <div className={styles['register-container']}>
              <Register
                name={name}
                phoneNum={phoneNum}
                onNameChange={handleNameChange}
                onPhoneNumChange={handlePhoneNumChange}
                onRegister={handleRegister}
              />
            </div>
            <div className={styles['memo-container']}>
              <div className={styles['memo-top-container']}>
                <div className={styles['title']}>
                  <span>Memo</span>
                  <div className={styles['memo-button']}>
                    <button onClick={handleSave}>SAVE</button>
                  </div>
                </div>
              </div>
              <textarea
                className={styles['fixed-textarea']}
                value={memoText}
                onChange={handleTextChange}
              />
            </div>
          </div>
        </div>
      </div>
      {openModal && (
        <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
          <BeforeCallDetailModal
            onClose={setModalClose}
            item={selectedItem}
            name={userName}
            phonenumber={userPhoneNumber}
          />
        </div>
      )}
    </div>
  );
};

export default Call;
