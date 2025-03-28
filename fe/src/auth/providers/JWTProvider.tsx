/* eslint-disable */
import axios, { AxiosResponse } from 'axios';
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction, useContext,
  useEffect,
  useState
} from 'react';

import * as authHelper from '../_helpers';
import { type AuthModel, type UserModel } from '@/auth';

//const API_URL = import.meta.env.VITE_APP_API_URL;
const API_URL = 'http://localhost:8080/api';
export const LOGIN_URL = `${API_URL}/auth/login`;
export const REGISTER_URL = `${API_URL}/auth/register`;
export const REQUEST_EMAIL_URL = `${API_URL}/auth/request-verification-email`;
export const VERIFY_EMAIL_URL = `${API_URL}/auth/verify-email`;
export const FORGOT_PASSWORD_URL = `${API_URL}/auth/forgot-password`;
export const VERIFY_RESET_TOKEN_URL = `${API_URL}/auth/verify-reset-token`;
export const RESET_PASSWORD_URL = `${API_URL}/auth/reset-password`;

interface AuthContextProps {
  isLoading: boolean;
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle?: () => Promise<void>;
  loginWithFacebook?: () => Promise<void>;
  loginWithGithub?: () => Promise<void>;
  register: (
    email: string,
    password: string,
    role: string,
    acceptBlasts: boolean,
    captchaToken: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  requestEmailLink: (email: string) => Promise<void>;
  verifyEmailLink: (token: string) => Promise<void>;
  requestPasswordResetLink: (email: string) => Promise<void>;
  verifyPasswordResetToken: (token: string) => Promise<void>;
  changePassword: (email: string, password: string) => Promise<void>;
  // getUser: () => Promise<AxiosResponse<any>>;
  logout: () => void;
  // verify: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | null>(null);

const AuthProvider = ({ children }: PropsWithChildren) => {
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth);
    if (auth) {
      authHelper.setAuth(auth);
    } else {
      authHelper.removeAuth();
    }

    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post<AuthModel>(LOGIN_URL, {
        email,
        password
      });
      saveAuth(response.data);

      const user_data: UserModel = response.data?.user;
      setCurrentUser(user_data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const register = async (
    email: string,
    password: string,
    role: string,
    acceptBlasts: boolean,
    captchaToken: string,
    firstName: string,
    lastName: string
  ) => {
    try {
      await axios
        .post(REGISTER_URL, {
          email,
          password,
          role,
          acceptBlasts,
          captchaToken,
          firstName,
          lastName
        })
        .then((response) => {
          const userInfo: UserModel = {
            id: 0,
            firstName: '',
            lastName: '',
            email: email,
            role: role,
            theme: 'light'
          };

          // saveAuth(auth);
          // const { data: user } = await getUser();
          setCurrentUser(userInfo);
        });
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'An error occurred';
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(error?.response?.data?.message);
    }
  };

  const requestEmailLink = async (email: string) => {
    try {
      await axios.post(REQUEST_EMAIL_URL, {
        email
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const verifyEmailLink = async (token: string) => {
    try {
      await axios.get(VERIFY_EMAIL_URL + '/' + token);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const requestPasswordResetLink = async (email: string) => {
    try {
      await axios.post(FORGOT_PASSWORD_URL, {
        email
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const verifyPasswordResetToken = async (token: string) => {
    try {
      await axios.get(VERIFY_RESET_TOKEN_URL + '/' + token).then((response) => {
        const user_data: UserModel = {
          id: response.data?.data?.id,
          firstName: response.data?.data?.firstName,
          lastName: response.data?.data?.lastName,
          email: response.data?.data?.email,
          role: response.data?.data?.role,
          theme: response.data?.data?.theme
        };
        setCurrentUser(user_data);
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  const changePassword = async (email: string, password: string) => {
    try {
      await axios.post(RESET_PASSWORD_URL, {
        email,
        password
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        const status = error.response?.status;

        // Return a structured error
        return Promise.reject({ message, status });
      }

      saveAuth(undefined);
      throw new Error(`Error ${error}`);
    }
  };

  // const getUser = async () => {
  //   try {
  //     return await axios.get<UserModel>(GET_USER_URL);
  //   } catch (error) {
  //     if (axios.isAxiosError(error)) {
  //       const message = error.response?.data?.message;
  //       const status = error.response?.status;
  //
  //       // Return a structured error
  //       return Promise.reject({ message, status });
  //     }
  //
  //     saveAuth(undefined);
  //     throw new Error(`Error ${error}`);
  //   }
  // };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading: loading,
        auth,
        saveAuth,
        currentUser,
        setCurrentUser,
        login,
        register,
        requestEmailLink,
        verifyEmailLink,
        requestPasswordResetLink,
        verifyPasswordResetToken,
        changePassword,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export { AuthContext, AuthProvider };
