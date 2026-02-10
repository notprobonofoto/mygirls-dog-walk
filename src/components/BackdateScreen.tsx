import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { EventType } from '@/types';
import { isGuestPerson } from '@/lib/weekUtils';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Europe/Warsaw';

const walkEvents: { type: EventType; icon: string; label: string }[] = [
  { type: 'pee_walk', icon: '💧', label: 'Siku' },
  { type: 'poop_walk', icon: '💩', label: 'Kupa' },
  { type: 'both_walk', icon: '💧💩', label: 'Oba' },
  { type: 'nothing_walk', icon: '🚶', label: 'Nic' },
];

const homeEvents: { type: EventType; icon: string; label: string }[] = [
  { type: 'pee_home', icon: '🚨💧', label: 'Siku w domu' },
  { type: 'poop_home', icon: '🚨💩', label: 'Kupa w domu' },
];

export function BackdateScreen() {
  const { dogs, people, addWalk, getDogAge } = useSharedData();
  const { currentPersonId } = useCurrentUser();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [selectedDog, setSelectedDog] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const familyMembers = people.filter(p => !isGuestPerson(p.id));
  const guestPerson = people.find(p => isGuestPerson(p.id));

  const getEventCategory = (eventType: EventType) => eventType.endsWith('_home') ? 'home' : 'walk';

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

  const handleSave = async () => {
    const personToUse = selectedPersonId || currentPersonId;
    if (!selectedDate || !selectedDog || !selectedEvent || !personToUse) return;

    // Build timestamp in Warsaw timezone
    const h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    const localDate = new Date(selectedDate);
    localDate.setHours(h, m, 0, 0);
    const utcDate = fromZonedTime(localDate, TIMEZONE);
    const timestamp = utcDate.toISOString();

    try {
      await addWalk({
        dogId: selectedDog,
        personId: personToUse,
        eventType: selectedEvent,
        timestamp,
      });

      setShowSuccess(true);
      if (navigator.vibrate) navigator.vibrate(50);

      setTimeout(() => {
        setShowSuccess(false);
        setSelectedDate(undefined);
        setHour('12');
        setMinute('00');
        setSelectedDog(null);
        setSelectedEvent(null);
        setSelectedPersonId(null);
      }, 800);
    } catch (error) {
      console.error('Error saving backdate:', error);
    }
  };

  const canSave = selectedDate && selectedDog && selectedEvent && (selectedPersonId || currentPersonId);

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-24">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="p-6">
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-foreground mb-6"
        >
          📝 Zapisz wstecz
        </motion.h1>

        {/* Date picker */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Wybierz datę
        </h3>
        <div className="card-pet p-2 mb-6 flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date > new Date()}
            locale={pl}
            className="p-3 pointer-events-auto"
            classNames={{
              day_selected:
                "bg-poop text-white rounded-full hover:bg-poop hover:text-white focus:bg-poop focus:text-white",
              cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
            }}
          />
        </div>

        {/* Time picker */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Godzina
        </h3>
        <div className="flex items-center gap-3 mb-6">
          <select
            value={hour}
            onChange={(e) => setHour(e.target.value)}
            className="flex-1 h-12 rounded-2xl border border-border bg-card text-foreground text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={String(i).padStart(2, '0')}>
                {String(i).padStart(2, '0')}
              </option>
            ))}
          </select>
          <span className="text-2xl font-bold text-muted-foreground">:</span>
          <select
            value={minute}
            onChange={(e) => setMinute(e.target.value)}
            className="flex-1 h-12 rounded-2xl border border-border bg-card text-foreground text-center text-lg font-medium focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i * 5} value={String(i * 5).padStart(2, '0')}>
                {String(i * 5).padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        {/* Person selection */}
        <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wide">
          Kto wyprowadził?
        </h3>
        <div className="flex flex-wrap gap-2 mb-6">
          {familyMembers.map((person) => {
            const isSelected = selectedPersonId ? selectedPersonId === person.id : currentPersonId === person.id;
            return (
              <motion.button
                key={person.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPersonId(person.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card hover:border-primary/30'
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 transition-all ${
                selectedPersonId === 'guest'
                  ? 'border-muted-foreground bg-muted'
                  : 'border-border bg-card hover:border-muted-foreground/50'
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs text-muted-foreground">👤</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">Gość</span>
            </motion.button>
          )}
        </div>

        {/* Dog selection */}
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
                  ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
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

        {/* Selected summary */}
        {selectedDate && (
          <div className="card-pet p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground">
              Zapis na: <span className="font-semibold text-foreground">
                {format(selectedDate, 'd MMMM yyyy', { locale: pl })}, godz. {hour}:{minute}
              </span>
            </p>
          </div>
        )}

        {/* Save button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            canSave
              ? 'btn-main'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          Zapisz wstecz
        </motion.button>
      </div>
    </div>
  );
}
