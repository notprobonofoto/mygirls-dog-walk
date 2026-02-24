import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSharedData } from '@/hooks/useSharedData';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useApp } from '@/contexts/AppContext';
import { Plus, X, Trash2, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Photo {
  id: string;
  url: string;
  description: string | null;
  dog_ids: string[] | null;
  person_id: string | null;
  created_at: string;
}

type GalleryTab = 'all_dog_1' | 'together' | 'all_dog_2';

export function GalleryScreen() {
  const { dogs } = useSharedData();
  const { currentPersonId } = useCurrentUser();
  const { t } = useApp();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [description, setDescription] = useState('');
  const [selectedDogIds, setSelectedDogIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<GalleryTab>('all_dog_1');

  const dog1 = dogs[0];
  const dog2 = dogs[1];

  const fetchPhotos = useCallback(async () => {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setPhotos(data as Photo[]);
    if (error) console.error(error);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPhotos(); }, [fetchPhotos]);

  useEffect(() => {
    const channel = supabase
      .channel('photos-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'photos' }, () => {
        fetchPhotos();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchPhotos]);

  // Filter photos by tab
  const filteredPhotos = photos.filter(photo => {
    if (!dog1 || !dog2) return true;
    if (activeTab === 'all_dog_1') {
      return photo.dog_ids?.includes(dog1.id) && !(photo.dog_ids?.includes(dog2.id));
    }
    if (activeTab === 'all_dog_2') {
      return photo.dog_ids?.includes(dog2.id) && !(photo.dog_ids?.includes(dog1.id));
    }
    if (activeTab === 'together') {
      return photo.dog_ids?.includes(dog1.id) && photo.dog_ids?.includes(dog2.id);
    }
    return true;
  });

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
        dog_ids: selectedDogIds.length > 0 ? selectedDogIds : null,
        person_id: currentPersonId,
      });

      if (insertError) throw insertError;

      toast.success(t('gallery.uploaded'));
      setShowUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription('');
      setSelectedDogIds([]);
    } catch (err) {
      console.error(err);
      toast.error(t('gallery.upload_error'));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (photo: Photo) => {
    try {
      const urlParts = photo.url.split('/');
      const fileName = urlParts[urlParts.length - 1];

      await supabase.storage.from('dog-photos').remove([fileName]);
      await supabase.from('photos').delete().eq('id', photo.id);
      toast.success(t('gallery.deleted'));
      if (lightboxIndex !== null) setLightboxIndex(null);
    } catch (err) {
      console.error(err);
      toast.error(t('gallery.delete_error'));
    }
  };

  const handleShare = async (photo: Photo) => {
    if (!navigator.share) {
      toast.error(t('gallery.share_error'));
      return;
    }
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const file = new File([blob], 'photo.jpg', { type: blob.type });
      await navigator.share({
        title: 'MyGirls',
        text: photo.description || undefined,
        files: [file],
      });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        // Fallback to URL sharing
        try {
          await navigator.share({
            title: 'MyGirls',
            text: photo.description || undefined,
            url: photo.url,
          });
        } catch {
          toast.error(t('gallery.share_error'));
        }
      }
    }
  };

  const lightboxPhoto = lightboxIndex !== null ? filteredPhotos[lightboxIndex] : null;

  const goLightbox = (dir: number) => {
    if (lightboxIndex === null) return;
    const next = lightboxIndex + dir;
    if (next >= 0 && next < filteredPhotos.length) setLightboxIndex(next);
  };

  const tabs = [
    { id: 'all_dog_1' as GalleryTab, label: dog1?.name || 'Dog 1', avatar: dog1?.avatarUrl },
    { id: 'together' as GalleryTab, label: t('gallery.together'), avatars: [dog1?.avatarUrl, dog2?.avatarUrl] },
    { id: 'all_dog_2' as GalleryTab, label: dog2?.name || 'Dog 2', avatar: dog2?.avatarUrl },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="pt-12 pb-4 px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t('gallery.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('gallery.subtitle')}</p>
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

      {/* Sub-tabs */}
      <div className="px-6 mb-4">
        <div className="flex gap-1 p-1 bg-muted rounded-2xl">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              {tab.id === 'together' ? (
                <div className="flex -space-x-1">
                  {tab.avatars?.map((av, i) => av ? (
                    <img key={i} src={av} className="w-5 h-5 rounded-full border border-card" alt="" />
                  ) : null)}
                </div>
              ) : tab.avatar ? (
                <img src={tab.avatar} className="w-5 h-5 rounded-full" alt="" />
              ) : null}
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="px-1">
        {loading ? (
          <div className="grid grid-cols-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 px-6">
            <p className="text-5xl mb-4">📷</p>
            <p className="text-muted-foreground">{t('gallery.empty')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-0.5">
            {filteredPhotos.map((photo, index) => (
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
                  alt={photo.description || ''}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                {photo.dog_ids && photo.dog_ids.length > 0 && (
                  <div className="absolute top-1.5 right-1.5 flex -space-x-1">
                    {photo.dog_ids.map(dogId => {
                      const dog = dogs.find(d => d.id === dogId);
                      return dog?.avatarUrl ? (
                        <img key={dogId} src={dog.avatarUrl} className="w-5 h-5 rounded-full border border-white/80" alt="" />
                      ) : null;
                    })}
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
            <DialogTitle>{t('gallery.new_photo')}</DialogTitle>
            <DialogClose className="absolute right-0 top-0">
              <X className="w-5 h-5" />
            </DialogClose>
          </DialogHeader>

          {previewUrl && (
            <div className="rounded-xl overflow-hidden max-h-[40vh]">
              <img src={previewUrl} alt="" className="w-full h-full object-contain" />
            </div>
          )}

          <Input
            placeholder={t('gallery.description_placeholder')}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex gap-2">
            {dogs.map(dog => (
              <motion.button
                key={dog.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDogIds(prev =>
                  prev.includes(dog.id) ? prev.filter(id => id !== dog.id) : [...prev, dog.id]
                )}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDogIds.includes(dog.id)
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
            {uploading ? t('gallery.uploading') : t('gallery.upload')}
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
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                  onClick={() => handleShare(lightboxPhoto)}
                >
                  <Share2 className="w-5 h-5" />
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
              {lightboxIndex! < filteredPhotos.length - 1 && (
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
            <div className="pb-6 px-4 text-center" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
                {lightboxPhoto.dog_ids && lightboxPhoto.dog_ids.length > 0 && (
                  <span>{lightboxPhoto.dog_ids.map(id => dogs.find(d => d.id === id)?.name).filter(Boolean).join(' & ')}</span>
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
