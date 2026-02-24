import { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import logo from '@/assets/logo.png';
import { Lock } from 'lucide-react';

export function PasswordGate() {
  const { checkPassword, t } = useApp();
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(input)) {
      setError(false);
    } else {
      setError(true);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        <motion.div
          animate={{ y: [-10, 10, -10], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-10 text-6xl opacity-10"
        >
          🐾
        </motion.div>
        <motion.div
          animate={{ y: [10, -15, 10], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-40 right-8 text-5xl opacity-10"
        >
          🐾
        </motion.div>
      </div>

      {/* Logo */}
      <motion.img
        src={logo}
        alt="MyGirls"
        className="w-48 h-auto mb-8 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ filter: 'drop-shadow(0 4px 20px rgba(255,183,3,0.25))' }}
      />

      {/* Lock icon */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-6 relative z-10"
      >
        <Lock className="w-8 h-8 text-primary" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl font-heading font-bold text-foreground mb-6 relative z-10"
      >
        {t('password.title')}
      </motion.h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 relative z-10"
      >
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          placeholder={t('password.placeholder')}
          className={`w-full px-5 py-4 rounded-2xl border-2 bg-card text-foreground text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            error ? 'border-destructive' : 'border-border'
          }`}
          autoFocus
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-destructive text-sm text-center font-medium"
          >
            {t('password.error')}
          </motion.p>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full py-4 rounded-2xl btn-main text-lg font-semibold"
        >
          {t('password.submit')}
        </motion.button>
      </motion.form>
    </div>
  );
}
