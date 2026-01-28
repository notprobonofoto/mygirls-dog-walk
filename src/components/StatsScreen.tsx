import { motion } from 'framer-motion';
import { useSharedData } from '@/hooks/useSharedData';
import { CalendarView } from './CalendarView';
import { isGuestPerson } from '@/lib/weekUtils';

export function StatsScreen() {
  const { dogs, people, getDogStats, getPersonStats, walks, getDogAge, isHomeEvent, isWalkEvent, getDogById, getPersonById } = useSharedData();
  
  // Filter out guest from person stats display
  const displayPeople = people.filter(p => !isGuestPerson(p.id));

  const walkEvents = walks.filter(w => isWalkEvent(w.eventType));
  const homeEvents = walks.filter(w => isHomeEvent(w.eventType));
  
  const totalWalks = walkEvents.length;
  const totalPee = walks.filter((w) => w.eventType.includes('pee') || w.eventType === 'both_walk').length;
  const totalPoop = walks.filter((w) => w.eventType.includes('poop') || w.eventType === 'both_walk').length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Statystyki</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Podsumowanie spacerów
        </p>
      </header>

      <div className="px-6 space-y-6">
        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-pet p-5"
        >
          <h2 className="text-lg font-heading font-semibold mb-4">Ogółem</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalWalks}</p>
              <p className="text-xs text-muted-foreground mt-1">Spacerów</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{totalPee}</p>
              <p className="text-xs text-muted-foreground mt-1">💧 Siku</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{totalPoop}</p>
              <p className="text-xs text-muted-foreground mt-1">💩 Kupa</p>
            </div>
          </div>
        </motion.div>

        {/* Home Events Warning */}
        {homeEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-pet p-5 bg-destructive/5 border-destructive/20"
          >
            <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
              <span>🚨</span> Zdarzenia w domu
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">
                  {homeEvents.filter(w => w.eventType === 'pee_home').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">💧 Siku w domu</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">
                  {homeEvents.filter(w => w.eventType === 'poop_home').length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">💩 Kupa w domu</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dog Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-heading font-semibold px-1">Pieski</h2>
          {dogs.map((dog, index) => {
            const stats = getDogStats(dog.id);
            const maxWalks = Math.max(...dogs.map((d) => getDogStats(d.id).totalWalks), 1);
            
            return (
              <motion.div
                key={dog.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="card-pet p-4"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}
                  >
                    {dog.avatarUrl ? (
                      <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xl">🐕</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{dog.name}</p>
                    <p className="text-xs text-muted-foreground">{getDogAge(dog.id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{stats.totalWalks}</p>
                    <p className="text-xs text-muted-foreground">spacerów</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.totalWalks / maxWalks) * 100}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
                
                {/* Pee/Poop stats */}
                <div className="flex gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <span>💧</span>
                    <span className="text-muted-foreground">{stats.totalPee}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💩</span>
                    <span className="text-muted-foreground">{stats.totalPoop}</span>
                  </div>
                  {stats.homeEvents > 0 && (
                    <div className="flex items-center gap-1 text-destructive">
                      <span>🚨</span>
                      <span>{stats.homeEvents} w domu</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-heading font-semibold px-1">📅 Kalendarz</h2>
          <CalendarView 
            walks={walks}
            dogs={dogs}
            people={people}
            getDogById={getDogById}
            getPersonById={getPersonById}
          />
        </motion.div>

        {/* Person Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-lg font-heading font-semibold px-1">Opiekunowie</h2>
          {displayPeople.map((person, index) => {
            const stats = getPersonStats(person.id);
            const maxWalks = Math.max(...displayPeople.map((p) => getPersonStats(p.id).totalWalks), 1);
            
            return (
              <motion.div
                key={person.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="card-pet p-4"
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{person.initial}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{person.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{stats.totalWalks}</p>
                    <p className="text-xs text-muted-foreground">spacerów</p>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.totalWalks / maxWalks) * 100}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                    className="h-full bg-accent rounded-full"
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
