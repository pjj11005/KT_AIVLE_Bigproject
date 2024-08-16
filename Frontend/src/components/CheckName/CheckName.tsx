import React from 'react';
import styles from './CheckName.module.scss';

interface ButtonProps  {
    check?:"caution" | "normal";
    size?: 'small' | 'medium' | 'large';
    name?:string;
}

const CheckName: React.FC<ButtonProps> = ({
    check ="normal",
    size = 'medium',
    name="user"
  }) => {
    const wrapperClass = size === 'small' ? styles.small :
                       size === 'large' ? styles.large : 
                       styles.medium;

    return (
      <div className={`${styles.nameWrapper} ${wrapperClass}`}>
        <h2>{name}</h2>
        {check === "caution" && <img src='/icon/caution.png' alt="Caution icon" />}
      </div>
    );
  };
export default CheckName;