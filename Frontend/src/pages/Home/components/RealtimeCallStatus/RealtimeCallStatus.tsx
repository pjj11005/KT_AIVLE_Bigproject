import React from 'react';
import styles from './RealtimeCallStatus.module.scss';
import { FaPhoneVolume, FaClock } from 'react-icons/fa';

const RealtimeCallStatus: React.FC = () => {
  return (
    <div className={styles['realtime-call-container']}>
      <h2 className={styles['call-title']}>실시간 대기 콜 현황</h2>
      <div className={styles['call-stats']}>
        <div className={styles['stat-item']}>
          <FaPhoneVolume className={styles['stat-icon']} />
          <div className={styles['stat-content']}>
            <span className={styles['stat-label']}>대기 콜</span>
            <span className={styles['stat-value']}>15건</span>
          </div>
        </div>
        <div className={styles['stat-item']}>
          <FaClock className={styles['stat-icon']} />
          <div className={styles['stat-content']}>
            <span className={styles['stat-label']}>평균 대기 시간</span>
            <span className={styles['stat-value']}>3분 30초</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeCallStatus;
