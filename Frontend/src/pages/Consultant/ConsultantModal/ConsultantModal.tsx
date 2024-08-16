import React from 'react';
import styles from './ConsultantModal.module.scss';
import { ConsultantInfo } from '../Consultant';

interface ConsultantModalProps {
  consultant: ConsultantInfo | null;
  onClose: () => void;
}

const ConsultantModal: React.FC<ConsultantModalProps> = ({
  consultant,
  onClose,
}) => {
  if (!consultant) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2>{consultant.name} 상세 정보</h2>
        <p>
          <strong>직급:</strong> {consultant.role}
        </p>
        <p>
          <strong>사번:</strong> {consultant.id}
        </p>
        <p>
          <strong>이메일:</strong> {consultant.email}
        </p>
        <p>
          <strong>전화번호:</strong> {consultant.phone}
        </p>
        <button className={styles['button']} onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default ConsultantModal;
