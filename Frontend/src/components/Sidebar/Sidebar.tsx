import React, { useState } from 'react';
import styles from './Sidebar.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { ADMIN_BASE_URL } from '../../utils/routes';
import {
  getRefreshToken,
  removeRefreshToken,
  removeToken,
} from '../../utils/auth';
import { logoutUser } from 'store/auth/authSlice';
import Icon from '../Icon';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  iconHover: string;
}

const menuItems: MenuItem[] = [
  {
    id: '/home',
    label: 'Home',
    icon: 'home.svg',
    iconHover: 'home-hover.png',
  },
  {
    id: '/notice',
    label: 'Notice',
    icon: 'bell.svg',
    iconHover: 'bell-hover.png',
  },
  {
    id: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard.svg',
    iconHover: 'dashboard-hover.png',
  },
  {
    id: '/mypage',
    label: 'MyPage',
    iconHover: 'mypage-hover.png',
    icon: 'mypage.svg',
  },
];

const adminMenuItems: MenuItem[] = [
  {
    id: ADMIN_BASE_URL,
    label: 'Home',
    icon: 'home.svg',
    iconHover: 'home.svg',
  },
  {
    id: ADMIN_BASE_URL + '/notice',
    label: 'Notice',
    icon: 'bell.svg',
    iconHover: 'bell.svg',
  },
  {
    id: ADMIN_BASE_URL + '/consultant',
    label: 'Consultant',
    iconHover: 'consultant.png',
    icon: 'consultant.png',
  },
  {
    id: ADMIN_BASE_URL + '/client/caution',
    label: 'Client',
    icon: 'client.png',
    iconHover: 'client-hover.png',
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleAdminClick = () => {
    navigate(ADMIN_BASE_URL);
  };

  const handleClickEvent = async (
    event: React.MouseEvent<HTMLButtonElement | HTMLSpanElement>,
  ) => {
    event.preventDefault();

    if (event.currentTarget.id === 'logout') {
      try {
        const refreshTokenValue = getRefreshToken();

        removeToken();
        removeRefreshToken();
        dispatch(
          logoutUser({
            refresh: refreshTokenValue,
          }),
        );

        navigate('/');
      } catch (e) {
        if (e instanceof Error) {
          console.error('로그아웃 실패', e);
        } else {
          console.log('로그아웃 실패');
        }
      }
    } else {
      navigate('/home');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles['title-container']}>
        {location.pathname.includes('admin') ? (
          <Link to={'/admin'} className={styles['admin-title']}>
            <img src="/icon/voss_logo.png" alt="Main Logo" />
          </Link>
        ) : (
          <Link to={'/home'}>
            <img src="/icon/voss_logo.png" alt="Main Logo" />
          </Link>
        )}
      </div>
      <nav className={styles['menu-container']}>
        {!location.pathname.includes('admin') &&
          menuItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`${styles['menu-items']} ${location.pathname === item.id ? styles.active : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon
                name={location.pathname === item.id ? item.icon : item.icon}
                size={28}
                hoverImage={item.icon}
                isHovered={hoveredItem === item.id}
              />
              <span>{item.label}</span>
            </Link>
          ))}
        {location.pathname.includes('admin') &&
          adminMenuItems.map((item) => (
            <Link
              key={item.id}
              to={item.id}
              className={`${styles['menu-items']} ${location.pathname === item.id ? styles.active : ''}`}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Icon
                name={
                  location.pathname === item.id ? item.iconHover : item.icon
                }
                size={28}
                hoverImage={item.iconHover}
                isHovered={hoveredItem === item.id}
              />
              <span>{item.label}</span>
            </Link>
          ))}
        <div className={styles['bottom-container']}>
          {user &&
          user.role === '관리자' &&
          !location.pathname.includes('admin') ? (
            <button onClick={handleAdminClick} className={styles.adminButton}>
              <img src="/icon/admin.png" alt="icon" />
              <span className={styles.font}>Admin</span>
            </button>
          ) : null}

          {user &&
          user.role === '관리자' &&
          location.pathname.includes('admin') ? (
            <button
              id={'exit'}
              onClick={handleClickEvent}
              className={styles.adminButton}
            >
              <img src="/icon/admin.png" alt="icon" />
              <span className={styles.font}>User</span>
            </button>
          ) : null}
          <button
            id={'logout'}
            onClick={handleClickEvent}
            className={styles['logout-container']}
          >
            <img src="/icon/logout.png" />
            <span className={styles.font}>Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
