import React, { useEffect, useState } from 'react';
import styles from './MacManagement.module.scss';
import UserCard from './UserCard';
import MacDetailModal from './MacDetailModal/MacDetailModal';
import {
  Customer,
  getSpecialCustomer,
  getSpecialReqCustomer,
} from '../../api/admin/customer';
import { patchCaution } from 'api/caution';
import { deleteCaution } from '../../api/del_caution';

const MacManagement: React.FC = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [specCustomer, setSpecCustomer] = useState<Customer[]>([]);
  const [specReqCustomer, setSpecReqCustomer] = useState<Customer[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [client, setClient] = useState<{
    name: string;
    phone: string;
    id: string;
  }>({
    name: '',
    phone: '',
    id: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading((prev) => true);
        const spec = await getSpecialCustomer();
        const specReq = await getSpecialReqCustomer();
        setSpecCustomer((prev) => spec);
        setSpecReqCustomer((prev) => specReq);
      } catch (e) {
        setError('데이터를 불러오는 중 에러가 발생하였습니다.');
        console.error(e);
      } finally {
        setError(null);
        setLoading(false);
        setOpenModal(false);
      }
    };
    fetchData();
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false);
    }
  };

  const setModalClose = () => {
    setOpenModal((prev) => false);
  };

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

  const handleCautionUpdate = async (phone: string, set: boolean) => {
    try {
      setLoading(true);
      await patchCaution({ phone, set });
      const spec = await getSpecialCustomer();
      const specReq = await getSpecialReqCustomer();
      setSpecCustomer(spec);
      setSpecReqCustomer(specReq);
    } catch (error) {
      console.error('Caution update failed:', error);
      setError('Caution 업데이트 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCaution = async (phone: string) => {
    try {
      await deleteCaution({ phone });
      const updatedSpecCustomer = await getSpecialCustomer();
      setSpecCustomer(updatedSpecCustomer);
      alert('Caution이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Caution 삭제 실패:', error);
      alert('Caution 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles['container']}>
      <div className={styles['mac-title']}>CautionList</div>
      <div className={styles['mac-lists']}>
        {openModal && (
          <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
            <MacDetailModal
              onClose={setModalClose}
              userId={client.id}
              name={client.name}
              phone={client.phone}
            />
          </div>
        )}
        <section className={styles['inner-container']}>
          <div className={styles['title']}>
            <h2>Request</h2>
          </div>
          <UserCard
            setOpenModal={setOpenModal}
            setClient={setClient}
            clients={specReqCustomer}
            button1={'check'}
            button2={'delete'}
            onClickButton1={(
              e: React.MouseEvent<HTMLButtonElement>,
              client: Customer,
            ) => {
              e.stopPropagation();
              handleCautionUpdate(client.phone, true);
            }}
            onClickButton2={(
              e: React.MouseEvent<HTMLButtonElement>,
              client: Customer,
            ) => {
              e.stopPropagation();
              handleCautionUpdate(client.phone, false);
            }}
          />
        </section>
        <section className={styles['inner-container']}>
          <div className={styles['title']}>
            <h2>Monitored Account Client</h2>
          </div>
          <UserCard
            setOpenModal={setOpenModal}
            clients={specCustomer}
            button1={'delete'}
            onClickButton1={(
              e: React.MouseEvent<HTMLButtonElement>,
              client: Customer,
            ) => {
              e.stopPropagation();
              handleDeleteCaution(client.phone);
            }}
          />
        </section>
      </div>
    </div>
  );
};

export default MacManagement;
