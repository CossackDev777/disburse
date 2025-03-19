import axios from 'axios';

import { getAuth } from '@/auth';
import { IUpdateTheme, IUpdateUser } from '@/services/interfaces/users.i.ts';
import { showToast } from '@/utils/toast_helper.ts';

const API_URL = import.meta.env.VITE_APP_API_URL;

const auth_token = getAuth()?.access_token;

export const getAllUsers = async (space_id: number): Promise<any> => {
  try {
    const response = await axios.get(`${API_URL}/user/all/${space_id}`, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    return response?.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const updateUser = async (user_id: number, updatedUser: IUpdateUser): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/user/update/${user_id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    const is_updated = response?.data?.success;

    if (is_updated) {
      showToast('success', 'User updated successfully');
    } else {
      showToast('error', 'User not updated. Please try again');
    }

    console.log('updated_data:', response.data.result);

    return response.data.result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};

export const getSpaceID = () => {
  let auth = getAuth();

  return 0;
};

export const changeThemeState = async (
  user_id: number,
  updatedUser: IUpdateTheme
): Promise<any> => {
  try {
    const response = await axios.put(`${API_URL}/auth/update-theme/${user_id}`, updatedUser, {
      headers: {
        Authorization: `Bearer ${auth_token}`
      }
    });

    const is_updated = response?.data?.status === 200;

    if (!is_updated) {
      showToast('error', 'User not updated. Please try again');
    }

    return is_updated;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      return Promise.reject({ message, status });
    }
    throw new Error(`Error ${error}`);
  }
};
