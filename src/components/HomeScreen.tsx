import { motion } from 'framer-motion';
import { useState } from 'react';
import { WalkOverlay } from './WalkOverlay';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useApp } from '@/contexts/AppContext';
import { useVisualStyle } from '@/hooks/useVisualStyle';
import { EventType } from '@/types';
import { getWalkCountLabel } from '@/lib/i18n';
import logo from '@/assets/logo.png';
import { Settings, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';

interface HomeScreenProps {
  onOpenSettings: () => void;
}

export function HomeScreen({ onOpenSettings }: HomeScreenProps) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { dogs, people, addWalk, walks, getDogAge, isHomeEvent } = useSharedData();
  const { currentPersonId, clearPerson } = useCurrentUser();
  const { t, language, setLanguage } = useApp();
  const vs = useVisualStyle();

  const currentPerson = people.find(p => p.id === currentPersonId);

  const handleSaveWalk = async (data: { dogId: string; personId: string; eventType: EventType }) => {
    await addWalk(data);
  };

  const todayWalks = walks.filter((w) => {
    const walkDate = new Date(w.timestamp).toDateString();
    const today = new Date().toDateString();
    return walkDate === today;
  });

  const todayWalkEvents = todayWalks.filter(w => !isHomeEvent(w.eventType));
  const todayHomeEvents = todayWalks.filter(w => isHomeEvent(w.eventType));

  const toggleLanguage = () => {
    setLanguage(language === 'pl' ? 'en' : 'pl');
  };

  // Last walk per dog (for Bold variant)
  const getLastWalk = (dogId: string) => {
    const dogWalks = walks
      .filter(w => w.dogId === dogId && !isHomeEvent(w.eventType))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return dogWalks[0] || null;
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Decorations */}
      {vs.showPawAnimations && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            { top: '5%', left: '8%', size: 'text-7xl', dur: 8, delay: 0, y: [-10, 12, -10], rot: [0, 6, 0] },
            { top: '12%', right: '6%', size: 'text-4xl', dur: 10, delay: 1, y: [10, -15, 10], rot: [0, -5, 0] },
            { top: '25%', left: '75%', size: 'text-3xl', dur: 7, delay: 0.3, y: [-8, 10, -8], rot: [0, 8, 0] },
            { top: '18%', left: '40%', size: 'text-5xl', dur: 11, delay: 2, y: [5, -12, 5], rot: [0, -3, 0] },
            { top: '45%', right: '12%', size: 'text-8xl', dur: 13, delay: 0.8, y: [-5, 15, -5], rot: [0, -4, 0] },
            { top: '60%', left: '60%', size: 'text-5xl', dur: 10.5, delay: 1.2, y: [-12, 8, -12], rot: [0, -6, 0] },
            { top: '75%', left: '10%', size: 'text-6xl', dur: 12, delay: 0.5, y: [-7, 11, -7], rot: [0, -8, 0] },
            { top: '85%', left: '70%', size: 'text-6xl', dur: 10, delay: 0.2, y: [4, -11, 4], rot: [0, 9, 0] },
          ].map((paw, i) => (
            <motion.div
              key={i}
              animate={{ y: paw.y, rotate: paw.rot }}
              transition={{ duration: paw.dur, repeat: Infinity, ease: 'easeInOut', delay: paw.delay }}
              className={`absolute ${paw.size} opacity-[0.07]`}
              style={{ top: paw.top, left: paw.left, right: (paw as any).right }}
            >
              🐾
            </motion.div>
          ))}
          
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-center pt-4 px-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleLanguage}
          className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center"
        >
          <Globe className="w-4 h-4 text-muted-foreground" />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center"
        >
          <Settings className="w-4 h-4 text-muted-foreground" />
        </motion.button>
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 pt-2 pb-6 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="flex justify-center mb-3"
        >
          <motion.img
            src={logo}
            alt="MyGirls"
            className="w-[40%] max-w-[200px] min-w-[160px] h-auto"
            style={{
              filter: 'drop-shadow(0 8px 30px rgba(255, 183, 3, 0.35))',
            }}
            animate={{
              filter: [
                'drop-shadow(0 8px 30px rgba(255, 183, 3, 0.35))',
                'drop-shadow(0 8px 40px rgba(255, 183, 3, 0.45))',
                'drop-shadow(0 8px 30px rgba(255, 183, 3, 0.35))',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground text-sm"
        >
          {t('home.subtitle')}
        </motion.p>

        {/* Current user badge */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={clearPerson}
          className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-card rounded-full border border-border text-sm"
        >
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">{currentPerson?.initial}</span>
          </div>
          <span className="text-muted-foreground">{currentPerson?.name}</span>
          <span className="text-xs text-muted-foreground/60">• {t('home.change')}</span>
        </motion.button>
      </header>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 px-6 mb-8"
      >
        <div className={vs.card + ' p-4'}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">{t('home.today')}</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {todayWalkEvents.length} {getWalkCountLabel(todayWalkEvents.length, language)}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xl">💧</span>
                <span className="font-medium">
                  {todayWalks.filter((w) => w.eventType.includes('pee') || w.eventType === 'both_walk').length}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl">💩</span>
                <span className="font-medium">
                  {todayWalks.filter((w) => w.eventType.includes('poop') || w.eventType === 'both_walk').length}
                </span>
              </div>
            </div>
          </div>
          
          {todayHomeEvents.length > 0 && (
            <div className="pt-3 border-t border-destructive/20">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <span>🚨</span>
                <span className="font-medium">
                  {todayHomeEvents.length} {todayHomeEvents.length === 1 ? t('home.home_events_one') : t('home.home_events_many')}
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Bold variant: Last walk widget */}
      {vs.lastWalkWidget && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="relative z-10 px-6 mb-6"
        >
          <div className={vs.card + ' p-4'}>
            <p className="text-sm font-semibold text-muted-foreground mb-3">{t('walk.last_walk')}</p>
            <div className="flex gap-3">
              {dogs.map(dog => {
                const lastWalk = getLastWalk(dog.id);
                return (
                  <div key={dog.id} className="flex-1 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden" style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}>
                      {dog.avatarUrl ? (
                        <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-sm">🐕</div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{dog.name}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {lastWalk 
                          ? formatDistanceToNow(new Date(lastWalk.timestamp), { locale: language === 'pl' ? pl : enUS, addSuffix: false }) + ' ' + t('walk.ago')
                          : t('walk.no_walks_yet')}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Action Button */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOverlayOpen(true)}
          className={`relative ${vs.mainButton}`}
        >
          <div className={`absolute inset-0 ${vs.mainButtonInner} animate-pulse-ring`} />
          
          <motion.span
            animate={vs.styleName === 'slim' ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={vs.styleName === 'slim' ? 'text-4xl' : 'text-7xl'}
          >
            🐾
          </motion.span>
          <span className={vs.styleName === 'slim' ? 'text-xl font-semibold' : 'text-2xl font-bold'}>{t('home.main_button')}</span>
          {vs.styleName !== 'slim' && (
            <span className="text-primary-foreground/80 text-sm">{t('home.tap_to_save')}</span>
          )}
        </motion.button>
      </div>

      {/* Dogs Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 px-6 pb-24"
      >
        <div className="flex justify-center gap-4">
          {dogs.map((dog, index) => (
            <motion.div
              key={dog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={vs.card + ' p-3 flex flex-col items-center'}
            >
              <div
                className="w-16 h-16 rounded-full overflow-hidden mb-2"
                style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}
              >
                {dog.avatarUrl ? (
                  <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🐕</div>
                )}
              </div>
              <p className="font-semibold text-sm">{dog.name}</p>
              <p className="text-xs text-muted-foreground">{getDogAge(dog.id)}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Walk Overlay */}
      <WalkOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        onSave={handleSaveWalk}
        dogs={dogs}
        people={people}
        getDogAge={getDogAge}
      />
    </div>
  );
}
