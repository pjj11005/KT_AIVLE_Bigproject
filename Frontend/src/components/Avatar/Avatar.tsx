import React from 'react';
import styles from './Avatar.module.scss';

interface AvatarProps {
  url?: string;
  size?: 's' | 'm' | 'l';
  name?: string;
  isOnline?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  url = '/image/user.png',
  size = '60px',
  name = '',
  isOnline,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.avatar}>
        {url ? (
          <img src={url} alt={`${name}'s profile`} />
        ) : (
          <div className={styles.initials}>{getInitials(name)}</div>
        )}
      </div>
      {isOnline !== undefined && (
        <span
          className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
