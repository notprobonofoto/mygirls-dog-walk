import { motion } from 'framer-motion';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { isGuestPerson } from '@/lib/weekUtils';
import logo from '@/assets/logo.png';

export function PersonSelector() {
  const { people, loading } = useSharedData();
  const { selectPerson } = useCurrentUser();
  
  // Filter out guest from initial selection - guest is only for walk logging
  const selectablePeople = people.filter(p => !isGuestPerson(p.id));

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          🐾
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      {/* Animated background */}
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
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <img
          src={logo}
          alt="MyGirls"
          className="w-48 h-auto drop-shadow-[0_4px_20px_rgba(255,183,3,0.25)]"
        />
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-heading font-bold text-foreground mb-2 text-center"
      >
        Kto używa aplikacji?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-muted-foreground text-sm mb-8 text-center"
      >
        Wybierz swoje imię
      </motion.p>

      {/* Person cards */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {selectablePeople.map((person, index) => (
          <motion.button
            key={person.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => selectPerson(person.id)}
            className="card-pet p-5 flex items-center gap-4 hover:border-primary/50 transition-colors"
          >
            <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{person.initial}</span>
            </div>
            <span className="text-xl font-semibold">{person.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
