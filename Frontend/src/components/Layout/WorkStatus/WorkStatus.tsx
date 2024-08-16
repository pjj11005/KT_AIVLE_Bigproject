import React, { useState } from 'react';
import styles from './WorkStatus.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../store';
import { StateType } from '../../GNB/GNB';
import { changeAgentStatus } from '../../../store/agent/agentSlice';
import { useLocation } from 'react-router-dom';

export const WorkStatus: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeState, setActiveState] = useState<StateType>('off');
  const location = useLocation();

  const handleStateChange = (state: StateType) => {
    setActiveState(state);
    dispatch(changeAgentStatus(state));
  };

  return (
    <div>
      <div className={styles['gnb-left-container']}>
        <h2>{location.pathname.includes('admin') ? 'ADMIN' : 'USER'}</h2>
        <div className={styles['user-state']}>
          <button
            className={`${styles['state-button']} ${styles['working']} ${activeState === 'working' ? styles['active'] : ''}`}
            onClick={() => handleStateChange('working')}
          >
            <span>working</span>
          </button>
          <button
            className={`${styles['state-button']} ${styles['resting']} ${activeState === 'resting' ? styles['active'] : ''}`}
            onClick={() => handleStateChange('resting')}
          >
            <span>resting</span>
          </button>
          <button
            className={`${styles['state-button']} ${styles['off']} ${activeState === 'off' ? styles['active'] : ''}`}
            onClick={() => handleStateChange('off')}
          >
            <span>off</span>
          </button>
        </div>
      </div>
    </div>
  );
};
