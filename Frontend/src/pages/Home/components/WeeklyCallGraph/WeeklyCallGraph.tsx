import React from 'react';
import styles from './WeeklyCallGraph.module.scss';
import StackedBarChart from '../../../../components/StackedBarChart/StackedBarChart';
import { Link } from 'react-router-dom';

const WeeklyCallGraph: React.FC = () => {
  return (
    <div className={styles['container']}>
      <Link to={'/dashboard'}>
        <h2>주간 콜 건수 그래프</h2>
      </Link>
      <div className={styles['graph-placeholder']}>
        <StackedBarChart />
      </div>
    </div>
  );
};

export default WeeklyCallGraph;
