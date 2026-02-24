import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dog, Person, EventType } from '@/types';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useApp } from '@/contexts/AppContext';
import { useVisualStyle } from '@/hooks/useVisualStyle';
import { isGuestPerson } from '@/lib/weekUtils';

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
  const { t } = useApp();
  const vs = useVisualStyle();
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [walkNote, setWalkNote] = useState('');

  // Timer for Fun variant
  const [timerSeconds, setTimerSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isOpen && vs.walkTimer) {
      setTimerSeconds(0);
      timerRef.current = setInterval(() => setTimerSeconds(s => s + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, vs.walkTimer]);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const familyMembers = people.filter(p => !isGuestPerson(p.id));
  const guestPerson = people.find(p => isGuestPerson(p.id));

  const handleSave = async () => {
    const personToUse = selectedPersonId || currentPersonId;
    if (!selectedDog || !selectedEvent || !personToUse) return;

    try {
      await onSave({
        dogId: selectedDog,
        personId: personToUse,
        eventType: selectedEvent,
      });

      setShowSuccess(true);
      if (navigator.vibrate) navigator.vibrate(50);
      if (timerRef.current) clearInterval(timerRef.current);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedDog(null);
        setSelectedEvent(null);
        setSelectedPersonId(null);
        setWalkNote('');
        setTimerSeconds(0);
        onClose();
      }, 800);
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleClose = () => {
    setSelectedDog(null);
    setSelectedEvent(null);
    setSelectedPersonId(null);
    setWalkNote('');
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerSeconds(0);
    onClose();
  };

  const getEventCategory = (eventType: EventType): EventCategory => {
    return eventType.endsWith('_home') ? 'home' : 'walk';
  };

  const handleEventSelect = (event: EventType) => {
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

  const walkEvents: { type: EventType; icon: string; labelKey: string }[] = [
    { type: 'pee_walk', icon: '💧', labelKey: 'walk.pee' },
    { type: 'poop_walk', icon: '💩', labelKey: 'walk.poop' },
    { type: 'both_walk', icon: '💧💩', labelKey: 'walk.both' },
    { type: 'nothing_walk', icon: '🚶', labelKey: 'walk.nothing' },
  ];

  const homeEvents: { type: EventType; icon: string; labelKey: string }[] = [
    { type: 'pee_home', icon: '🚨💧', labelKey: 'walk.pee_home' },
    { type: 'poop_home', icon: '🚨💩', labelKey: 'walk.poop_home' },
  ];

  const canSave = selectedDog && selectedEvent && (selectedPersonId || currentPersonId);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-0 left-0 right-0 bg-card ${vs.styleName === 'glass' ? 'bg-card/80 backdrop-blur-2xl' : ''} rounded-t-[2rem] z-50 max-h-[90vh] overflow-y-auto`}
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
                <p className="text-xl font-semibold text-primary">{t('walk.saved')}</p>
                {vs.walkTimer && timerSeconds > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{t('walk.timer')}: {formatTimer(timerSeconds)}</p>
                )}
              </motion.div>
            ) : (
              <div className="p-6 pb-10">
                <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

                {/* Timer for Fun variant */}
                {vs.walkTimer && (
                  <div className="text-center mb-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                      <span className="text-lg">⏱️</span>
                      <span className="font-mono text-xl font-bold text-primary">{formatTimer(timerSeconds)}</span>
                    </div>
                  </div>
                )}

                {/* Person Selection */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t('walk.who')}
                </h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {familyMembers.map((person) => {
                    const isSelected = selectedPersonId ? selectedPersonId === person.id : currentPersonId === person.id;
                    return (
                      <motion.button
                        key={person.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedPersonId(person.id)}
                        className={`flex items-center gap-2 ${vs.chip} ${
                          isSelected ? vs.chipSelected : 'border-border bg-card hover:border-primary/30'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{person.initial}</span>
                        </div>
                        <span className="text-sm font-medium">{person.name}</span>
                      </motion.button>
                    );
                  })}
                  
                  {guestPerson && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPersonId('guest')}
                      className={`flex items-center gap-2 ${vs.chip} ${
                        selectedPersonId === 'guest'
                          ? 'border-muted-foreground bg-muted'
                          : 'border-border bg-card hover:border-muted-foreground/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">👤</span>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">{t('walk.guest')}</span>
                    </motion.button>
                  )}
                </div>

                {/* Dogs selection */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                  {t('walk.which_dog')}
                </h3>
                <div className="flex gap-3 mb-6">
                  {dogs.map((dog) => (
                    <motion.button
                      key={dog.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDog(dog.id)}
                      className={`flex-1 ${vs.card} p-4 flex flex-col items-center transition-all ${
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
                  {t('walk.on_walk')}
                </h3>
                <div className="grid grid-cols-4 gap-2 mb-6">
                  {walkEvents.map((event) => (
                    <motion.button
                      key={event.type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventSelect(event.type)}
                      className={`${vs.eventButton} ${
                        selectedEvent === event.type
                          ? vs.eventButtonSelected
                          : 'border-border bg-card hover:border-primary/30'
                      }`}
                    >
                      <motion.span
                        animate={selectedEvent === event.type ? { scale: 1.1 } : { scale: 1 }}
                        className="text-2xl"
                      >
                        {event.icon}
                      </motion.span>
                      <span className="text-[10px] font-medium leading-tight">{t(event.labelKey as any)}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Home events */}
                <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide flex items-center gap-2">
                  <span className="text-destructive">🚨</span> {t('walk.at_home')}
                </h3>
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {homeEvents.map((event) => (
                    <motion.button
                      key={event.type}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleEventSelect(event.type)}
                      className={`${vs.eventButton} ${
                        selectedEvent === event.type
                          ? 'border-destructive bg-destructive/10'
                          : 'border-destructive/30 bg-destructive/5 hover:border-destructive/50'
                      }`}
                    >
                      <motion.span
                        animate={selectedEvent === event.type ? { scale: 1.1 } : { scale: 1 }}
                        className="text-2xl"
                      >
                        {event.icon}
                      </motion.span>
                      <span className="text-[10px] font-medium text-destructive leading-tight">{t(event.labelKey as any)}</span>
                    </motion.button>
                  ))}
                </div>

                {/* Walk notes for Glass variant */}
                {vs.walkNotes && (
                  <div className="mb-6">
                    <input
                      type="text"
                      value={walkNote}
                      onChange={(e) => setWalkNote(e.target.value)}
                      placeholder={t('walk.note_placeholder')}
                      className="w-full px-4 py-3 rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/50"
                    />
                  </div>
                )}

                {/* Save button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  disabled={!canSave}
                  className={`${vs.actionButton} transition-all ${
                    canSave
                      ? 'bg-primary text-primary-foreground shadow-[var(--shadow-button)]'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  }`}
                >
                  {t('walk.save')}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
