import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Plus, X, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  description: string | null;
  dog_id: string | null;
  person_id: string | null;
  created_at: string;
}

export function GalleryScreen() {
  const { dogs } = useSharedData();
  const { currentPersonId } = useCurrentUser();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [selectedDogId, setSelectedDogId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fetchPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data as Photo[]);
    if (error) console.error(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Realtime
  useEffect(() => {
    const channel = supabase
      .channel('photos-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
        fetchPhotos();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPhotos]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setShowUpload(true);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const ext = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('dog-photos')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('dog-photos')
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from('photos').insert({
        url: urlData.publicUrl,
        description: description || null,
        dog_id: selectedDogId,
        person_id: currentPersonId,
      });

      if (insertError) throw insertError;

      toast.success('Zdjęcie dodane! 📸');
      setShowUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription('');
      setSelectedDogId(null);
    } catch (err) {
      console.error(err);
      toast.error('Błąd podczas wgrywania');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    try {
      // Extract file name from URL
      const urlParts = photo.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      await supabase.storage.from('dog-photos').remove([fileName]);
      await supabase.from('photos').delete().eq('id', photo.id);
      toast.success('Zdjęcie usunięte');
      if (lightboxIndex !== null) setLightboxIndex(null);
    } catch (err) {
      console.error(err);
      toast.error('Błąd podczas usuwania');
    }
  };

  const lightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] : null;

  const goLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + dir;
    if (next >= 0 && next < photos.length) setLightboxIndex(next);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Galeria</h1>
          <p className="text-muted-foreground text-sm mt-1">📸 Zdjęcia naszych piesków</p>
        </div>
        <Button
          size="icon"
          className="rounded-full bg-primary text-primary-foreground w-12 h-12 shadow-lg"
          onClick={() => fileInputRef.current?.click()}
        >
          <Plus className="w-6 h-6" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
      </header>

      {/* Photo Grid - Instagram style */}
      <div className="px-1">
        {loading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-muted-foreground">Brak zdjęć. Dodaj pierwsze!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.03 }}
                className="aspect-square relative cursor-pointer overflow-hidden group"
                onClick={() => setLightboxIndex(index)}
              >
                <img
                  src={photo.url}
                  alt={photo.description || 'Zdjęcie pieska'}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Dog indicator dot */}
                {photo.dog_id && (
                  <div className="absolute top-1.5 right-1.5">
                    {dogs.find(d => d.id === photo.dog_id)?.avatarUrl ? (
                      <img
                        src={dogs.find(d => d.id === photo.dog_id)?.avatarUrl}
                        className="w-5 h-5 rounded-full border border-white/80"
                        alt=""
                      />
                    ) : null}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-[90vw] rounded-2xl">
          <DialogHeader className="relative">
            <DialogTitle>Nowe zdjęcie</DialogTitle>
            <DialogClose className="absolute right-0 top-0">
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>

          {previewUrl && (
            <div className="rounded-xl overflow-hidden max-h-[40vh]">
              <img src={previewUrl} alt="Podgląd" className="w-full h-full object-contain" />
            </div>
          )}

          <Input
            placeholder="Opis zdjęcia (opcjonalnie)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Dog selector */}
          <div className="flex gap-2">
            {dogs.map(dog => (
              <motion.button
                key={dog.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDogId(selectedDogId === dog.id ? null : dog.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDogId === dog.id
                    ? 'bg-primary/20 border-2 border-primary'
                    : 'bg-muted border-2 border-transparent'
                }`}
              >
                {dog.avatarUrl ? (
                  <img src={dog.avatarUrl} className="w-6 h-6 rounded-full" alt={dog.name} />
                ) : (
                  <span>🐕</span>
                )}
                {dog.name}
              </motion.button>
            ))}
          </div>

          <Button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full btn-main py-3"
          >
            {uploading ? 'Wgrywanie...' : 'Dodaj zdjęcie 📸'}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between p-4" onClick={e => e.stopPropagation()}>
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => setLightboxIndex(null)}
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleDelete(lightboxPhoto)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center px-4 relative" onClick={e => e.stopPropagation()}>
              {lightboxIndex! > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                  onClick={() => goLightbox(-1)}
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              <motion.img
                key={lightboxPhoto.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={lightboxPhoto.url}
                alt={lightboxPhoto.description || ''}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
              {lightboxIndex! < photos.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
                  onClick={() => goLightbox(1)}
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              )}
            </div>

            {/* Description */}
            {lightboxPhoto.description && (
              <div className="p-4 text-center" onClick={e => e.stopPropagation()}>
                <p className="text-white/90 text-sm">{lightboxPhoto.description}</p>
              </div>
            )}
            {/* Dog + date info */}
            <div className="pb-6 px-4 text-center" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
                {lightboxPhoto.dog_id && dogs.find(d => d.id === lightboxPhoto.dog_id) && (
                  <span>{dogs.find(d => d.id === lightboxPhoto.dog_id)?.name}</span>
                )}
                <span>•</span>
                <span>{new Date(lightboxPhoto.created_at).toLocaleDateString('pl-PL')}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
