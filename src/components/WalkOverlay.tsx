import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import { Dog, Person, ActionType } from '@/types';
import { X, Droplets, Circle, Check } from 'lucide-react';

interface WalkOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { dogId: string; personId: string; actions: ActionType[] }) => void;
  dogs: Dog[];
  people: Person[];
}

export function WalkOverlay({ isOpen, onClose, onSave, dogs, people }: WalkOverlayProps) {
  const [selectedActions, setSelectedActions] = useState<ActionType[]>([]);
  const [selectedDog, setSelectedDog] = useState<string>(dogs[0]?.id || '');
  const [selectedPerson, setSelectedPerson] = useState<string>(people[0]?.id || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const toggleAction = (action: ActionType) => {
    setSelectedActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action]
    );
  };

  const handleSave = () => {
    if (selectedActions.length === 0 || !selectedDog || !selectedPerson) return;
    
    setShowSuccess(true);
    
    setTimeout(() => {
      onSave({
        dogId: selectedDog,
        personId: selectedPerson,
        actions: selectedActions,
      });
      
      // Reset state
      setSelectedActions([]);
      setShowSuccess(false);
      onClose();
    }, 600);
  };

  const selectedDogData = dogs.find((d) => d.id === selectedDog);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 bg-card rounded-t-[2rem] z-50 max-h-[85vh] overflow-y-auto shadow-soft"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-muted rounded-full" />
            </div>

            {/* Success Animation */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-card/95 rounded-t-[2rem] z-10"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', damping: 10 }}
                    className="text-8xl"
                  >
                    🐾
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-heading font-semibold text-foreground">
                  Zapisz spacer
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-muted/80 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Actions Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Co się wydarzyło?</p>
                <div className="flex gap-3">
                  {/* Pee Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAction('pee')}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 border-2 ${
                      selectedActions.includes('pee')
                        ? 'bg-secondary/30 border-secondary shadow-md'
                        : 'bg-muted border-transparent hover:border-secondary/30'
                    }`}
                  >
                    <motion.span
                      animate={{ scale: selectedActions.includes('pee') ? 1.2 : 1 }}
                      className="text-3xl"
                    >
                      💧
                    </motion.span>
                    <span className="text-sm font-medium">Siku</span>
                    {selectedActions.includes('pee') && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-secondary rounded-full flex items-center justify-center"
                      >
                        <Check size={12} className="text-secondary-foreground" />
                      </motion.div>
                    )}
                  </motion.button>

                  {/* Poop Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleAction('poop')}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 border-2 ${
                      selectedActions.includes('poop')
                        ? 'bg-accent/20 border-accent shadow-md'
                        : 'bg-muted border-transparent hover:border-accent/30'
                    }`}
                  >
                    <motion.span
                      animate={{ scale: selectedActions.includes('poop') ? 1.2 : 1 }}
                      className="text-3xl"
                    >
                      💩
                    </motion.span>
                    <span className="text-sm font-medium">Kupa</span>
                  </motion.button>

                  {/* Both Button */}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const hasBoth = selectedActions.includes('pee') && selectedActions.includes('poop');
                      setSelectedActions(hasBoth ? [] : ['pee', 'poop']);
                    }}
                    className={`flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 border-2 ${
                      selectedActions.includes('pee') && selectedActions.includes('poop')
                        ? 'bg-primary/20 border-primary shadow-md'
                        : 'bg-muted border-transparent hover:border-primary/30'
                    }`}
                  >
                    <motion.span
                      animate={{ 
                        scale: selectedActions.includes('pee') && selectedActions.includes('poop') ? 1.2 : 1 
                      }}
                      className="text-3xl"
                    >
                      💧💩
                    </motion.span>
                    <span className="text-sm font-medium">Oba</span>
                  </motion.button>
                </div>
              </div>

              {/* Dog Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Który piesek?</p>
                <div className="flex gap-3">
                  {dogs.map((dog) => (
                    <motion.button
                      key={dog.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDog(dog.id)}
                      className={`flex-1 py-4 px-3 rounded-2xl flex flex-col items-center gap-2 transition-all duration-200 border-2 ${
                        selectedDog === dog.id
                          ? 'bg-primary/20 border-primary shadow-md'
                          : 'bg-muted border-transparent hover:border-primary/30'
                      }`}
                    >
                      <motion.div
                        animate={{ scale: selectedDog === dog.id ? 1.1 : 1 }}
                        className="w-14 h-14 rounded-full overflow-hidden bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center"
                        style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}
                      >
                        {dog.avatarUrl ? (
                          <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl">🐕</span>
                        )}
                      </motion.div>
                      <div className="text-center">
                        <p className="font-semibold text-sm">{dog.name}</p>
                        <p className="text-xs text-muted-foreground">{dog.age}</p>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Person Selection */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Kto wyszedł?</p>
                <div className="flex gap-2 flex-wrap">
                  {people.map((person) => (
                    <motion.button
                      key={person.id}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPerson(person.id)}
                      className={`chip ${
                        selectedPerson === person.id ? 'chip-selected' : 'chip-unselected'
                      }`}
                    >
                      {person.name}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Auto-save Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                disabled={selectedActions.length === 0}
                className={`w-full py-4 rounded-[2rem] font-heading font-semibold text-lg transition-all duration-200 ${
                  selectedActions.length > 0
                    ? 'btn-main'
                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                }`}
              >
                {selectedActions.length > 0 ? '🐾 Zapisz spacer' : 'Wybierz co się wydarzyło'}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
