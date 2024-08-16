import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { isValidEmail } from './LoginService';
import { LoginForm } from './Interface/LoginInterface';
import { RootState, useAppDispatch } from '../../store';
import { login } from '../../store/auth/authSlice';
import { getToken } from '../../utils/auth';
const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isValidEmail(loginForm.email)) {
      try {
        await dispatch(login(loginForm)).unwrap();
        navigate('/home');
      } catch (err) {
        console.error('Login failed: ', err);
        alert('로그인에 실패하였습니다. 다시 시도해주세요.');
      }
    } else {
      alert('이메일 형식이 아닙니다. 다시 입력해주세요.');
    }
  };

  useEffect(() => {
    if (getToken()) {
      navigate('/home');
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <img
          src="/icon/voss_logo.png"
          alt="Main Logo"
          className={styles.logo}
        />
        <h2 className={styles.subtitle}>Voice Of Smart System</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="abc@email.com"
            value={loginForm.email}
            onChange={(e) =>
              setLoginForm((prevState: LoginForm) => ({
                email: e.target.value,
                password: prevState.password,
              }))
            }
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={loginForm.password}
            onChange={(e) =>
              setLoginForm((prevState: LoginForm) => ({
                email: prevState.email,
                password: e.target.value,
              }))
            }
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            LOGIN
          </button>
        </form>
        <div className={styles.links}>
          <Link to="/accounts/signup-agree">Sign Up</Link>
          <Link to="/accounts/reset_password">Reset Password</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
