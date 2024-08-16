import React from 'react';
import GNB from '../GNB';
import { Outlet, useLocation } from 'react-router-dom';
import styles from './Layout.module.scss';
import Sidebar from '../Sidebar/Sidebar';
import Footer from '../Footer/index';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Loading from '../../pages/Loading';
import { WorkStatus } from './WorkStatus/WorkStatus';
import MainFooter from 'components/Footer/MainFooter';

const Layout: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();
  const isHomePage = location.pathname.includes('home');

  return (
    <div className={styles['layout']}>
      <Sidebar />
      <div className={styles['main']}>
        <GNB userProfileUrl={''} />
        <div className={styles['content']}>
          <WorkStatus />
          <Outlet />
        </div>
      </div>
      {!isHomePage && <Footer />}
      {isHomePage && <MainFooter />}
    </div>
  );
};

export default Layout;
