import { patchData } from 'api';

export interface CautionRequest {
  phone: string;
  set: boolean;
}

const CAUTION_URL = {
  PATCH_CAUTION: '/crm/spec/set',
};

export const patchCaution = async (data: CautionRequest) => {
  return await patchData<CautionRequest>(CAUTION_URL.PATCH_CAUTION, data);
};
