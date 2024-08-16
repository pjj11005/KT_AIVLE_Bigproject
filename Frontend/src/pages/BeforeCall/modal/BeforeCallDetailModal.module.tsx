import React from 'react';
import styles from './BeforeCallDetailModal.module.scss';
import Icon from '../../../components/Icon';
import moment from 'moment';

interface BeforeCallDetailModalProps {
  onClose: () => void;
  item: any;
  name?: string;
  phonenumber?: string;
}

const BeforeCallDetailModal: React.FC<BeforeCallDetailModalProps> = ({
  onClose,
  item,
  name,
  phonenumber,
}) => {
  if (!item) return null;
  const formatDate = (dateString: string) => {
    return moment(dateString).format('YYYY-MM-DD HH:mm:ss');
  };

  const renderChatContent = (context: string) => {
    const lines = context.split('\n');
    return lines
      .map((line, index) => {
        const [dateTime, role, ...messageParts] = line.split(': ');
        const message = messageParts.join(': ');
        const [date, time] = dateTime.split(' ');
        const isClient = role === '민원인';

        if (!message.trim()) {
          return null;
        }

        return (
          <div
            key={index}
            className={`${styles.message} ${isClient ? styles.client : styles.counselor}`}
          >
            <div className={styles.bubble}>{message}</div>
            <div className={styles.time}>{time}</div>
          </div>
        );
      })
      .filter(Boolean);
  };

  return (
    <div className={styles['modal-overlay']} onClick={onClose}>
      <div className={styles['container']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['title-container']}>
          <Icon name={'close.png'} onClickEvent={onClose} />
        </div>
        <div className={styles['header']}>
          <span>{formatDate(item.date) || '날짜 정보 없음'}</span>
          <span>{name || 'Client'}</span>
          <span>
            {Array.isArray(item.keyword)
              ? item?.keyword.map((r: string) => {
                  return r + ', ';
                })
              : '키워드 없음'}
          </span>
        </div>
        <div className={styles['content-container']}>
          <div className={styles['left-column']}>
            <div className={styles['client-content']}>
              <div className={styles['line']}>
                <h3>고객정보</h3>
              </div>
              <ul>
                <li>
                  <span>이름</span>: {name || 'Client'}
                </li>
                <li>
                  <span>전화번호</span>:{' '}
                  {phonenumber === '101'
                    ? '010-1234-2' + phonenumber
                    : 'undefined'}
                </li>
              </ul>
            </div>
            <div className={styles['memo']}>
              <div className={styles['line']}>
                <h4>Memo</h4>
              </div>
              <div className={styles['memo-content']}>
                <h3>{item.opinion || '정보 없음'}</h3>
              </div>
            </div>
          </div>
          <div className={styles['right-column']}>
            <div className={styles['all']}>
              <h4>Content</h4>
              <div className={styles['all-content']}>
                <div className={styles['all-content']}>
                  {item.context ? (
                    renderChatContent(item.context)
                  ) : (
                    <h3>정보 없음</h3>
                  )}
                </div>
              </div>
            </div>
            <div className={styles['summary']}>
              <h4>Summary</h4>
              <div className={styles['summary-content']}>
                <h3>{item.summary || '요약 정보 없음'}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeforeCallDetailModal;
