import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp, ThemeName } from '@/contexts/AppContext';
import { ArrowLeft, Eye, LogOut, Palette, Globe, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onClose: () => void;
}

const themes: { id: ThemeName; colors: string[] }[] = [
  { id: 'standard', colors: ['#FFB703', '#8ECAE6', '#FFF7F2'] },
  { id: 'dark', colors: ['#F59E0B', '#6366F1', '#1A1A2E'] },
  { id: 'blue', colors: ['#3B82F6', '#06B6D4', '#EFF6FF'] },
  { id: 'neon', colors: ['#00FF87', '#00D4FF', '#0A0A0A'] },
  { id: 'pink', colors: ['#EC4899', '#F472B6', '#FDF2F8'] },
];

export function SettingsScreen({ onClose }: SettingsScreenProps) {
  const { t, theme, setTheme, language, setLanguage, appPassword, changePassword, logout } = useApp();
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChangePassword = async () => {
    if (!newPassword.trim()) {
      toast.error(t('settings.password_empty'));
      return;
    }
    try {
      await changePassword(newPassword.trim());
      setNewPassword('');
      toast.success(t('settings.password_changed'));
    } catch {
      toast.error(t('common.save_error'));
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6 flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </motion.button>
        <h1 className="text-2xl font-heading font-bold text-foreground">{t('settings.title')}</h1>
      </header>

      <div className="px-6 space-y-6">
        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-pet p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Palette className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">{t('settings.theme')}</h2>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {themes.map((th) => (
              <motion.button
                key={th.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(th.id)}
                className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1.5 transition-all ${
                  theme === th.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/30'
                }`}
              >
                <div className="flex gap-0.5">
                  {th.colors.map((color, i) => (
                    <div
                      key={i}
                      className="w-4 h-4 rounded-full border border-border/50"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-[9px] font-medium leading-tight">
                  {t(`settings.theme_${th.id}` as any)}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-pet p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">{t('settings.language')}</h2>
          </div>
          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage('pl')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                language === 'pl'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              🇵🇱 Polski
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setLanguage('en')}
              className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold transition-all ${
                language === 'en'
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-card text-muted-foreground'
              }`}
            >
              🇬🇧 English
            </motion.button>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-pet p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-heading font-semibold">{t('settings.password')}</h2>
          </div>

          {/* Current password */}
          <div className="bg-muted rounded-xl p-3 mb-4">
            <p className="text-xs text-muted-foreground mb-1">{t('settings.current_password')}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm font-mono font-semibold text-foreground flex-1">
                {showPassword ? appPassword : '••••••••'}
              </p>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 rounded-lg hover:bg-card transition-colors"
              >
                <Eye className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Change password */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={t('settings.new_password')}
              className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleChangePassword}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
            >
              {t('settings.change_password')}
            </motion.button>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="w-full card-pet p-5 flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="font-semibold text-destructive">{t('settings.logout')}</p>
              <p className="text-xs text-muted-foreground">{t('settings.logout_desc')}</p>
            </div>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
