import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSharedData } from '@/hooks/useSharedData';
import { useApp } from '@/contexts/AppContext';
import { CalendarView } from './CalendarView';
import { isGuestPerson } from '@/lib/weekUtils';
import { 
  getStatsWeekRange, 
  getStatsMonthRange, 
  getWalksInRange, 
  getAverageWalkHoursByPeriod, 
  getAverageWalkHourForDog 
} from '@/lib/statsUtils';

type StatsPeriod = 'week' | 'month';

export function StatsScreen() {
  const { dogs, people, walks, getDogAge, isHomeEvent, isWalkEvent, getDogById, getPersonById } = useSharedData();
  const { t } = useApp();
  const [period, setPeriod] = useState<StatsPeriod>('week');
  
  const displayPeople = people.filter(p => !isGuestPerson(p.id));

  const range = period === 'week' ? getStatsWeekRange() : getStatsMonthRange();
  const periodWalks = getWalksInRange(walks, range.start, range.end);
  
  const periodWalkEvents = periodWalks.filter(w => isWalkEvent(w.eventType));
  const periodHomeEvents = periodWalks.filter(w => isHomeEvent(w.eventType));
  
  const totalWalks = periodWalkEvents.length;
  const totalPee = periodWalks.filter((w) => w.eventType.includes('pee') || w.eventType === 'both_walk').length;
  const totalPoop = periodWalks.filter((w) => w.eventType.includes('poop') || w.eventType === 'both_walk').length;

  const periodAverages = getAverageWalkHoursByPeriod(periodWalks);

  const getDogPeriodStats = (dogId: string) => {
    const dogWalks = periodWalks.filter(w => w.dogId === dogId);
    const walkEvents = dogWalks.filter(w => isWalkEvent(w.eventType));
    const homeEvents = dogWalks.filter(w => isHomeEvent(w.eventType));
    return {
      totalWalks: walkEvents.length,
      totalPee: dogWalks.filter(w => w.eventType.includes('pee') || w.eventType === 'both_walk').length,
      totalPoop: dogWalks.filter(w => w.eventType.includes('poop') || w.eventType === 'both_walk').length,
      homeEvents: homeEvents.length,
    };
  };

  const getPersonPeriodStats = (personId: string) => {
    const personWalks = periodWalks.filter(w => w.personId === personId);
    return { totalWalks: personWalks.filter(w => isWalkEvent(w.eventType)).length };
  };

  const periodLabel = period === 'week' ? t('stats.this_week') : t('stats.this_month');

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t('stats.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('stats.subtitle')}</p>
      </header>

      <div className="px-6 space-y-6">
        {/* Period Toggle */}
        <div className="flex gap-2 p-1 bg-muted rounded-2xl">
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setPeriod('week')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${period === 'week' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
            {t('stats.week')}
          </motion.button>
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setPeriod('month')} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${period === 'month' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
            {t('stats.month')}
          </motion.button>
        </div>

        {/* Overall Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-pet p-5">
          <h2 className="text-lg font-heading font-semibold mb-4">{periodLabel}</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">{totalWalks}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('stats.walks')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-secondary">{totalPee}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('stats.pee')}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-accent">{totalPoop}</p>
              <p className="text-xs text-muted-foreground mt-1">{t('stats.poop')}</p>
            </div>
          </div>

          {periodAverages.some(p => p.avg) && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-3 text-center">{t('stats.avg_hours')}</p>
              <div className="grid grid-cols-3 gap-3">
                {periodAverages.map(p => (
                  <div key={p.period} className="text-center">
                    <p className="text-lg mb-0.5">{p.emoji}</p>
                    <p className="text-xs text-muted-foreground">{p.label}</p>
                    {p.avg ? <p className="text-lg font-bold text-foreground font-mono">{p.avg}</p> : <p className="text-sm text-muted-foreground">—</p>}
                    <p className="text-[10px] text-muted-foreground">{p.count} {t('stats.walks_count')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Home Events */}
        {periodHomeEvents.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card-pet p-5 bg-destructive/5 border-destructive/20">
            <h2 className="text-lg font-heading font-semibold mb-4 flex items-center gap-2">
              <span>🚨</span> {t('stats.home_events')}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{periodHomeEvents.filter(w => w.eventType === 'pee_home').length}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('stats.pee_home')}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{periodHomeEvents.filter(w => w.eventType === 'poop_home').length}</p>
                <p className="text-xs text-muted-foreground mt-1">{t('stats.poop_home')}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Dog Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-3">
          <h2 className="text-lg font-heading font-semibold px-1">{t('stats.dogs_section')}</h2>
          {dogs.map((dog, index) => {
            const stats = getDogPeriodStats(dog.id);
            const maxWalks = Math.max(...dogs.map((d) => getDogPeriodStats(d.id).totalWalks), 1);
            const dogAvgHour = getAverageWalkHourForDog(periodWalks, dog.id);
            
            return (
              <motion.div key={dog.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + index * 0.05 }} className="card-pet p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}>
                    {dog.avatarUrl ? <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xl">🐕</div>}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{dog.name}</p>
                    <p className="text-xs text-muted-foreground">{getDogAge(dog.id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{stats.totalWalks}</p>
                    <p className="text-xs text-muted-foreground">{t('stats.walks_count')}</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.totalWalks / maxWalks) * 100}%` }} transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }} className="h-full bg-primary rounded-full" />
                </div>
                <div className="flex gap-4 mt-3 text-sm flex-wrap">
                  <div className="flex items-center gap-1"><span>💧</span><span className="text-muted-foreground">{stats.totalPee}</span></div>
                  <div className="flex items-center gap-1"><span>💩</span><span className="text-muted-foreground">{stats.totalPoop}</span></div>
                  {stats.homeEvents > 0 && <div className="flex items-center gap-1 text-destructive"><span>🚨</span><span>{stats.homeEvents} {t('stats.at_home')}</span></div>}
                  {dogAvgHour && <div className="flex items-center gap-1"><span>🕐</span><span className="text-muted-foreground font-mono text-xs">{dogAvgHour}</span></div>}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Calendar */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
          <h2 className="text-lg font-heading font-semibold px-1">{t('stats.calendar')}</h2>
          <CalendarView walks={walks} dogs={dogs} people={people} getDogById={getDogById} getPersonById={getPersonById} />
        </motion.div>

        {/* Person Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
          <h2 className="text-lg font-heading font-semibold px-1">{t('stats.caretakers')}</h2>
          {displayPeople.map((person, index) => {
            const stats = getPersonPeriodStats(person.id);
            const maxWalks = Math.max(...displayPeople.map((p) => getPersonPeriodStats(p.id).totalWalks), 1);
            
            return (
              <motion.div key={person.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + index * 0.05 }} className="card-pet p-4">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary">{person.initial}</span>
                  </div>
                  <div className="flex-1"><p className="font-semibold">{person.name}</p></div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{stats.totalWalks}</p>
                    <p className="text-xs text-muted-foreground">{t('stats.walks_count')}</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.totalWalks / maxWalks) * 100}%` }} transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }} className="h-full bg-accent rounded-full" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
