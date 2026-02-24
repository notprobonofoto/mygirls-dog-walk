import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { isGuestPerson } from '@/lib/weekUtils';
import { useSharedData } from '@/hooks/useSharedData';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { pl, enUS } from 'date-fns/locale';
import { EventType, Walk } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Pencil, X } from 'lucide-react';
import { toast } from 'sonner';

export function HistoryScreen() {
  const { walks, dogs, people, getDogById, getPersonById, isHomeEvent, updateWalk, deleteWalk } = useSharedData();
  const { t, language } = useApp();
  const locale = language === 'pl' ? pl : enUS;

  const EVENT_OPTIONS: { type: EventType; icon: string; labelKey: string }[] = [
    { type: 'pee_walk', icon: '💧', labelKey: 'history.pee' },
    { type: 'poop_walk', icon: '💩', labelKey: 'history.poop' },
    { type: 'both_walk', icon: '💧💩', labelKey: 'history.both' },
    { type: 'nothing_walk', icon: '🚶', labelKey: 'history.nothing' },
    { type: 'pee_home', icon: '🚨💧', labelKey: 'history.pee_home' },
    { type: 'poop_home', icon: '🚨💩', labelKey: 'history.poop_home' },
  ];

  const getEventIcons = (eventType: EventType) => {
    return EVENT_OPTIONS.find(e => e.type === eventType)?.icon || '';
  };

  const [editingWalk, setEditingWalk] = useState<Walk | null>(null);
  const [editEventType, setEditEventType] = useState<EventType>('pee_walk');
  const [editDogId, setEditDogId] = useState('');
  const [editPersonId, setEditPersonId] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editDate, setEditDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const groupedWalks = walks.reduce((acc, walk) => {
    const date = format(new Date(walk.timestamp), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(walk);
    return acc;
  }, {} as Record<string, typeof walks>);

  const sortedDates = Object.keys(groupedWalks).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  const openEdit = (walk: Walk) => {
    const d = new Date(walk.timestamp);
    setEditingWalk(walk);
    setEditEventType(walk.eventType);
    setEditDogId(walk.dogId);
    setEditPersonId(walk.personId);
    setEditDate(format(d, 'yyyy-MM-dd'));
    setEditTime(format(d, 'HH:mm'));
  };

  const handleSave = async () => {
    if (!editingWalk) return;
    setSaving(true);
    try {
      const newTimestamp = new Date(`${editDate}T${editTime}:00`).toISOString();
      await updateWalk(editingWalk.id, {
        eventType: editEventType,
        dogId: editDogId,
        personId: editPersonId,
        timestamp: newTimestamp,
      });
      toast.success(t('history.updated'));
      setEditingWalk(null);
    } catch {
      toast.error(t('common.save_error'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (walkId: string) => {
    try {
      await deleteWalk(walkId);
      toast.success(t('history.deleted'));
      setConfirmDelete(null);
      setEditingWalk(null);
    } catch {
      toast.error(t('common.save_error'));
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t('history.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('history.subtitle')}</p>
      </header>

      <div className="px-6 space-y-6">
        {sortedDates.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-pet p-8 text-center">
            <span className="text-5xl mb-4 block">🐾</span>
            <p className="text-muted-foreground">{t('history.empty')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('history.empty_hint')}</p>
          </motion.div>
        ) : (
          sortedDates.map((date, dateIndex) => (
            <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: dateIndex * 0.05 }}>
              <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
                {format(new Date(date), 'EEEE, d MMMM', { locale })}
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
                      onClick={() => openEdit(walk)}
                      className={`card-pet p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform ${
                        isHome ? 'bg-destructive/5 border-destructive/20' : ''
                      }`}
                    >
                      <div className="text-center min-w-[50px]">
                        <p className="font-semibold text-lg font-body">{format(new Date(walk.timestamp), 'HH:mm')}</p>
                      </div>
                      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0" style={{ backgroundColor: dog?.avatarUrl ? 'transparent' : dog?.color || 'hsl(var(--muted))' }}>
                        {dog?.avatarUrl ? (
                          <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">🐕</div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{dog?.name || t('history.unknown')}</p>
                        {isHome && <p className="text-xs text-destructive font-medium">{t('history.at_home')}</p>}
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xl">{getEventIcons(walk.eventType)}</span>
                      </div>
                      {isGuestPerson(walk.personId) ? (
                        <div className="px-2 py-1 rounded-full bg-muted">
                          <span className="text-xs text-muted-foreground font-medium">{t('walk.guest')}</span>
                        </div>
                      ) : (
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isHome ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                          <span className={`text-sm font-semibold ${isHome ? 'text-destructive' : 'text-primary'}`}>
                            {person?.initial || '?'}
                          </span>
                        </div>
                      )}
                      <Pencil className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingWalk} onOpenChange={(open) => { if (!open) setEditingWalk(null); }}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader className="relative">
            <DialogTitle>{t('history.edit_title')}</DialogTitle>
            <DialogDescription>{t('history.edit_desc')}</DialogDescription>
            <DialogClose className="absolute right-0 top-0"><X className="w-5 h-5" /></DialogClose>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('history.event_type')}</p>
              <div className="grid grid-cols-3 gap-2">
                {EVENT_OPTIONS.map((opt) => (
                  <button key={opt.type} onClick={() => setEditEventType(opt.type)} className={`p-2 rounded-xl text-center border-2 transition-colors ${editEventType === opt.type ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>
                    <span className="text-lg">{opt.icon}</span>
                    <p className="text-[10px] mt-0.5 font-medium">{t(opt.labelKey as any)}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('history.dog')}</p>
              <div className="flex gap-2">
                {dogs.map((dog) => (
                  <button key={dog.id} onClick={() => setEditDogId(dog.id)} className={`flex-1 p-2 rounded-xl text-center border-2 transition-colors ${editDogId === dog.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto overflow-hidden mb-1" style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}>
                      {dog.avatarUrl ? <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-sm">🐕</div>}
                    </div>
                    <p className="text-xs font-medium">{dog.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">{t('history.person')}</p>
              <div className="flex gap-2">
                {people.map((person) => (
                  <button key={person.id} onClick={() => setEditPersonId(person.id)} className={`flex-1 p-2 rounded-xl text-center border-2 transition-colors ${editPersonId === person.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto bg-primary/20 flex items-center justify-center mb-1">
                      <span className="text-sm font-semibold text-primary">{person.initial}</span>
                    </div>
                    <p className="text-xs font-medium">{person.name}</p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{t('history.date')}</p>
                <Input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{t('history.time')}</p>
                <Input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="destructive" size="sm" className="gap-1.5" onClick={() => editingWalk && setConfirmDelete(editingWalk.id)}>
                <Trash2 className="w-4 h-4" />{t('history.delete')}
              </Button>
              <div className="flex-1" />
              <Button variant="outline" size="sm" onClick={() => setEditingWalk(null)}>{t('history.cancel')}</Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>{saving ? t('history.saving') : t('history.save')}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <DialogContent className="max-w-[85vw] rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t('history.delete_confirm')}</DialogTitle>
            <DialogDescription>{t('history.delete_irreversible')}</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>{t('history.cancel')}</Button>
            <Button variant="destructive" size="sm" onClick={() => confirmDelete && handleDelete(confirmDelete)}>{t('history.delete')}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
