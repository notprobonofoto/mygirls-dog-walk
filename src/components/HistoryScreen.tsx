import { motion } from 'framer-motion';
import { useSharedData } from '@/hooks/useSharedData';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { EventType } from '@/types';

export function HistoryScreen() {
  const { walks, getDogById, getPersonById, isHomeEvent } = useSharedData();

  const groupedWalks = walks.reduce((acc, walk) => {
    const date = format(new Date(walk.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(walk);
    return acc;
  }, {} as Record<string, typeof walks>);

  const sortedDates = Object.keys(groupedWalks).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const getEventIcons = (eventType: EventType) => {
    switch (eventType) {
      case 'pee_walk':
        return '💧';
      case 'poop_walk':
        return '💩';
      case 'both_walk':
        return '💧💩';
      case 'pee_home':
        return '🚨💧';
      case 'poop_home':
        return '🚨💩';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Historia</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Wszystkie spacery Twoich piesków
        </p>
      </header>

      <div className="px-6 space-y-6">
        {sortedDates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-pet p-8 text-center"
          >
            <span className="text-5xl mb-4 block">🐾</span>
            <p className="text-muted-foreground">Brak zapisanych spacerów</p>
            <p className="text-sm text-muted-foreground mt-1">
              Wróć na stronę główną i zapisz pierwszy spacer!
            </p>
          </motion.div>
        ) : (
          sortedDates.map((date, dateIndex) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: dateIndex * 0.05 }}
            >
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {format(new Date(date), 'EEEE, d MMMM', { locale: pl })}
              </h2>
              <div className="space-y-2">
                {groupedWalks[date].map((walk, walkIndex) => {
                  const dog = getDogById(walk.dogId);
                  const person = getPersonById(walk.personId);
                  const isHome = isHomeEvent(walk.eventType);
                  
                  return (
                    <motion.div
                      key={walk.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: dateIndex * 0.05 + walkIndex * 0.03 }}
                      className={`card-pet p-4 flex items-center gap-4 ${
                        isHome ? 'bg-destructive/5 border-destructive/20' : ''
                      }`}
                    >
                      {/* Time */}
                      <div className="text-center min-w-[50px]">
                        <p className="font-semibold text-lg font-body">
                          {format(new Date(walk.timestamp), 'HH:mm')}
                        </p>
                      </div>

                      {/* Dog Avatar */}
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
                        style={{ backgroundColor: dog?.avatarUrl ? 'transparent' : dog?.color || '#ccc' }}
                      >
                        {dog?.avatarUrl ? (
                          <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🐕</div>
                        )}
                      </div>

                      {/* Dog Name */}
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{dog?.name || 'Nieznany'}</p>
                        {isHome && (
                          <p className="text-xs text-destructive font-medium">W domu</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <span className="text-xl">{getEventIcons(walk.eventType)}</span>
                      </div>

                      {/* Person Initial */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isHome ? 'bg-destructive/20' : 'bg-primary/20'
                      }`}>
                        <span className={`text-sm font-semibold ${
                          isHome ? 'text-destructive' : 'text-primary'
                        }`}>
                          {person?.initial || '?'}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
