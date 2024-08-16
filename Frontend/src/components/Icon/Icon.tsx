import React from 'react';
import styles from './Icon.module.scss';

interface IconProps {
  name: string;
  size?: number;
  hoverImage?: string;
  isHovered?: boolean;
  onClickEvent?: (e: React.MouseEvent<HTMLElement>) => void;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  hoverImage,
  isHovered = false,
  onClickEvent,
}) => {
  const style: React.CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    backgroundImage: `url(/icon/${isHovered && hoverImage ? hoverImage : name})`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    transition: 'background-image 0.3s ease',
  };

  return <i className={styles.icon} style={style} onClick={onClickEvent} />;
};

export default Icon;
