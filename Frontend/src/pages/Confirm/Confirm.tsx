import React from 'react';
import styles from './Confirm.module.scss';
import { useNavigate } from 'react-router-dom';

const Confirm: React.FC = () => {
  const navigate = useNavigate();
  const goHome = () => {
    navigate('/');
  };
  return (
    <div className={styles['container']}>
      <img src="/icon/voss_logo.png" />
      <h1>이메일 인증이 완료되었습니다!</h1>
      <p>페이지로 돌아가 로그인해주세요 :)</p>
      <button onClick={goHome}>메인화면 가기</button>
    </div>
  );
};

export default Confirm;
