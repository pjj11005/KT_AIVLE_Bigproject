import React from 'react';
import styles from './Input.module.scss';
import { InputProps } from './Input.types';

const Input: React.FC<InputProps> = ({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
  error,
  errorMessage,
  size = 'small',
  label,
  ...rest
}) => {
  return (
    <>
      <input
        className={
          error
            ? `${styles.error} ${styles.input} ${styles[size]}`
            : `${styles['input']} ${styles[size]}`
        }
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        {...rest}
      />
      {label ? <div className={styles['label']}>{label}</div> : <></>}
      {error && errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
    </>
  );
};

export default Input;
