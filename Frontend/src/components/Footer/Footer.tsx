import React from 'react';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
const Footer: React.FC = () => {
  return (
    <div className={styles['footer']}>
      <div>
        © <Link to={'/about'}>Voss by Team aivle02</Link>
      </div>
    </div>
  );
};

export default Footer;
