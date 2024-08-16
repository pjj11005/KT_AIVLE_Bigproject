import React, { useCallback, useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import styles from './ConsultationStaus.module.scss';
import { getCount, Count } from '../../../../api/board/count';

const ConsultationStats: React.FC = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [countData, setCountData] = useState<Count>({
    user_today_counts: 0,
    all_users_today_counts: 0,
  });

  const fetchCountData = useCallback(async () => {
    try {
      const data = await getCount();
      setCountData(data);
    } catch (error) {
      console.error('Error fetching count data:', error);
    }
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

  const data = [
    { name: '쇼핑', value: 200 },
    { name: 'TV', value: 50 },
    { name: '홈쇼핑', value: 100 },
    { name: '문의', value: 150 },
  ];

  const COLORS = ['#D0E3FF', '#D86F9A', '#D8A2F0', '#B3B7FF'];

  useEffect(() => {
    if (chartRef.current) {
      const chart = echarts.init(chartRef.current);
      const option = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'item',
        },
        legend: {
          orient: 'horizontal',
          bottom: '10px',
          left: 'center',
        },
        series: [
          {
            name: '상담 카테고리',
            type: 'pie',
            radius: ['40%', '60%'],
            label: {
              show: true,
              formatter: '{b}: {d}%',
            },
            labelLine: {
              show: true,
            },
            data: data.map((item, index) => ({
              value: item.value,
              name: item.name,
              itemStyle: {
                color: COLORS[index],
              },
            })),
            itemStyle: {
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        ],
      };
      chart.setOption(option);
    }
  }, [data, COLORS]);

  return (
    <div className={styles['consultation-stats']}>
      <div className={styles['call-counts']}>
        <h3>상담 카테고리</h3>
        <div>
          <div className={styles['count-item']}>
            <span className={styles.label}>내 콜 건수</span>
            <span className={styles.count}>{countData.user_today_counts}</span>
          </div>
          <div className={styles['count-item']}>
            <span className={styles.label}>팀 전체 콜 건수</span>
            <span className={styles.count}>
              {countData.all_users_today_counts}
            </span>
          </div>
        </div>
      </div>
      <div className={styles['category-chart']}>
        <div className={styles['chart-container']} ref={chartRef} />
      </div>
    </div>
  );
};

export default ConsultationStats;
