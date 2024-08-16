import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import styles from './Dashboard.module.scss';
import './CustomCalendar.css';

import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Bar,
  Line,
  BarChart,
  ResponsiveContainer,
} from 'recharts';
import {
  SlArrowLeft,
  SlArrowRight,
  SlControlStart,
  SlControlEnd,
} from 'react-icons/sl';
import {
  getDailyCount,
  getWeeklyCount,
  getYearCount,
} from '../../api/board/count';

interface CallData {
  day?: string;
  count?: number;
  name?: string;
  total?: number;
  common?: number;
  caution?: number;
  calls?: number;
}

interface MonthlyCallData {
  name: string;
  calls: number;
}

const initWeekData = [
  {
    name: '월',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '화',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '수',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '목',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '금',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '토',
    total: 0,
    common: 0,
    caution: 0,
  },
  {
    name: '일',
    total: 0,
    common: 0,
    caution: 0,
  },
];

const Dashboard: React.FC = () => {
  const [sessionType, setSessionType] = useState<string>('day');
  const [callData, setCallData] = useState<CallData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear(),
  );
  const [yearlyData, setYearlyData] = useState<MonthlyCallData[]>([]);

  useEffect(() => {
    if (sessionType === 'day' && selectedDate) {
      fetchCallDataForMonth(selectedDate);
    }

    if (sessionType === 'month') {
      fetchCallDataForYear(selectedYear);
    }

    if (sessionType === 'week') {
      fetchCallDataForWeek();
    }
  }, [sessionType, selectedDate]);

  const fetchCallDataForWeek = async () => {
    await getWeeklyCount()
      .then((response) => {
        if (response.length === 0) {
          setCallData(initWeekData);
        } else {
          setCallData((prev) => {
            const temp = initWeekData;
            response.map((r) => {
              const day = new Date(r.day).getDay();
              if (day === 0) {
                temp[6].common = r.regular_count;
                temp[6].caution = r.special_count;
                temp[6].total = r.count;
              } else {
                temp[day - 1].common = r.regular_count;
                temp[day - 1].caution = r.special_count;
                temp[day - 1].total = r.count;
              }
            });
            return temp;
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCallDataForMonth = async (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    await getDailyCount({ year, month })
      .then((r) => {
        setCallData(r);
      })
      .catch((e) => {
        console.error('Daily Count Error: ', e);
      });
  };

  const fetchCallDataForYear = async (year: number) => {
    const initData: MonthlyCallData[] = [
      { name: '1월', calls: 0 },
      { name: '2월', calls: 0 },
      { name: '3월', calls: 0 },
      { name: '4월', calls: 0 },
      { name: '5월', calls: 0 },
      { name: '6월', calls: 0 },
      { name: '7월', calls: 0 },
      { name: '8월', calls: 0 },
      { name: '9월', calls: 0 },
      { name: '10월', calls: 0 },
      { name: '11월', calls: 0 },
      { name: '12월', calls: 0 },
    ];

    const data: MonthlyCallData[] = [];

    await getYearCount()
      .then((response) => {
        if (response.length) {
          response.map((r) => {
            const month = new Date(r.month).getMonth() + 1;
            data.push({
              name: `${month}월`,
              calls: r.count,
            });
          });
          setCallData(data);
        } else {
          setCallData(initData);
        }
      })
      .catch((e) => console.error(e));

    setYearlyData(data);
  };

  const onSessionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSessionType(e.target.value);
  };

  const onYearChange = (year: number) => {
    setSelectedYear(year);
  };

  const onDateChange = (
    value: Date | Date[] | null,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (value instanceof Date) {
      setSelectedDate(value);
    } else if (
      Array.isArray(value) &&
      value.length === 1 &&
      value[0] instanceof Date
    ) {
      setSelectedDate(value[0]);
    }
  };

  const renderCalendarTile = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = date
        .toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\./g, '')
        .replace(/\s/g, '-');
      const callInfo = callData.find((d) => {
        if (d.day) {
          const date = new Date(d.day);
          const matchDate =
            date.getFullYear() +
            '-' +
            (date.getMonth() + 1 < 10
              ? '0' + (date.getMonth() + 1)
              : date.getMonth() + 1) +
            '-' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());

          if (matchDate === formattedDate) {
            return d;
          }
        }
      });
      return (
        <div>
          {callInfo ? (
            <div className={styles['call-count']}>{callInfo.count}</div>
          ) : (
            <div className={styles['call-count']}>-</div>
          )}
        </div>
      );
    }
    return <div />;
  };

  const calculateCalendarRows = async (date: Date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDay = firstDayOfMonth.getDay();

    const numRows = Math.ceil((daysInMonth + startDay) / 7);

    document.documentElement.style.setProperty(
      '--num-rows',
      numRows.toString(),
    );

    await fetchCallDataForMonth(date);
  };

  useEffect(() => {
    if (selectedDate) {
      calculateCalendarRows(selectedDate);
    }
  }, [selectedDate]);
  return (
    <div className={styles['container']}>
      <div className={styles['dash-container']}>
        <div className={styles.title}>
          <h2>Dashboard</h2>
          <div>
            <select
              className={styles['session-type']}
              onChange={onSessionTypeChange}
              value={sessionType}
            >
              <option value="day">일별</option>
              <option value="week">주별</option>
              <option value="month">월별</option>
            </select>
          </div>
        </div>
        <div className={styles['dash-main']}>
          {sessionType === 'day' && (
            <Calendar
              className={styles['calendar-container']}
              value={selectedDate}
              onChange={(value, event) =>
                onDateChange(value as Date | Date[] | null, event)
              }
              onActiveStartDateChange={({ activeStartDate }) => {
                if (activeStartDate) calculateCalendarRows(activeStartDate);
              }}
              tileContent={renderCalendarTile}
              prevLabel={<SlArrowLeft />}
              nextLabel={<SlArrowRight />}
              prev2Label={<SlControlStart />}
              next2Label={<SlControlEnd />}
            />
          )}
          {sessionType === 'week' && (
            <ResponsiveContainer width="100%" height="85%">
              <ComposedChart data={callData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid stroke="#f5f5f5" />
                <Bar dataKey="common" barSize={60} fill="#8a8a8a" radius={8} />
                <Bar dataKey="caution" barSize={60} fill="#34c759" radius={8} />
                <Line type="monotone" dataKey="total" stroke="#1e1e1e" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          {sessionType === 'month' && (
            <div className={styles['month']}>
              <div className={styles['year-controls']}>
                <button
                  onClick={() => onYearChange(selectedYear - 1)}
                  className={styles['year-button']}
                >
                  &lt;
                </button>
                <span className={styles['year-display']}>{selectedYear}</span>
                <button
                  onClick={() => onYearChange(selectedYear + 1)}
                  className={styles['year-button']}
                >
                  &gt;
                </button>
              </div>

              <ResponsiveContainer
                width="100%"
                height="100%"
                className={styles['graph']}
              >
                <BarChart data={callData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="calls" fill="#34c759" barSize={60} radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
