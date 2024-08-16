import React, { Dispatch, SetStateAction } from 'react';
import styles from './UserCard.module.scss';
import { Customer } from '../../../api/admin/customer';
import { maskName } from '../../../utils/utils';

export interface UserInfo {
  name: string;
  phone: string;
  userId: string;
}

type ButtonType = 'check' | 'delete';

export interface UserCardProps {
  clients: Customer[];
  button1?: ButtonType;
  onClickButton1?: (
    e: React.MouseEvent<HTMLButtonElement>,
    client: Customer,
  ) => void;
  button2?: ButtonType;
  onClickButton2?: (
    e: React.MouseEvent<HTMLButtonElement>,
    client: Customer,
  ) => void;
  onClickComponent?: (e: React.MouseEvent<HTMLLIElement>) => void;
  setOpenModal?: Dispatch<SetStateAction<boolean>>;
  setClient?: Dispatch<
    SetStateAction<{
      name: string;
      phone: string;
      id: string;
    }>
  >;
}

const UserCard: React.FC<UserCardProps> = ({
  setClient,
  setOpenModal,
  clients,
  button1,
  button2,
  onClickButton1,
  onClickButton2,
  onClickComponent,
}) => {
  return (
    <ul className={styles['mac-list-container']}>
      {clients.map((data, index) => {
        return (
          <li
            key={'user-card-' + index + data.id}
            id={data.id}
            className={styles['mac-item']}
            onClick={(e: React.MouseEvent<HTMLLIElement>) => {
              e.preventDefault();
              if (setClient) {
                setClient({
                  name: data.name,
                  phone: data.phone,
                  id: data.id,
                });
              }

              if (setOpenModal) {
                setOpenModal((prev) => true);
              }
            }}
          >
            <div className={styles['info']}>
              <span>{maskName(data.name)}</span>
              <span>
                {data.phone === '101' ? '010-1234-2' + data.phone : data.phone}
              </span>
            </div>
            <div className={styles['icon-button-container']}>
              {button1 && (
                <button
                  className={`${styles['icon-button']} ${styles['red-button']}`}
                  type={'button'}
                  onClick={(e) => onClickButton1 && onClickButton1(e, data)}
                  style={{
                    backgroundImage: `url('/icon/${button1}.png')`,
                  }}
                ></button>
              )}
              {button2 && (
                <button
                  className={`${styles['icon-button']} ${styles['green-button']}`}
                  type={'button'}
                  onClick={(e) => onClickButton2 && onClickButton2(e, data)}
                  style={{
                    backgroundImage: `url('/icon/${button2}.png')`,
                  }}
                ></button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default UserCard;
