import React, { useEffect, useState } from 'react';
import styles from './Signup.module.scss';
import Input from '../../components/Input';
import { isValidEmail, isValidPassword } from '../Login/LoginService';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpFormData, signupRegister } from '../../api/signup';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignUpFormData>({
    name: '',
    email: '',
    password1: '',
    password2: '',
    phone: '',
  });

  const [errors, setErrors] = useState<Partial<SignUpFormData>>({});
  const [disabled, setDisabled] = useState<boolean>(true);
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const tempErrors: Partial<SignUpFormData> = {};

    if (formData.name) {
      const regex = /^[가-힣]+$/;
      if (!regex.test(formData.name)) {
        tempErrors.name = '한글로만 입력가능합니다.';
      }
    }

    if (!formData.email) {
      tempErrors.email = '이메일을 입력해주세요.';
    } else if (!isValidEmail(formData.email)) {
      tempErrors.email = '이메일 형식이 아닙니다.';
    }

    if (!formData.password1) {
      tempErrors.password1 = '비밀번호를 입력해주세요.';
    } else if (formData.password1.length < 10) {
      tempErrors.password1 = '비밀번호는 10자 이상이어야 합니다.';
    } else if (!isValidPassword(formData.password1)) {
      tempErrors.password1 = '비밀번호 형식이 올바르지 않습니다.';
    }

    if (formData.password1 !== formData.password2) {
      tempErrors.password2 = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.phone) {
      tempErrors.phone = 'Phone number is required!';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState: SignUpFormData) => ({
      ...prevState,
      [id]: value,
    }));

    validateForm();
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const result = await signupRegister(formData);
        if (result) {
          alert(
            '회원가입이 완료되었습니다.\n회원가입을 완료하시고 싶으시면 메일 인증해주세요!',
          );
          navigate('/');
        }
      } catch (error) {
        alert('회원가입에 실패했습니다. 다시 시도해주세요.');
      }
    } else {
      alert('Form is invalid!');
    }
  };

  useEffect(() => {
    if (
      formData.password1 &&
      formData.password2 &&
      formData.email &&
      formData.phone
    ) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [formData]);

  return (
    <div className={styles.container}>
      <Link to="/">
        <img
          src="/icon/voss_logo.png"
          alt="Main Logo"
          className={styles.logo}
        />
      </Link>
      <div className={styles.signupBox}>
        <h1 className={styles.title}>SIGN UP</h1>
        <form method="POST" className={styles.form}>
          <Input
            id="name"
            type="text"
            value={formData.name}
            error={!!errors.name}
            errorMessage={errors.name}
            onChange={handleChange}
            placeholder="이름"
            className={
              errors.name
                ? `${styles.input} ${styles['error-border']}`
                : `${styles.input}`
            }
            label={'* 한글만 입력가능합니다.'}
          />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            errorMessage={errors.email}
            error={!!errors.email}
            className={
              errors.email
                ? `${styles.input} ${styles['error-border']}`
                : `${styles.input}`
            }
            label={'* 이메일 형식으로 입력해주세요.'}
          />
          <Input
            id="password1"
            type="password"
            value={formData.password1}
            onChange={handleChange}
            placeholder="Password"
            errorMessage={errors.password1}
            error={!!errors.password1}
            className={
              errors.password1
                ? `${styles.input} ${styles['error-border']}`
                : `${styles.input}`
            }
            label={
              '* 대문자, 소문자, 숫자, 기호 포함 10~20자 이내로 입력가능합니다.'
            }
          />
          <Input
            id="password2"
            type="password"
            value={formData.password2}
            onChange={handleChange}
            errorMessage={errors.password2}
            error={!!errors.password2}
            placeholder="Re-enter Password"
            className={
              errors.password2
                ? `${styles.input} ${styles['error-border']}`
                : `${styles.input}`
            }
          />
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            error={!!errors.phone}
            errorMessage={errors.phone}
            className={
              errors.phone
                ? `${styles.input} ${styles['error-border']}`
                : `${styles.input}`
            }
            label={"* '-' 기호없이 입력해주세요."}
          />
          <button
            type="submit"
            className={styles.button}
            onClick={handleSubmit}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
