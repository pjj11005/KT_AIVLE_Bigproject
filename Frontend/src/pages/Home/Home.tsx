import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import {
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line,
} from 'recharts';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getNotice, NoticeItem } from '../../api/notice';
import {
  getTodayCount,
  getUserTodayCount,
  getWeeklyCount,
} from '../../api/board/count';
import { getKeyWord, Word } from '../../api/keyword';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { getToken } from 'utils/auth';

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
interface CategoryCircleProps {
  category: Word;
  index: number;
}
interface CategoryDiagramProps {
  categories: Word[];
}

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [todayCnt, setTodayCnt] = useState<number>(0);
  const [userTodayCnt, setUserTodayCnt] = useState<number>(0);

  const user = useSelector((state: RootState) => state.auth.user);
  const [notices, setNotices] = useState<NoticeItem[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryData, setCategoryData] = useState<Word[]>([]);
  const [weeklyCallData, setWeeklyCallData] =
    useState<CallData[]>(initWeekData);

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
    if (!getToken()) {
      navigate('/');
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await getNotice();

        const sortedNotices = result.sort(
          (a, b) => (b.id as unknown as number) - (a.id as unknown as number),
        );

        setNotices((prev) => sortedNotices.slice(0, 7));

        setError(null);
      } catch (e) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const data = await getKeyWord();
        setCategoryData(data);
      } catch (error) {
        console.error('Error fetching category data:', error);
      }
    };

    fetchCategoryData();
  }, []);

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

  const onNav = () => {
    navigate('/dashboard');
  };

  const CategoryCircle: React.FC<CategoryCircleProps> = ({
    category,
    index,
  }) => (
    <div
      className={`${styles.tagItem} ${styles[`tagItem${index + 1}`]}`}
      data-tooltip-id={category.keyword}
      data-tooltip-html={`${category.keyword}<br />${category.count}`}
      data-html={true}
    >
      {category.keyword}
    </div>
  );

  const CategoryDiagram: React.FC<CategoryDiagramProps> = ({ categories }) => (
    <div className={styles.category}>
      <span className={styles.title}>Category</span>
      <div className={styles.tagCloud}>
        <div>
          {categories.slice(0, 3).map((category: Word, index: number) => (
            <CategoryCircle
              key={category.keyword}
              category={category}
              index={index}
            />
          ))}
        </div>
      </div>
      {categories.slice(0, 3).map((category: Word, index: number) => (
        <ReactTooltip
          key={category.keyword}
          id={category.keyword}
          place={index === 0 ? 'left' : index === 1 ? 'right' : 'bottom'}
          className={styles['custom-tooltip']}
        />
      ))}
    </div>
  );

  return (
    <div className={styles.homewrapper}>
      <div className={styles.home}>
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
                <h2>{userTodayCnt}</h2>
                <h3>call</h3>
              </div>
            </div>
          </div>

          <div className={styles['static']}>
            <span className={styles['title']}>statics</span>
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
        </div>

        <div className={styles['col2']}>
          <CategoryDiagram categories={categoryData} />
          <div className={styles['notice']}>
            <div className={styles['notice-title']}>
              <span className={styles['title']}>Notice</span>
              <Link to={'/notice'}>+</Link>
            </div>
            <table className={styles['notice-table']}>
              <thead>
                <tr className={styles['notice-header']}>
                  <th>번호</th>
                  <th>제목</th>
                  <th>날짜</th>
                  <th>작성자</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {notices.slice(0, 7).map((notice) => {
                  const date = new Date(notice.date);
                  const author = notice?.author?.slice(0, 5);
                  return (
                    <tr
                      key={notice.id}
                      className={styles['notice-item']}
                      onClick={() => navigate(`/notice/${notice.id}`)}
                    >
                      <td>{notice.id}</td>
                      <td>{notice.title}</td>
                      <td>
                        {date.getFullYear()}.{date.getMonth() + 1}.
                        {date.getDate()}
                      </td>
                      <td>{author}</td>
                      <td>{notice.views}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
