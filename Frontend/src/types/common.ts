import React from 'react';

export type Size = 'small' | 'medium' | 'large';
export type Color = 'primary' | 'secondary' | 'gray';

export type Role = 'A' | '관리자' | '사원' | '인턴';

export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
}

export interface User {
  name: string;
  id: string;
  role: Role;
  avatar: string;
}

export type ChangeHandler<T = string> = (value: T) => void;
