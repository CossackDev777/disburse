import axios from 'axios';
import {
  IChain,
  IChainRequest,
  IPayout,
  IPayoutRequest,
  IWalletAddress,
  IWalletRequest,
  IWalletTransaction
} from '@/types/wallet.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

export const getWalletAddress = async (userID: number) => {
  try {
    const response = await axios.get(`${API_URL}/address/balances/${userID}`);
    if (response.status == 200) {
      return (response.data as IWalletAddress[]) || [];
    } else {
      return [];
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return [];
  }
};

export const getTransactions = async (address: number | null) => {
  if (address != null) {
    try {
      const response = await axios.post(`${API_URL}/address/portfolio/transactions/`, { address });
      if (response.status == 200) {
        return (response.data as IWalletTransaction[]) || [];
      } else {
        return [] as IWalletTransaction[];
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;
        return Promise.reject({ message, status });
      }
      return [] as IWalletTransaction[];
    }
  }
};

export const getPayouts = async () => {
  try {
    const response = await axios.get(`${API_URL}/payout/`);
    if (response.status == 200) {
      return (response.data as IPayout[]) || [];
    } else {
      return [] as IPayout[];
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return [] as IPayout[];
  }
};

export const addWallet = async (newWallet: IWalletRequest) => {
  try {
    const response = await axios.post(`${API_URL}/address/`, newWallet);

    const isAdded = response.status == 200;

    const isAlreadyExisting = response.status == 403;
    if (isAdded) {
      showToast('success', 'Wallet added successfully');
    } else if (isAlreadyExisting) {
      showToast('error', 'Failed to new account : Address already existing');
    } else {
      showToast('error', 'Failed to new account');
    }
    return isAdded;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      if (e.message.includes('403')) {
        showToast('error', 'Failed to new account : Address already existing');
      }
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return false;
  }
};

export const addPayout = async (newPayout: IPayoutRequest) => {
  try {
    const response = await axios.post(`${API_URL}/payout/`, newPayout);

    const isAdded = response.status == 200;
    if (isAdded) {
      showToast('success', 'Payout added successfully');
    } else {
      showToast('error', 'Failed to add payout');
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

export const archivePayout = async (payout_id: number) => {
  try {
    const response = await axios.put(`${API_URL}/payout/archive/`, { id: payout_id });

    const isDeleted = response.status == 200;
    if (isDeleted) {
      showToast('success', 'Payout archived successfully');
    } else {
      showToast('error', 'Failed to archive payout');
    }
    return isDeleted;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return false;
  }
};

export const getChains = async () => {
  try {
    const response = await axios.get('api/chain/all/active');
    if (response.status == 200) {
      return (response.data as IChain[]) || [];
    } else {
      return [] as IChain[];
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return [] as IChain[];
  }
};

export const getAllChains = async () => {
  try {
    const response = await axios.get(`${API_URL}/chain/all`);
    if (response.status == 200) {
      return (response.data as IChain[]) || [];
    } else {
      return [] as IChain[];
    }
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return [] as IChain[];
  }
};

export const addChain = async (newChain: IChainRequest) => {
  try {
    const response = await axios.post(`${API_URL}/chain/add`, newChain);

    const isAdded = response.status == 200;
    if (isAdded) {
      showToast('success', 'Chain added successfully');
    } else {
      showToast('error', 'Failed to add chain');
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

export const archiveChain = async (chain_id: number) => {
  try {
    const response = await axios.put(`${API_URL}/chain/archive/${chain_id}`);

    const isDeleted = response.status == 200;
    if (isDeleted) {
      showToast('success', 'Chain archived successfully');
    } else {
      showToast('error', 'Failed to archive chain');
    }
    return isDeleted;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      const message = e.response?.data?.message;
      const status = e.response?.status;
      return Promise.reject({ message, status });
    }
    return false;
  }
};
