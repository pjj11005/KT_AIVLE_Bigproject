import { getData } from '../index';
import { APIResponse } from '../../interface/commonResponse';

export const CUSTOMER_URL = {
  CUSTOMER_LIST: '/crm/list',
  SPECIAL_REQUEST_LIST: '/crm/spec/reqlist',
  SPECIAL_LIST: '/crm/spec',
};

export interface Customer {
  id: string;
  name: string;
  phone: string;
  special_req: boolean;
  special_reg: boolean;
  counts: number;
  last_call: string;
}

export const getSpecialCustomer = async () => {
  const specialCustomer: APIResponse<Customer[]> = await getData(
    CUSTOMER_URL.SPECIAL_LIST,
  );
  return specialCustomer.result;
};

export const getSpecialReqCustomer = async () => {
  const specialReqCustomer: APIResponse<Customer[]> = await getData(
    CUSTOMER_URL.SPECIAL_REQUEST_LIST,
  );
  return specialReqCustomer.result;
};
