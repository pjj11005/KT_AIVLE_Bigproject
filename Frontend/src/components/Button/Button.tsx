import React from 'react';
import styles from './Button.module.scss';
import { Color } from '../../types';

interface ButtonProps {
  size?: 'small' | 'medium' | 'large';
  type?: 'submit' | 'reset' | 'button';
  stylesType?: 'all' | 'side';
  color?: Color;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  type = 'button',
  color = 'primary',
  onClick,
  children,
  disabled = false,
  stylesType = 'all',
}) => {
  const buttonClass = `
        ${styles.buttonWrapper} 
        ${styles[size]} 
        ${styles[`${stylesType}-${color}`]}
  `.trim();

  return (
    <button
      disabled={disabled}
      type={type}
      className={
        disabled
          ? `${styles.buttonWrapper} ${styles[size]} ${styles['disabled']} `
          : buttonClass
      }
      onClick={onClick}
    >
      {children || '버튼'}
    </button>
  );
};
export default Button;
