import { motion } from 'framer-motion';
import { Home, Clock, BarChart3, Dog, RotateCcw, Camera } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabDefs = [
  { id: 'home', icon: Home, labelKey: 'nav.home' as const },
  { id: 'history', icon: Clock, labelKey: 'nav.history' as const },
  { id: 'backdate', icon: RotateCcw, labelKey: 'nav.backdate' as const },
  { id: 'stats', icon: BarChart3, labelKey: 'nav.stats' as const },
  { id: 'gallery', icon: Camera, labelKey: 'nav.gallery' as const },
  { id: 'dogs', icon: Dog, labelKey: 'nav.dogs' as const },
];

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { t } = useApp();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-30 pb-safe"
    >
      <div className="flex justify-around items-center py-2 px-4">
        {tabDefs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center py-2 px-2 min-w-[48px] relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10 rounded-2xl"
                  transition={{ type: 'spring', duration: 0.3 }}
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-xs mt-1 relative z-10 transition-colors ${
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                }`}
              >
                {t(tab.labelKey)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.nav>
  );
}
