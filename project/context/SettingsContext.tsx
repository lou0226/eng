import { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface VoiceSettings {
  voice: 'male' | 'female';
  speed: 'slow' | 'normal' | 'fast';
  accent: 'american' | 'british';
}

interface Settings {
  darkMode: boolean;
  notifications: boolean;
  autoPlay: boolean;
  voice: VoiceSettings;
  language: string;
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const defaultSettings: Settings = {
  darkMode: false,
  notifications: true,
  autoPlay: false,
  voice: {
    voice: 'female',
    speed: 'normal',
    accent: 'american',
  },
  language: 'english',
};

export const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  isLoading: false,
  error: null,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          // Settings don't exist yet, create them
          await saveSettings(defaultSettings);
          setSettings(defaultSettings);
        } else {
          throw error;
        }
      } else {
        setSettings(data.settings);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: Settings) => {
    try {
      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user?.id,
          settings: newSettings,
        });

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      await saveSettings(updatedSettings);
      setSettings(updatedSettings);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update settings');
      throw error;
    }
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isLoading,
        error,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}