import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { format, addMonths, subMonths, isSameDay, startOfWeek, getDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Walk, Dog, Person } from '@/types';
import { 
  getDaysInMonth, 
  getWalksForDay, 
  getWalksCountForMonth, 
  getTotalWalksCount,
  formatMonthYear,
  formatTime,
  getWarsawNow,
  isGuestPerson
} from '@/lib/weekUtils';

interface CalendarViewProps {
  walks: Walk[];
  dogs: Dog[];
  people: Person[];
  getDogById: (id: string) => Dog | undefined;
  getPersonById: (id: string) => Person | undefined;
}

const WEEKDAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nie'];

export function CalendarView({ walks, dogs, people, getDogById, getPersonById }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(getWarsawNow());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getDaysInMonth(currentMonth);
  const monthWalks = getWalksCountForMonth(walks, currentMonth);
  const totalWalks = getTotalWalksCount(walks);

  // Get the starting day offset (for proper alignment in grid)
  const firstDayOfMonth = days[0];
  // Get day of week (0 = Sunday, 1 = Monday, etc), convert to Monday-first (0 = Monday)
  const startDayOfWeek = getDay(firstDayOfMonth);
  const mondayFirstOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const selectedDayWalks = selectedDate ? getWalksForDay(walks, selectedDate) : [];

  const getWalkLabel = (count: number) => {
    if (count === 1) return '1';
    return count.toString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card-pet p-4 text-center">
          <p className="text-3xl font-bold text-primary">{monthWalks}</p>
          <p className="text-xs text-muted-foreground mt-1">Ten miesiąc</p>
        </div>
        <div className="card-pet p-4 text-center">
          <p className="text-3xl font-bold text-secondary">{totalWalks}</p>
          <p className="text-xs text-muted-foreground mt-1">Łącznie</p>
        </div>
      </div>

      {/* Calendar */}
      <div className="card-pet p-4">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <h3 className="text-lg font-heading font-semibold capitalize">
            {formatMonthYear(currentMonth)}
          </h3>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for offset */}
          {Array.from({ length: mondayFirstOffset }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {days.map((day, index) => {
            const dayWalks = getWalksForDay(walks, day);
            const walkCount = dayWalks.length;
            const isToday = isSameDay(day, getWarsawNow());
            const isSelected = selectedDate && isSameDay(day, selectedDate);

            return (
              <motion.button
                key={day.toISOString()}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDate(day)}
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  text-sm transition-all relative
                  ${isSelected ? 'bg-primary text-primary-foreground' : ''}
                  ${isToday && !isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}
                  ${!isSelected && walkCount > 0 ? 'bg-primary/10' : ''}
                  ${!isSelected && !isToday ? 'hover:bg-muted' : ''}
                `}
              >
                <span className={`font-medium ${isSelected ? 'text-primary-foreground' : ''}`}>
                  {format(day, 'd')}
                </span>
                {walkCount > 0 && (
                  <span className={`text-[10px] ${isSelected ? 'text-primary-foreground/80' : 'text-primary'}`}>
                    {getWalkLabel(walkCount)}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="card-pet p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">
                {format(selectedDate, 'd MMMM', { locale: pl })}
              </h4>
              <button
                onClick={() => setSelectedDate(null)}
                className="p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {selectedDayWalks.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">
                Brak spacerów tego dnia
              </p>
            ) : (
              <div className="space-y-2">
                {selectedDayWalks.map((walk) => {
                  const dog = getDogById(walk.dogId);
                  const person = getPersonById(walk.personId);
                  const isGuest = isGuestPerson(walk.personId);

                  return (
                    <motion.div
                      key={walk.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2 rounded-xl bg-muted/50"
                    >
                      {/* Time */}
                      <span className="text-sm font-mono text-muted-foreground w-12">
                        {formatTime(walk.timestamp)}
                      </span>

                      {/* Dog avatar */}
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: dog?.avatarUrl ? 'transparent' : dog?.color }}
                      >
                        {dog?.avatarUrl ? (
                          <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm">🐕</div>
                        )}
                      </div>

                      {/* Dog name */}
                      <span className="font-medium flex-1">{dog?.name}</span>

                      {/* Event type */}
                      <span className="text-lg">
                        {walk.eventType === 'pee_walk' && '💧'}
                        {walk.eventType === 'poop_walk' && '💩'}
                        {walk.eventType === 'both_walk' && '💧💩'}
                      </span>

                      {/* Person */}
                      {isGuest ? (
                        <span className="text-xs px-2 py-1 bg-muted rounded-full text-muted-foreground">
                          Gość
                        </span>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">{person?.initial}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
