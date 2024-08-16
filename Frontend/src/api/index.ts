import { AxiosRequestConfig } from 'axios';
import { APIResponse } from '../interface/commonResponse';
import axiosInstance from 'axiosConfig';
export function handleError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const getData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await axiosInstance.get<APIResponse<T>>(url, config);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const postData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await axiosInstance.post<APIResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const putData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await axiosInstance.put(url, data, config);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const deleteData = async <T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};

export const patchData = async <T>(
  url: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<APIResponse<T>> => {
  try {
    const response = await axiosInstance.patch<APIResponse<T>>(
      url,
      data,
      config,
    );
    return response.data;
  } catch (error) {
    throw new Error(handleError(error));
  }
};
