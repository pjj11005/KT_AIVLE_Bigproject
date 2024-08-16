import React from 'react';
import { BaseProps, Size } from '../../types';
export interface InputProps extends BaseProps {
  id?: string;
  type?: 'tel' | 'text' | 'password' | 'email' | 'number';
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  label?: string;
  size?: Size;
}
