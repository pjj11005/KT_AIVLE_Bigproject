import React from 'react';
import styles from './MainFooter.module.scss';
import { Link } from 'react-router-dom';

const MainFooter: React.FC = () => {
  return (
    <div className={styles['main-footer']}>
      <div className={styles['footer']}>
        <div className={styles['footer-left']}>
          <h2>VOSS</h2>
          <div>
            <p>© voss All right reserved</p>
            <Link to={'/private/policy'}>
              <p>개인정보처리 방침</p>
            </Link>
            <Link to={'/term'}>
              <p>이용약관</p>
            </Link>
          </div>
        </div>
        <div className={styles['footer-right']}>
          <img src="/icon/sns.svg" />
        </div>
      </div>
    </div>
  );
};

export default MainFooter;
