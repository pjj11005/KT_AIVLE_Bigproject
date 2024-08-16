import React, { useEffect, useState } from 'react';
import styles from './CreateNotice.module.scss';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import {
  createNotice,
  Notice,
  readNotice,
  updateNotice,
} from '../../api/notice';
import Loading from '../Loading';

const CreateNotice: React.FC = () => {
  const [notice, setNotice] = useState<Notice>({
    title: '',
    content: '',
    category: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const index = location.pathname.lastIndexOf('/');
    const noticeId = location.pathname.slice(index + 1);

    const fetchData = async (id: string) => {
      try {
        setIsLoading(true);
        await readNotice(id).then((r) => {
          setNotice((prev) => {
            return {
              title: r.title,
              content: r.content,
              category: r.category,
            };
          });
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

    if (noticeId !== 'create') {
      fetchData(noticeId);
    }
  }, []);

  const handleInput = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNotice((prev) => ({
      ...prev,
      [event.target.id]: event.target.value,
    }));
  };

  const validateCategory = () => {
    if (!notice.category) {
      alert('카테고리를 선택해주세요.');
      return false;
    }
    return true;
  };

  const handleCreate = async () => {
    if (!validateCategory()) return;
    try {
      const result = await createNotice(notice);
      if (result) {
        navigation('/admin/notice');
      }
    } catch (e) {
      setError('공지사항 작성 중 에러가 발생하였습니다.');
      console.error('Error Create Notice ', e);
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  const handleEdit = async () => {
    if (!validateCategory()) return;
    try {
      const index = location.pathname.lastIndexOf('/');
      const noticeId = location.pathname.slice(index + 1);
      const result = await updateNotice(noticeId, notice);

      if (result) {
        navigation('/notice');
      }
    } catch (e) {
      setError('공지사항 수정 중 에러가 발생하였습니다.');
      console.error('Error Create Notice ', e);
    }
  };

  if (error) return <div>{error}</div>;
  return (
    <div className={styles['container']}>
      <div className={styles['new-notice-container']}>
        <div className={styles['title-container']}>
          {location.pathname.includes('/edit') ? (
            <h2>공지사항 수정</h2>
          ) : (
            <h2>새 공지사항 등록</h2>
          )}
        </div>
        <div className={styles['title-input-container']}>
          <select id="category" value={notice.category} onChange={handleInput}>
            <option value="" disabled>
              카테고리
            </option>
            <option value="안내">안내</option>
            <option value="소식">소식</option>
          </select>
          <input
            id={'title'}
            placeholder={'제목을 입력해주세요.'}
            value={notice.title}
            onChange={handleInput}
          />
          <div>
            {location.pathname.includes('/edit') ? (
              <Button
                onClick={handleEdit}
                size={'large'}
                children={'수정'}
                type={'submit'}
                stylesType={'side'}
                color={'secondary'}
              />
            ) : (
              <Button
                onClick={handleCreate}
                size={'large'}
                children={'등록'}
                type={'submit'}
                stylesType={'side'}
                color={'secondary'}
              />
            )}
          </div>
        </div>
        <div className={styles['content-container']}>
          <textarea
            id={'content'}
            placeholder={'내용을 입력해주세요.'}
            value={notice.content}
            onChange={handleInput}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateNotice;
