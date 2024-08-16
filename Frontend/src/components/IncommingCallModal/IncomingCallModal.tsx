import React, { useEffect, useState } from 'react';
import styles from './IncomingCallModal.module.scss';
import { getRemoteUser } from 'store/sip/sipAPI';

interface IncomingCallModalProps {
  caller: string;
  onAccept: () => void;
  onTransfer: () => void;
}
const IncomingCallModal: React.FC<IncomingCallModalProps> = ({
  onAccept,
  onTransfer,
}) => {
  const [userPhone, setUserPhone] = useState<string>('010-0000-0000');

  useEffect(() => {
    const user = getRemoteUser();
    if (user) {
      setUserPhone(user);
    } else {
      setUserPhone('010-0000-0000');
    }
  }, []);
  return (
    <div className={styles['overlay']}>
      <div className={styles['modal']}>
        <span className={styles['call-number']}>010-1234-2{userPhone}</span>
        <div className={styles['button-container']}>
          <button
            onClick={onAccept}
            id={'call'}
            type={'button'}
            style={{
              backgroundImage: `url('/image/call.png')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          ></button>
          <button
            onClick={onTransfer}
            id={'transfer'}
            type={'button'}
            style={{
              backgroundImage: `url('/image/transfer.png')`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
            }}
          ></button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
