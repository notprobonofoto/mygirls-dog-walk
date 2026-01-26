import { motion } from 'framer-motion';
import { useRef } from 'react';
import { useAppData } from '@/hooks/useAppData';
import { Camera, Upload } from 'lucide-react';

export function DogsScreen() {
  const { dogs, updateDog } = useAppData();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleImageUpload = (dogId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      updateDog(dogId, { avatarUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-6 px-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Pieski</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Zarządzaj profilami swoich piesków
        </p>
      </header>

      <div className="px-6 space-y-4">
        {dogs.map((dog, index) => (
          <motion.div
            key={dog.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card-pet p-6"
          >
            <div className="flex items-start gap-5">
              {/* Avatar with upload */}
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => fileInputRefs.current[dog.id]?.click()}
                  className="w-24 h-24 rounded-2xl overflow-hidden cursor-pointer relative group"
                  style={{ backgroundColor: dog.avatarUrl ? 'transparent' : dog.color }}
                >
                  {dog.avatarUrl ? (
                    <img src={dog.avatarUrl} alt={dog.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🐕</div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white" size={24} />
                  </div>
                </motion.div>
                
                <input
                  ref={(el) => (fileInputRefs.current[dog.id] = el)}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload(dog.id, e)}
                />
                
                {/* Upload hint */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRefs.current[dog.id]?.click()}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-button"
                >
                  <Upload size={14} />
                </motion.button>
              </div>

              {/* Info */}
              <div className="flex-1 pt-2">
                <h3 className="text-xl font-heading font-semibold">{dog.name}</h3>
                <p className="text-muted-foreground mt-1">{dog.age}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-secondary/30 text-secondary-foreground rounded-full text-xs font-medium">
                    Shih Tzu
                  </span>
                  <span className="px-3 py-1 bg-primary/20 text-foreground rounded-full text-xs font-medium">
                    ❤️ Aktywna
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-around text-center">
                <div>
                  <p className="text-sm text-muted-foreground">Ostatni spacer</p>
                  <p className="font-semibold mt-1">Dzisiaj</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ten tydzień</p>
                  <p className="font-semibold mt-1">12 spacerów</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
