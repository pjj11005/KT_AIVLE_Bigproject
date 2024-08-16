import React from 'react';
import styles from './CalendarSelect.module.scss';
import Calendar from 'react-calendar';
import "react-calendar/dist/Calendar.css";
import { useState } from 'react';


type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
const CalendarSelect: React.FC = () => {

  const [value, onChange] = useState<Value>(new Date());
  return (
      <div>
        <Calendar  onChange={onChange} value={value}/>
      </div>
  );
};
export default CalendarSelect;