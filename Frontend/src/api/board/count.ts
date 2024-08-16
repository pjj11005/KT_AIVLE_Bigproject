import { getData } from 'api';
import { APIResponse } from 'interface/commonResponse';

export const COUNT_URL = {
  TOTAL_COUNT: '/call/cnt/',
  DAILY_VOS: '/call/dashboard/daily',
  WEEKLY_VOS: '/call/dashboard/weekly',
  YEAR_VOS: '/call/dashboard/monthly',
};

export interface Count {
  user_today_counts: number;
  all_users_today_counts: number;
}

export interface DailyCountParam {
  year: number;
  month: number;
}

export interface YearCountResponse {
  month: string;
  count: number;
}

export interface WeeklyCountResponse {
  day: string;
  count: number;
  special_count: number;
  regular_count: number;
}

export interface DailyCount {
  day: string;
  count: number;
}
export const getCount = async () => {
  const counts: APIResponse<Count> = await getData(COUNT_URL.TOTAL_COUNT);
  return counts.result;
};

export const getTodayCount = async () => {
  const result: APIResponse<{ today_voc: number }> = await getData<{
    today_voc: number;
  }>('/call/cnt');
  return result.result;
};

export const getUserTodayCount = async () => {
  const result: APIResponse<{ today_voc_user: number }> = await getData<{
    today_voc_user: number;
  }>('/call/cnt/user');
  return result.result;
};

export const getDailyCount = async (data: DailyCountParam) => {
  const result: APIResponse<DailyCount[]> = await getData(
    COUNT_URL.DAILY_VOS + `?year=${data.year}&month=${data.month}`,
  );
  return result.result;
};

export const getWeeklyCount = async () => {
  const result: APIResponse<WeeklyCountResponse[]> = await getData(
    COUNT_URL.WEEKLY_VOS,
  );
  return result.result;
};

export const getYearCount = async () => {
  const result: APIResponse<YearCountResponse[]> = await getData(
    COUNT_URL.YEAR_VOS,
  );
  return result.result;
};
