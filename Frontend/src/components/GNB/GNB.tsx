import React, { useEffect, useState } from 'react';
import styles from './GNB.module.scss';
import Icon from '../Icon';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import AlarmItem from './AlarmItem/AlarmItem';
import { EventSourcePolyfill, NativeEventSource } from 'event-source-polyfill';
import { patchData } from '../../api';
import { Role, User } from 'types/common';
import { APIResponse } from '../../interface/commonResponse';

export interface GNBProps {
  userProfileUrl: string;
}

interface Alarm {
  user: User;
  id: number;
  date: string;
  content: string;
  title: string;
  author: string;
  created_at: string;
  is_read: boolean;
}
export type StateType = 'working' | 'resting' | 'off';
const GNB: React.FC<GNBProps> = ({ userProfileUrl }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const profile = useSelector((state: RootState) => state.auth.avatar);
  const [openAlarm, setOpenAlarm] = useState<boolean>(false);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [ring, setRing] = useState(false);
  const navigate = useNavigate();

  const handleOpenAlarm = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    setOpenAlarm((prev) => !prev);
  };

  const handleProfileClick = () => {
    navigate('/mypage');
  };

  const handleNoticeItem = async (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    event.preventDefault();

    const id = event.currentTarget.id;
    await readNotice(id)
      .then((r) => {
        setOpenAlarm((prev) => false);
        navigate(`/notice/${id}`);
      })
      .catch((e) => console.error(e));
  };

  const readNotice = async (id: string) => {
    await patchData<Alarm[]>(`/notice/mark-as-read/${id}/`, null, {
      withCredentials: true,
    })
      .then((r: APIResponse<Alarm[]>) => {
        setAlarms((prev) => r.result);
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    const EventSource = EventSourcePolyfill || NativeEventSource;
    const eventSource = new EventSource(
      'http://localhost:8000/api/notice/sse/',
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        heartbeatTimeout: 86400000,
      },
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.keepalive) {
        setRing((prev) => false);
      } else {
        setAlarms((prev) => data);
        setRing((prev) => true);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);
  return (
    <div className={styles['gnb-wrapper']}>
      <nav className={styles['container']}>
        <div className={styles['gnb-right-container']}>
          <button
            onClick={handleOpenAlarm}
            className={
              openAlarm
                ? `${styles['icon-active']} ${styles['icon']}`
                : styles['icon']
            }
          >
            <Icon name={'alarm.png'} size={40} />
            {alarms.length ? <div className={styles['alarm']}></div> : null}
          </button>

          <button className={styles['profile']} onClick={handleProfileClick}>
            <img
              src={
                profile !== null &&
                profile.startsWith('/media/') &&
                profile.length > '/media/'.length
                  ? `http://localhost:8000${profile}`
                  : '/image/user.png'
              }
            />

            <span>{user?.name || 'User'}</span>
          </button>
        </div>
        {openAlarm && (
          <div className={styles['alarm-container']}>
            <div className={styles['alarm-top']}>
              <h3>알람</h3>
              <Icon
                size={18}
                name={'close.png'}
                onClickEvent={handleOpenAlarm}
              />
            </div>
            <div className={styles['alarm-content']}>
              {Array.isArray(alarms) && alarms.length > 0 ? (
                <ul>
                  {alarms.map((alarm) => (
                    <AlarmItem
                      onClick={handleNoticeItem}
                      key={alarm.id}
                      date={alarm.created_at}
                      content={`${alarm.content}`}
                      author={alarm.author}
                      id={alarm.id.toString()}
                    />
                  ))}
                </ul>
              ) : (
                <span>알림이 없습니다.</span>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default GNB;
