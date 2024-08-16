import React, { useEffect, useState } from 'react';
import styles from './ResetPassword.module.scss';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { sendResetEmail, resetPassword } from './ResetPasswordService';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [password, setPassword] = useState({ password1: '', password2: '' });
  const [nextStep, setNextStep] = useState<number>(0);
  const [uid, setUid] = useState('');
  const [token, setToken] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams<{ uid?: string; token?: string }>();

  useEffect(() => {
    if (params.uid && params.token) {
      setUid(params.uid);
      setToken(params.token);
      setNextStep(2);
    } else {
      setNextStep(0);
    }
  }, [params]);

  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(false);
  };

  const handlePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setPassword((prev) => ({ ...prev, [id]: value }));
    setErrorMessage('');
  };

  const handleSendResetEmail = async () => {
    try {
      const sent = await sendResetEmail(email);
      if (sent) {
        setNextStep(1);
      } else {
        setError(true);
        setErrorMessage('Failed to send reset email. Please try again.');
      }
    } catch (error) {
      setError(true);
      setErrorMessage('An error occurred. Please try again.');
      console.error('Error in handleSendResetEmail:', error);
    }
  };

  const handleResetPassword = async () => {
    if (password.password1 !== password.password2) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      const success = await resetPassword(uid, token, password.password1);
      if (success) {
        setNextStep(3);
        navigate('/');
      } else {
        setErrorMessage('Failed to reset password. Please try again.');
      }
    } catch (error: any) {
      setErrorMessage('An error occurred. Please try again.');
      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response data:', error.response.data);
        setErrorMessage(
          error.response.data.result?.detail ||
            'An error occurred. Please try again.',
        );
      } else {
        console.error('Error in handleResetPassword:', error);
      }
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles['outer-container']}>
        <div className={styles['title-container']}>
          <h2>
            <Link to={'/'}>
              <img
                src="/icon/voss_logo.png"
                alt="Main Logo"
                className={styles.logo}
              />
            </Link>
          </h2>
        </div>
        <div className={styles['reset-container']}>
          {nextStep === 0 && (
            <>
              <h3>비밀번호 변경하기</h3>
              <Input
                error={error}
                errorMessage={errorMessage}
                onChange={handleEmail}
                type="email"
                id="email"
                value={email}
                placeholder="Enter your email"
                className={styles.input}
              />
              <button
                type="submit"
                onClick={handleSendResetEmail}
                className={styles.button}
              >
                이메일 보내기
              </button>
            </>
          )}
          {nextStep === 1 && (
            <>
              <h3>이메일 확인하기</h3>
              <p>이메일을 발송하였습니다! 이메일 확인해주세요 :</p>
              <button
                onClick={() => setNextStep(0)}
                type="submit"
                className={styles.button}
              >
                이메일 다시 보내기
              </button>
              <button
                onClick={() => navigate('/')}
                type="submit"
                className={styles.button}
              >
                로그인 하러가기
              </button>
            </>
          )}
          {nextStep === 2 && (
            <>
              <h3>비밀번호 설정하기</h3>
              <Input
                type="password"
                id="password1"
                value={password.password1}
                onChange={handlePassword}
                placeholder="New Password"
                className={styles.input}
              />
              <Input
                type="password"
                id="password2"
                value={password.password2}
                onChange={handlePassword}
                placeholder="Confirm New Password"
                className={styles.input}
              />
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
              <button
                type="submit"
                onClick={handleResetPassword}
                className={styles.button}
              >
                비밀번호 변경하기
              </button>
            </>
          )}
          {nextStep === 3 && (
            <>
              <h3>성공적으로 비밀번호를 변경하였습니다!</h3>
              <p>비밀번호 변경이 완료 되었습니다!</p>
              <Button onClick={() => navigate('/')}>로그인하러가기</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ResetPassword;
