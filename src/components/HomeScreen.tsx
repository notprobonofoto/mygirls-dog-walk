import { motion } from 'framer-motion';
import { useState } from 'react';
import { WalkOverlay } from './WalkOverlay';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { EventType } from '@/types';
import logo from '@/assets/logo.png';

export function HomeScreen() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { dogs, people, addWalk, walks, getDogAge, isHomeEvent } = useSharedData();
  const { currentPersonId, clearPerson } = useCurrentUser();

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
        <motion.div
          animate={{ y: [-5, 15, -5], x: [-5, 5, -5] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-40 left-20 text-7xl opacity-10"
        >
          🐾
        </motion.div>
        <motion.div
          animate={{ y: [5, -10, 5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute top-60 left-1/2 text-4xl opacity-10"
        >
          🐾
        </motion.div>
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Header with Logo - Large and Prominent */}
      <header className="relative z-10 pt-8 pb-6 px-6 text-center">
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
          Śledź spacery swoich piesków 🐕
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
          <span className="text-xs text-muted-foreground/60">• zmień</span>
        </motion.button>
      </header>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 px-6 mb-8"
      >
        <div className="card-pet p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-muted-foreground">Dzisiaj</p>
              <p className="text-2xl font-heading font-bold text-foreground">
                {todayWalkEvents.length} {todayWalkEvents.length === 1 ? 'spacer' : todayWalkEvents.length < 5 ? 'spacery' : 'spacerów'}
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
          
          {/* Home events warning */}
          {todayHomeEvents.length > 0 && (
            <div className="pt-3 border-t border-destructive/20">
              <div className="flex items-center gap-2 text-destructive text-sm">
                <span>🚨</span>
                <span className="font-medium">
                  {todayHomeEvents.length} {todayHomeEvents.length === 1 ? 'zdarzenie' : 'zdarzenia'} w domu
                </span>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Action Button */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-8">
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: 'spring' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOverlayOpen(true)}
          className="relative w-full max-w-sm aspect-square rounded-[3rem] btn-main flex flex-col items-center justify-center gap-4 animate-breathe"
        >
          <div className="absolute inset-0 rounded-[3rem] animate-pulse-ring" />
          
          <motion.span
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-7xl"
          >
            🐾
          </motion.span>
          <span className="text-2xl font-bold">SPACER ODBYTY</span>
          <span className="text-primary-foreground/80 text-sm">Tapnij aby zapisać</span>
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
              className="card-pet p-3 flex flex-col items-center"
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
