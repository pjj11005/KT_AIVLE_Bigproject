import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Profile.module.scss';

interface ProfileProps {
  src?: string;
  name?: string;
  role?: '인턴' | '사원' | '관리자' | 'A';
  email?: string;
  id?: number;
  isOnline?: boolean;
}

const Profile: React.FC<ProfileProps> = ({
  src = '/image/user2.png',
  name = 'user',
  role = '사원',
  email = '1234@gmail.com',
  id,
  isOnline,
}) => {
  return (
    <Link
      to={{
        pathname: `/profile/${id}`,
        search: `?name=${name}&role=${role}&email=${email}&src=${src}&isOnline=${isOnline}`,
      }}
      className={styles.profileWrapper}
    >
      {isOnline !== undefined && (
        <span
          className={`${styles.status} ${isOnline ? styles.online : styles.offline}`}
        ></span>
      )}
      <img src={src} alt="user-image" />
      <h2>{name}</h2>
      <h3>{role}</h3>
      <h4>{email}</h4>
    </Link>
  );
};

export default Profile;
