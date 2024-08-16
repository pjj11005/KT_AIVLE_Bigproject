import React, { useEffect, useState } from 'react';
import styles from './beforeCall.module.scss';
import BeforeCallDetailModal from './modal/BeforeCallDetailModal.module';

const ITEMS_PER_PAGE = 15;

const BeforeCall: React.FC = () => {
  const list = [
    {
      index: 1,
      date: '2024-2-11',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 2,
      date: '2024-2-12',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 3,
      date: '2024-2-13',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 4,
      date: '2024-2-14',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 5,
      date: '2024-2-15',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 6,
      date: '2024-2-16',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 7,
      date: '2024-2-17',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 8,
      date: '2024-2-18',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 9,
      date: '2024-2-19',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 10,
      date: '2024-2-20',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 11,
      date: '2024-2-21',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 12,
      date: '2024-2-22',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 13,
      date: '2024-2-23',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 14,
      date: '2024-2-24',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 15,
      date: '2024-2-25',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 16,
      date: '2024-2-26',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 17,
      date: '2024-2-27',
      name: '2조',
      word: '문의, 교환',
    },
    {
      index: 18,
      date: '2024-2-28',
      name: '2조',
      word: '문의, 교환',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setOpenModal(false);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setOpenModal(false);
    }
  };

  const setModalClose = () => {
    setOpenModal(false);
  };

  const handleUserCardClick = (item: any) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const sortedList = [...list].sort((a, b) => b.index - a.index);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPageItems = sortedList.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const totalPages = Math.ceil(sortedList.length / ITEMS_PER_PAGE);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className={styles.container}>
      <section className={styles.call}>
        <h3>{'2조'}님의 통화 내역</h3>
        <div className={styles['call-container']}>
          {currentPageItems.map((value) => (
            <div
              className={styles['notice-link']}
              key={value.index}
              onClick={() => handleUserCardClick(value)}
            >
              <div>
                <span>{value.date}</span>
                <span>{value.name}</span>
                <span>{value.word}</span>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageClick(index + 1)}
              className={currentPage === index + 1 ? styles.active : ''}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </section>
      {openModal && (
        <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
          <BeforeCallDetailModal onClose={setModalClose} item={selectedItem} />
        </div>
      )}
    </div>
  );
};
export default BeforeCall;
