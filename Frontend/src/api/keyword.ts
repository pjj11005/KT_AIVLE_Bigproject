import { getData } from 'api';
import { APIResponse } from 'interface/commonResponse';

export const KEYWORD_URL = {
  KEYWORD: '/call/keyword/',
};

export interface Word {
  keyword: string;
  count: number;
}

export const getKeyWord = async (): Promise<Word[]> => {
  try {
    const response: APIResponse<Word[]> = await getData(KEYWORD_URL.KEYWORD);
    return response.result;
  } catch (error) {
    console.error('Error fetching keywords:', error);
    throw error;
  }
};
