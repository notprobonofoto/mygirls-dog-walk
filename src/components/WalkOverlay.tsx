import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dog, Person, EventType } from '@/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';

interface WalkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { dogId: string; personId: string; eventType: EventType }) => void;
  dogs: Dog[];
  people: Person[];
  getDogAge: (dogId: string) => string;
}

type EventCategory = 'walk' | 'home';

export function WalkOverlay({ isOpen, onClose, onSave, dogs, people, getDogAge }: WalkOverlayProps) {
  const { currentPersonId } = useCurrentUser();
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    if (!selectedDog || !selectedEvent || !currentPersonId) return;

    try {
      await onSave({
        dogId: selectedDog,
        personId: currentPersonId,
        eventType: selectedEvent,
      });

      setShowSuccess(true);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedDog(null);
        setSelectedEvent(null);
        onClose();
      }, 800);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleClose = () => {
    setSelectedDog(null);
    setSelectedEvent(null);
    onClose();
  };

  const getEventCategory = (eventType: EventType): EventCategory => {
    return eventType.endsWith('_home') ? 'home' : 'walk';
  };

  const handleEventSelect = (event: EventType) => {
    // If selecting an event from a different category, clear previous selection
    if (selectedEvent) {
      const currentCategory = getEventCategory(selectedEvent);
      const newCategory = getEventCategory(event);
      if (currentCategory !== newCategory) {
        setSelectedEvent(event);
        return;
      }
    }
    setSelectedEvent(event);
  };

  const walkEvents: { type: EventType; icon: string; label: string }[] = [
    { type: 'pee_walk', icon: '💧', label: 'Siku' },
    { type: 'poop_walk', icon: '💩', label: 'Kupa' },
    { type: 'both_walk', icon: '💧💩', label: 'Oba' },
  ];

  const homeEvents: { type: EventType; icon: string; label: string }[] = [
    { type: 'pee_home', icon: '🚨💧', label: 'Siku w domu' },
    { type: 'poop_home', icon: '🚨💩', label: 'Kupa w domu' },
  ];

  const currentPerson = people.find(p => p.id === currentPersonId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[2rem] z-50 max-h-[90vh] overflow-y-auto"
          >
            {showSuccess ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-12 flex flex-col items-center justify-center"
              >
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl mb-4"
                >
                  🐾
                </motion.span>
                <p className="text-xl font-semibold text-primary">Zapisano!</p>
              </motion.div>
            ) : (
              <div className="p-6 pb-10">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

                {/* Current user indicator */}
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{currentPerson?.initial}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {currentPerson?.name} dodaje wpis
                  </span>
                </div>

                {/* Dogs selection */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Który piesek?
                </h3>
                <div className="flex gap-3 mb-6">
                  {dogs.map((dog) => (
                    <motion.button
                      key={dog.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDog(dog.id)}
                      className={`flex-1 card-pet p-4 flex flex-col items-center transition-all ${
                        selectedDog === dog.id
                          ? 'ring-2 ring-primary ring-offset-2 ring-offset-card'
                          : ''
                      }`}
                    >
                      <motion.div
                        animate={selectedDog === dog.id ? { scale: 1.05 } : { scale: 1 }}
                        className="w-16 h-16 rounded-full overflow-hidden mb-2"
                        style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}
                      >
                        {dog.avatarUrl ? (
                          <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">🐕</div>
                        )}
                      </motion.div>
                      <p className="font-semibold text-sm">{dog.name}</p>
                      <p className="text-xs text-muted-foreground">{getDogAge(dog.id)}</p>
                    </motion.button>
                  ))}
                </div>

                {/* Walk events */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  Na spacerze
                </h3>
                <div className="flex gap-2 mb-6">
                  {walkEvents.map((event) => (
                    <motion.button
                      key={event.type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventSelect(event.type)}
                      className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                        selectedEvent === event.type
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-card hover:border-primary/30'
                      }`}
                    >
                      <motion.span
                        animate={selectedEvent === event.type ? { scale: 1.1 } : { scale: 1 }}
                        className="text-3xl"
                      >
                        {event.icon}
                      </motion.span>
                      <span className="text-xs font-medium">{event.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Home events */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-destructive">🚨</span> W domu (alert)
                </h3>
                <div className="flex gap-2 mb-8">
                  {homeEvents.map((event) => (
                    <motion.button
                      key={event.type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventSelect(event.type)}
                      className={`flex-1 p-4 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${
                        selectedEvent === event.type
                          ? 'border-destructive bg-destructive/10'
                          : 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
                      }`}
                    >
                      <motion.span
                        animate={selectedEvent === event.type ? { scale: 1.1 } : { scale: 1 }}
                        className="text-3xl"
                      >
                        {event.icon}
                      </motion.span>
                      <span className="text-xs font-medium text-destructive">{event.label}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Save button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!selectedDog || !selectedEvent}
                  className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
                    selectedDog && selectedEvent
                      ? 'btn-main'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  Zapisz
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
