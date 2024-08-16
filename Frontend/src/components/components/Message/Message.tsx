import React from 'react';
import styles from './Message.module.scss';

interface MessageProps {
  text: string;
  sender: 'me' | 'other';
}

export const Message: React.FC<MessageProps> = ({ text, sender }) => {
  return (
    <div className={`${styles.messageWrapper} ${styles[sender]}`}>
      <div className={styles.message}>
        <p>{text}</p>
      </div>
    </div>
  );
};
