import { patchData } from 'api';

export interface CautionDeleteRequest {
  phone: string;
}

const CAUTION_URL = {
  DELETE: '/crm/spec/del',
};

export const deleteCaution = async (data: CautionDeleteRequest) => {
  return await patchData<CautionDeleteRequest>(CAUTION_URL.DELETE, data);
};
