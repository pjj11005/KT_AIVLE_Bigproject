import { deleteData, getData, postData, putData } from './index';
import { APIResponse } from '../interface/commonResponse';

export interface Notice {
  title: string;
  content: string;
  category: string;
}

export interface CreateNotice extends Notice {
  author: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  author: string;
  views: number;
  category: string;
}

export interface ReadNotice extends NoticeItem {
  user: string;
  content: string;
  category: string;
}

const NOTICE_URL = {
  GET_LIST: '/notice/',
  CREATE_NOTICE: '/notice/create/',
  READ_NOTICE: '/notice/read/',
  UPDATE_NOTICE: '/notice/update/',
  DELETE_NOTICE: '/notice/delete/',
};

export const getNotice = async () => {
  const notice: APIResponse<NoticeItem[]> = await getData(NOTICE_URL.GET_LIST);
  return notice.result;
};

export const updateNotice = async (noticeId: string, data: Notice) => {
  return await putData(NOTICE_URL.UPDATE_NOTICE + noticeId + '/', data);
};

export const createNotice = async (data: Notice) => {
  return await postData(NOTICE_URL.CREATE_NOTICE, data);
};

export const readNotice = async (noticeId: string) => {
  const result: APIResponse<ReadNotice> = await getData(
    NOTICE_URL.READ_NOTICE + noticeId,
  );
  return result.result;
};

export const deleteNotice = async (noticeId: string) => {
  const result: APIResponse<{ success: boolean }> = await deleteData(
    NOTICE_URL.DELETE_NOTICE + noticeId,
  );
  return result.result;
};
