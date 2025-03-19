import axios from 'axios';
import { IStablecoin, IStablecoinRequest } from '@/types/wallet.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getStablecoins = async () => {
  try {
    const response = await axios.get(`${API_URL}/stablecoin/`);

    if (response.status == 200) {
      return (response.data as IStablecoin[]) || [];
    } else {
      return [] as IStablecoin[];
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return [] as IStablecoin[];
  }
};

export const addStablecoin = async (newStablecoin: IStablecoinRequest) => {
  try {
    const response = await axios.post(`${API_URL}/stablecoin/`, newStablecoin);

    const isAdded = response.status == 200;
    if (isAdded) {
      showToast('success', 'Stablecoin added successfully');
    } else {
      showToast('error', 'Failed to add stablecoin');
    }
    return isAdded;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return false;
  }
};

export const deleteStablecoin = async (stablecoin_id: Number) => {
  console.log("---------", stablecoin_id)
  try {
    const response = await axios.delete(`${API_URL}/stablecoin/${stablecoin_id}`);
    const isDeleted = response.status == 200;
    if(isDeleted) {
      showToast('success', 'Stablecoin delete succesfully');
    } else {
      showToast('error', 'Failed to delete');
    }
    return response.data;
  } catch (e) {
    if(axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({message, status});
    }
    return false;
  }
}
