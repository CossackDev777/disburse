/* eslint-disable no-unused-vars */
import { createContext, type PropsWithChildren, useContext, useState, useEffect } from 'react';

import { defaultSettings, ISettings, type TSettingsThemeMode } from '@/config/settings.config';

import { getData, setData } from '@/utils';
import { useAuth } from '@/auth/providers/JWTProvider.tsx';
import { IUpdateUser } from '@/services/interfaces/users.i.ts';
import axios from 'axios';
import { showToast } from '@/utils/toast_helper.ts';
import { changeThemeState } from '@/services/user_services.ts';
import { AUTH_LOCAL_STORAGE_KEY, AuthModel, setAuth } from '@/auth';

export interface ISettingsProps {
  settings: ISettings;
  storeSettings: (settings: Partial<ISettings>) => void;
  updateSettings: (settings: Partial<ISettings>) => void;
  getThemeMode: () => TSettingsThemeMode;
}

const SETTINGS_CONFIGS_KEY = 'settings-configs';

const getStoredSettings = (): Partial<ISettings> => {
  return (getData(SETTINGS_CONFIGS_KEY) as Partial<ISettings>) || {};
};

const initialProps: ISettingsProps = {
  settings: { ...defaultSettings, ...getStoredSettings() },
  updateSettings: (settings: Partial<ISettings>) => {},
  storeSettings: (settings: Partial<ISettings>) => {},
  getThemeMode: () => 'light'
};

const LayoutsContext = createContext<ISettingsProps>(initialProps);
const useSettings = () => useContext(LayoutsContext);

const SettingsProvider = ({ children }: PropsWithChildren) => {
  const [settings, setSettings] = useState(initialProps.settings);
  const { currentUser, auth } = useAuth();

  // Update settings when user's theme changes
  useEffect(() => {
    if (currentUser?.theme) {
      setSettings((prev) => ({
        ...prev,
        themeMode: currentUser?.theme as TSettingsThemeMode
      }));
    }
  }, [currentUser?.theme]);

  const updateSettings = (newSettings: Partial<ISettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));

    setAuth({
      user: {
        firstName: auth?.user?.firstName as string,
        lastName: auth?.user?.lastName as string,
        email: auth?.user?.email as string,
        id: auth?.user?.id as number,
        role: auth?.user?.role as string,
        theme: newSettings.themeMode as string
      },
      access_token: auth?.access_token as string
    });
  };

  const storeSettings = async (newSettings: Partial<ISettings>) => {
    if (currentUser) {
      // Save to database here (API call)
      const is_changed = await changeThemeState(currentUser.id, {
        theme: newSettings.themeMode as string
      });

      if (is_changed) {
        updateSettings(newSettings);
      }
    } else {
      // Save to local storage for non-logged-in users
      setData(SETTINGS_CONFIGS_KEY, { ...getStoredSettings(), ...newSettings });
      updateSettings(newSettings);
    }
  };

  const getThemeMode = (): TSettingsThemeMode => {
    // Prioritize user's theme from database
    if (currentUser?.theme) {
      return currentUser.theme as TSettingsThemeMode;
    }

    // Fallback to local/system settings
    const { themeMode } = settings;
    if (themeMode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return themeMode;
  };

  return (
    <LayoutsContext.Provider value={{ settings, updateSettings, storeSettings, getThemeMode }}>
      {children}
    </LayoutsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { SettingsProvider, useSettings };
