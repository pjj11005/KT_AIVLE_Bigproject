import React, { MouseEventHandler } from 'react';
import styles from './AlarmItem.module.scss';
import { Link } from 'react-router-dom';

export interface AlarmItemProps {
  date: string;
  content: string;
  id: string;
  author: string;
  onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

const AlarmItem: React.FC<AlarmItemProps> = ({
  author,
  date,
  content,
  id,
  onClick,
}) => {
  const created_at = new Date(date);
  return (
    <Link id={id} to={`/notice/${id}`} onClick={onClick}>
      <li className={styles['alarm-container']}>
        <span className={styles['date']}>
          {created_at.getFullYear()}. {created_at.getMonth() + 1}.{' '}
          {created_at.getDate()}
        </span>
        <span>{content}</span>
        <span>{author}</span>
      </li>
    </Link>
  );
};

export default AlarmItem;
