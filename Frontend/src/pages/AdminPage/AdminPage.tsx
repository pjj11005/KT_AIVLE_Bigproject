import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './AdminPage.module.scss';
import {
  getCount,
  Count,
  getTodayCount,
  getUserTodayCount,
} from '../../api/board/count';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { getUser, User } from '../../api/admin/user';
import { getSpecialReqCustomer, Customer } from '../../api/admin/customer';
import { patchCaution } from '../../api/caution';
import axios from 'axios';
import { getWeeklyCount } from '../../api/board/count';
import { maskName, maskPhoneNumber } from '../../utils/utils';
interface CallData {
  day?: string;
  count?: number;
  name?: string;
  total?: number;
  common?: number;
  caution?: number;
  calls?: number;
}
const initWeekData: CallData[] = [
  { name: '월', total: 0, common: 0, caution: 0 },
  { name: '화', total: 0, common: 0, caution: 0 },
  { name: '수', total: 0, common: 0, caution: 0 },
  { name: '목', total: 0, common: 0, caution: 0 },
  { name: '금', total: 0, common: 0, caution: 0 },
  { name: '토', total: 0, common: 0, caution: 0 },
  { name: '일', total: 0, common: 0, caution: 0 },
];

const counselorList = (
  users: User[],
): { name: string; role: string; avatar: string; email: string }[] => {
  return users
    .map((user) => ({
      name: user.name,
      role: user.role,
      avatar: user.avatar
        ? `http://172.16.11.35:8000${user.avatar}`
        : '/image/user.png',
      email: user.email,
    }))
    .slice(0, 5);
};

const AdminPage: React.FC = () => {
  const [counselors, setCounselors] = useState<
    { name: string; role: string; avatar: string; email: string }[]
  >([]);

  const [todayCnt, setTodayCnt] = useState<number>(0);
  const [userTodayCnt, setUserTodayCnt] = useState<number>(0);

  const [specialReqCustomers, setSpecialReqCustomers] = useState<Customer[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [countData, setCountData] = useState<Count>({
    user_today_counts: 0,
    all_users_today_counts: 0,
  });

  const [weeklyCallData, setWeeklyCallData] =
    useState<CallData[]>(initWeekData);

  const navigate = useNavigate();
  const fetchCountData = useCallback(async () => {
    try {
      const data = await getCount();
      setCountData(data);
    } catch (error) {
      console.error('Error fetching count data:', error);
    }
  }, []);

  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        const response = await getWeeklyCount();
        if (response.length === 0) {
          setWeeklyCallData(initWeekData);
        } else {
          const updatedData = initWeekData.map((item) => {
            const matchingData = response.find((r) => {
              const day = new Date(r.day).getDay();
              return day === (initWeekData.indexOf(item) + 1) % 7;
            });
            if (matchingData) {
              return {
                ...item,
                common: matchingData.regular_count,
                caution: matchingData.special_count,
                total: matchingData.count,
              };
            }
            return item;
          });
          setWeeklyCallData(updatedData);
        }
      } catch (error) {
        console.error('주별 데이터 가져오기 실패:', error);
      }
    };

    fetchWeeklyData();
  }, []);

  useEffect(() => {
    const getCount = async () => {
      try {
        const totalCount = await getTodayCount();
        setTodayCnt(totalCount.today_voc);

        const userCount = await getUserTodayCount();
        setUserTodayCnt(userCount.today_voc_user);
      } catch (e) {
        console.error('getTodayCount Error: ', e);
      }
    };
    getCount();
  }, []);

  useEffect(() => {
    fetchCountData();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCountData();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchCountData]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUser();
        setCounselors(counselorList(users));
        setLoading(false);
      } catch (err) {
        setError('user data 로드 실패');
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [users, specialReqCustomers] = await Promise.all([
          getUser(),
          getSpecialReqCustomer(),
        ]);
        setCounselors(counselorList(users));
        setSpecialReqCustomers(specialReqCustomers.slice(0, 5));
        setLoading(false);
      } catch (err) {
        setError('데이터 로드 실패');
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCautionUpdate = async (phone: string, set: boolean) => {
    try {
      await patchCaution({ phone, set });
      alert(
        set
          ? '고객이 주의 목록에 추가되었습니다.'
          : '주의고객 요청이 거절되었습니다.',
      );

      const updatedCustomers = await getSpecialReqCustomer();
      setSpecialReqCustomers(updatedCustomers.slice(0, 5));
    } catch (error) {
      console.error('Caution 업데이트 중 오류 발생:', error);
      if (axios.isAxiosError(error) && error.response) {
        console.error('응답 데이터:', error.response.data);
        console.error('응답 상태:', error.response.status);
        console.error('응답 헤더:', error.response.headers);
      }
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  const onNav = () => {
    navigate('/dashboard');
  };
  const onConsultant = () => {
    navigate('/admin/consultant');
  };
  const onClient = () => {
    navigate('/admin/client/caution');
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.adminwrapper}>
      <div className={styles['admin']}>
        <div className={styles['col1']}>
          <div className={styles['count']}>
            <div className={styles['count-total']}>
              <div className={styles['count-title']}>
                <span className={styles['title']}>Daily Total VOC</span>
                <button onClick={onNav}>
                  <img src="/icon/arrow.png" alt={'arrow icon'} />
                </button>
              </div>
              <div className={styles['get-count']}>
                <h2>{countData.all_users_today_counts}</h2>
                <h2>{todayCnt}</h2>
                <h3>call</h3>
              </div>
            </div>
            <div className={styles['count-my']}>
              <div className={styles['count-title']}>
                <span className={styles['title']}>My VOC</span>
                <button onClick={onNav}>
                  <img src="/icon/arrow.png" />
                </button>
              </div>

              <div className={styles['get-count']}>
                <h2>{countData.user_today_counts}</h2>
                <h2>{userTodayCnt}</h2>
                <h3>call</h3>
              </div>
            </div>
          </div>

          <div className={styles['coun-box']}>
            <div className={styles['title-box']}>
              <label>상담원 목록</label>
              <span onClick={() => navigate('/admin/consultant')}>+</span>
            </div>
            <div className={styles['listBox']}>
              <div className={styles.listContainer}>
                {counselors.map((c, index) => (
                  <div
                    key={index}
                    className={styles.listItem}
                    onClick={onConsultant}
                  >
                    <img src={c.avatar} />
                    <div className={styles['coun-info']}>
                      <div className={styles['row']}>
                        <h3>{maskName(c.name)}</h3>
                        <h4>{c.role}</h4>
                      </div>
                      <h5>{c.email}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className={styles['col2']}>
          <div className={styles['static']}>
            <span className={styles['title']}>Statics</span>
            <div className={styles['responsive-container']}>
              <ResponsiveContainer width="100%" height="85%">
                <ComposedChart data={weeklyCallData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Bar
                    dataKey="common"
                    barSize={60}
                    fill="#8a8a8a"
                    radius={8}
                  />
                  <Bar
                    dataKey="caution"
                    barSize={60}
                    fill="#34c759"
                    radius={8}
                  />
                  <Line type="monotone" dataKey="total" stroke="#1e1e1e" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className={styles['list-caution']}>
            <div className={styles['title-box']}>
              <label>주의고객 요청목록</label>
              <span onClick={() => navigate('/admin/client/caution')}>+</span>
            </div>
            <div className={styles['total-caution']}>
              Total Request : {specialReqCustomers.length}
            </div>
            <div className={styles['listBox']}>
              <div className={styles.listContainer}>
                {specialReqCustomers.map((customer, index) => (
                  <div
                    key={index}
                    className={styles.listItem}
                    onClick={onClient}
                  >
                    <span className={styles.index}>{index + 1}</span>
                    <div className={styles.customerInfo}>
                      <span className={styles.name}>
                        {maskName(customer.name)}
                      </span>
                      <span className={styles.phone}>
                        {customer.phone === '101'
                          ? maskPhoneNumber(`01012342${customer.phone}`)
                          : maskPhoneNumber(customer.phone)}
                      </span>
                    </div>
                    <div className={styles.actions}>
                      <button
                        className={`${styles.actionButton} ${styles.accept}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCautionUpdate(customer.phone, true);
                        }}
                      >
                        <img src="/icon/check.svg" alt="Accept" />
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.reject}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCautionUpdate(customer.phone, false);
                        }}
                      >
                        <img src="/icon/reject.svg" alt="Reject" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
