import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Language, t as translate, TranslationKey } from '@/lib/i18n';
import { useCurrentUser } from '@/hooks/useCurrentUser';

export type ThemeName = 'standard' | 'dark' | 'blue' | 'neon' | 'pink';
export type VisualStyleName = 'standard' | 'slim' | 'fun' | 'glass' | 'bold';

interface AppContextType {
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;

  // Theme
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;

  // Visual style
  visualStyle: VisualStyleName;
  setVisualStyle: (style: VisualStyleName) => void;

  // Password
  isUnlocked: boolean;
  appPassword: string | null;
  checkPassword: (input: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  passwordLoading: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentPersonId } = useCurrentUser();
  const [language, setLanguageState] = useState<Language>('pl');
  const [theme, setThemeState] = useState<ThemeName>('standard');
  const [visualStyle, setVisualStyleState] = useState<VisualStyleName>('standard');
  const [appPassword, setAppPassword] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(true);

  // Load password from Cloud
  useEffect(() => {
    const loadPassword = async () => {
      const { data } = await supabase
        .from('app_config')
        .select('value')
        .eq('key', 'app_password')
        .single();
      if (data) setAppPassword(data.value);
      // Check if previously unlocked in this session
      const unlocked = localStorage.getItem('mygirls-unlocked');
      if (unlocked === 'true') setIsUnlocked(true);
      setPasswordLoading(false);
    };
    loadPassword();
  }, []);

  // Load user preferences from Cloud
  useEffect(() => {
    if (!currentPersonId) return;
    const loadPrefs = async () => {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('person_id', currentPersonId)
        .single();
      if (data) {
        setLanguageState(data.language as Language);
        setThemeState(data.theme as ThemeName);
        if ((data as any).visual_style) setVisualStyleState((data as any).visual_style as VisualStyleName);
      }
    };
    loadPrefs();
  }, [currentPersonId]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-standard', 'theme-dark', 'theme-blue', 'theme-neon', 'theme-pink');
    if (theme !== 'standard') {
      root.classList.add(`theme-${theme}`);
    }
  }, [theme]);

  const savePrefs = useCallback(async (newTheme?: ThemeName, newLang?: Language, newStyle?: VisualStyleName) => {
    if (!currentPersonId) return;
    const prefs = {
      person_id: currentPersonId,
      theme: newTheme || theme,
      language: newLang || language,
      visual_style: newStyle || visualStyle,
    } as any;
    await supabase.from('user_preferences').upsert(prefs, { onConflict: 'person_id' });
  }, [currentPersonId, theme, language, visualStyle]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    savePrefs(undefined, lang, undefined);
  }, [savePrefs]);

  const setTheme = useCallback((t: ThemeName) => {
    setThemeState(t);
    savePrefs(t, undefined, undefined);
  }, [savePrefs]);

  const setVisualStyle = useCallback((s: VisualStyleName) => {
    setVisualStyleState(s);
    savePrefs(undefined, undefined, s);
  }, [savePrefs]);

  const checkPassword = useCallback((input: string) => {
    if (input === appPassword) {
      setIsUnlocked(true);
      localStorage.setItem('mygirls-unlocked', 'true');
      return true;
    }
    return false;
  }, [appPassword]);

  const logout = useCallback(() => {
    setIsUnlocked(false);
    localStorage.removeItem('mygirls-unlocked');
  }, []);

  const changePassword = useCallback(async (newPassword: string) => {
    await supabase
      .from('app_config')
      .update({ value: newPassword })
      .eq('key', 'app_password');
    setAppPassword(newPassword);
  }, []);

  const tFn = useCallback((key: TranslationKey) => translate(key, language), [language]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t: tFn,
        theme,
        setTheme,
        visualStyle,
        setVisualStyle,
        isUnlocked,
        appPassword,
        checkPassword,
        logout,
        changePassword,
        passwordLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
