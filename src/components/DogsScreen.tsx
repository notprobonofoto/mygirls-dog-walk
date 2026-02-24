import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useSharedData } from '@/hooks/useSharedData';
import { useApp } from '@/contexts/AppContext';
import { Camera, Upload } from 'lucide-react';
import { getWeekWalksCount } from '@/lib/weekUtils';
import { getDogHappiness, getHappinessEmoji, getHappinessLabel, getHappinessColor } from '@/lib/statsUtils';
import { getWalkCountLabel } from '@/lib/i18n';

export function DogsScreen() {
  const { dogs, updateDog, getDogAge, walks } = useSharedData();
  const { t, language } = useApp();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = async (dogId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      await updateDog(dogId, { avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">{t('dogs.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('dogs.subtitle')}</p>
      </header>

      <div className="px-6 space-y-4">
        {dogs.map((dog, index) => {
          const happiness = getDogHappiness(walks, dog.id);
          const happinessEmoji = getHappinessEmoji(happiness);
          const happinessLabel = getHappinessLabel(happiness);
          const happinessColor = getHappinessColor(happiness);
          const weekWalks = getWeekWalksCount(walks, dog.id);

          return (
            <motion.div key={dog.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="card-pet p-6">
              <div className="flex items-start gap-5">
                <div className="relative">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => fileInputRefs.current[dog.id]?.click()}
                    className="w-24 h-24 rounded-2xl overflow-hidden cursor-pointer relative group" style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}>
                    {dog.avatarUrl ? <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-4xl">🐕</div>}
                    <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera className="text-white" size={24} />
                    </div>
                  </motion.div>
                  <input ref={(el) => (fileInputRefs.current[dog.id] = el)} type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(dog.id, e)} />
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => fileInputRefs.current[dog.id]?.click()}
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-button">
                    <Upload size={14} />
                  </motion.button>
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-xl font-heading font-semibold">{dog.name}</h3>
                  <p className="text-muted-foreground mt-1">{getDogAge(dog.id)}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-secondary/30 text-secondary-foreground rounded-full text-xs font-medium">Shih Tzu</span>
                    <span className="px-3 py-1 bg-primary/20 text-foreground rounded-full text-xs font-medium">❤️ Aktywna</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{happinessEmoji}</span>
                    <div>
                      <p className="text-sm font-semibold">{happinessLabel}</p>
                      <p className="text-[10px] text-muted-foreground">{t('dogs.based_on_7_days')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <motion.p key={happiness} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-3xl font-bold" style={{ color: happinessColor }}>
                      {happiness}
                    </motion.p>
                    <p className="text-[10px] text-muted-foreground">/10</p>
                  </div>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${happiness * 10}%` }} transition={{ delay: 0.3 + index * 0.1, duration: 0.6, ease: 'easeOut' }} className="h-full rounded-full" style={{ backgroundColor: happinessColor }} />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border">
                <div className="flex justify-around text-center">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('dogs.this_week')}</p>
                    <p className="font-semibold mt-1 text-primary">
                      {weekWalks} {getWalkCountLabel(weekWalks, language)}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
