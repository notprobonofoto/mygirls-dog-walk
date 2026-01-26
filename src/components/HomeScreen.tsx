import { motion } from 'framer-motion';
import { useState } from 'react';
import { WalkOverlay } from './WalkOverlay';
import { useAppData } from '@/hooks/useAppData';
import { ActionType } from '@/types';
import logo from '@/assets/logo.png';

export function HomeScreen() {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { dogs, people, addWalk, walks } = useAppData();

  const handleSaveWalk = (data: { dogId: string; personId: string; actions: ActionType[] }) => {
    addWalk(data);
  };

  const todayWalks = walks.filter((w) => {
    const walkDate = new Date(w.timestamp).toDateString();
    const today = new Date().toDateString();
    return walkDate === today;
  });

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating paw prints */}
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
        
        {/* Soft gradient blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Header with Logo */}
      <header className="relative z-10 pt-12 pb-6 px-6 text-center">
        <motion.img
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          src={logo}
          alt="MyGirls"
          className="h-16 mx-auto mb-2"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm"
        >
          Śledź spacery swoich piesków 🐕
        </motion.p>
      </header>

      {/* Today's Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="relative z-10 px-6 mb-8"
      >
        <div className="card-pet p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Dzisiaj</p>
            <p className="text-2xl font-heading font-bold text-foreground">
              {todayWalks.length} {todayWalks.length === 1 ? 'spacer' : todayWalks.length < 5 ? 'spacery' : 'spacerów'}
            </p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <span className="text-xl">💧</span>
              <span className="font-medium">
                {todayWalks.filter((w) => w.actions.includes('pee')).length}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl">💩</span>
              <span className="font-medium">
                {todayWalks.filter((w) => w.actions.includes('poop')).length}
              </span>
            </div>
          </div>
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
          {/* Pulse ring animation */}
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
              <p className="text-xs text-muted-foreground">{dog.age}</p>
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
      />
    </div>
  );
}
