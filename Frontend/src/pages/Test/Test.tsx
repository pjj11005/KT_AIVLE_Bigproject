import Input from '../../components/Input';
import React, { useState } from 'react';
import Button from '../../components/Button';
import GNB from '../../components/GNB';
import Icon from '../../components/Icon';
import styles from './Test.module.scss';
import Profile from '../../components/Profile';
import CheckName from '../../components/CheckName';
import CalendarSelect from '../../components/CalendarSelect';
import Avatar from 'components/Avatar';

function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

const Test: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.id === 'emailInput') {
      if (!isValidEmail(event.target.value)) {
        setEmailError((prev) => true);
      } else {
        setEmailError((prev) => false);
      }
      setEmail((prev) => event.target.value);
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['right']}>
        <GNB userProfileUrl={''} />
        <Input
          id={'emailInput'}
          onChange={handleInputChange}
          value={email}
          placeholder={'small'}
          size={'small'}
          type={'text'}
          error={emailError}
          errorMessage={'Invalid Email'}
        />
        <Input
          id={'emailInput'}
          onChange={handleInputChange}
          value={email}
          placeholder={'medium'}
          size={'medium'}
          type={'text'}
          error={emailError}
          errorMessage={'Invalid Email'}
        />
        <Input
          id={'emailInput'}
          onChange={handleInputChange}
          value={email}
          placeholder={'large'}
          size={'large'}
          type={'text'}
          error={emailError}
          errorMessage={'Invalid Email'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'primary'}
          stylesType={'all'}
          onClick={() => {
            alert('w');
          }}
          children={'primary all'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'secondary'}
          stylesType={'all'}
          onClick={() => {
            alert('w');
          }}
          children={'secondary all'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'gray'}
          stylesType={'all'}
          onClick={() => {
            alert('w');
          }}
          children={'gray all'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'primary'}
          stylesType={'side'}
          onClick={() => {
            alert('w');
          }}
          children={'primary side'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'secondary'}
          stylesType={'side'}
          onClick={() => {
            alert('w');
          }}
          children={'secondary side'}
        />
        <Button
          type={'button'}
          size={'medium'}
          color={'gray'}
          stylesType={'side'}
          onClick={() => {
            alert('w');
          }}
          children={'gray side'}
        />

        <Icon name={'bell'} size={20} />
        <Avatar size={'s'} name={'kitez'} />
        <Avatar size={'m'} isOnline={true} />
        <Avatar size={'l'} isOnline={false} />
        <br />

        <Profile
          src={'/image/kitty.jpg'}
          name={'kitty'}
          role={'사원'}
          email={'kitty@gmail.com'}
          isOnline={true}
          id={1}
        />

        <CheckName />
        <CheckName check={'caution'} />
        <CheckName check={'caution'} size={'small'} />
        <CheckName check={'caution'} size={'large'} />
        <CalendarSelect />
      </div>
    </div>
  );
};

export default Test;
