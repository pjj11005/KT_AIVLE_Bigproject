import React from 'react';
import styles from './Register.module.scss';
import Input from 'components/Input';
import Button from 'components/Button';

interface RegisterProps {
  name: string;
  phoneNum: string;
  onNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneNumChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRegister: () => void;
}

const Register: React.FC<RegisterProps> = ({
  name,
  phoneNum,
  onNameChange,
  onPhoneNumChange,
  onRegister,
}) => {
  return (
    <div className={styles.RegisterWrapper}>
      <div className={styles.RegisterBox}>
        <h2>Search</h2>
        <div className={styles.setBox}>
          <label>Name</label>
          <Input
            size="small"
            id="registerName"
            onChange={onNameChange}
            value={name}
            placeholder="name"
            type="text"
          />
        </div>
        <div className={styles.setBox}>
          <label>Phone Number</label>
          <Input
            size="small"
            id="registerphone"
            onChange={onPhoneNumChange}
            value={phoneNum}
            placeholder="phone-number"
            type="tel"
          />
        </div>
        <div className={styles.registBtn}>
          <Button size="large" onClick={onRegister} color={'secondary'}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
