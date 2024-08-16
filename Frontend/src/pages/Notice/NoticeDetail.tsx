import React, { useEffect, useState } from 'react';
import styles from './NoticeDetail.module.scss';
import Button from '../../components/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteNotice, ReadNotice, readNotice } from '../../api/notice';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const NoticeDetail: React.FC = () => {
  const [notice, setNotice] = useState<ReadNotice | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const { id } = useParams();

  const handleDeleteNotice = async (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();

    try {
      const confirmation = window.confirm('정말로 삭제하시겠습니까?');
      if (confirmation) {
        if (notice) {
          await deleteNotice(notice.id);
        }
        alert('삭제되었습니다.');
        navigate(-1);
      } else {
        alert('삭제가 취소되었습니다.');
      }
    } catch (e) {
      console.error(e);
      alert('ERROR: delete notice');
    }
  };

  useEffect(() => {
    const index = location.pathname.lastIndexOf('/');
    const noticeId = location.pathname.slice(index + 1);

    const fetchData = async (id: string) => {
      try {
        setIsLoading(true);
        await readNotice(id).then((r) => {
          setNotice((prev) => r);
          setError(null);
          setIsLoading(false);
        });
      } catch (e) {
        setError('데이터를 불러오는데 에러가 발생하였습니다.');
        console.error(e);
      } finally {
        setError(null);
        setIsLoading(false);
      }
    };

    fetchData(noticeId);
  }, [id]);

  if (error)
    return (
      <div
        style={{
          marginLeft: '1rem',
        }}
      >
        {error}
      </div>
    );
  return (
    <div className={styles['container']}>
      <div className={styles['title-container']}>
        <div className={styles['title-name-container']}>
          [{notice?.category}] {notice?.title}
        </div>
        <div className={styles['btns']}>
          <Button
            onClick={() => navigate('/admin/notice')}
            size={'medium'}
            children={'목록'}
            type={'button'}
            stylesType={'side'}
          />
          {notice?.user === user?.id && (
            <>
              <Button
                onClick={handleDeleteNotice}
                size={'medium'}
                children={'삭제'}
                type={'button'}
                stylesType={'side'}
                color={'primary'}
              />
              <Button
                onClick={() => navigate(`/notice/edit/${notice?.id}`)}
                size={'medium'}
                children={'수정'}
                type={'button'}
                stylesType={'side'}
                color={'primary'}
              />
            </>
          )}
        </div>
      </div>
      <div className={styles['container-box']}>
        <div className={styles['content-container']}>
          <div className={styles['contents']}>{notice?.content}</div>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetail;
