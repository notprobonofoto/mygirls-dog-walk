import { useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { StatsScreen } from '@/components/StatsScreen';
import { DogsScreen } from '@/components/DogsScreen';
import { BackdateScreen } from '@/components/BackdateScreen';
import { GalleryScreen } from '@/components/GalleryScreen';
import { BottomNav } from '@/components/BottomNav';
import { PersonSelector } from '@/components/PersonSelector';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { isSelected } = useCurrentUser();

  // Show person selector if no person is selected
  if (!isSelected) {
    return <PersonSelector />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen key="home" />;
      case 'history':
        return <HistoryScreen key="history" />;
      case 'stats':
        return <StatsScreen key="stats" />;
      case 'backdate':
        return <BackdateScreen key="backdate" />;
      case 'gallery':
        return <GalleryScreen key="gallery" />;
      case 'dogs':
        return <DogsScreen key="dogs" />;
      default:
        return <HomeScreen key="home" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
      
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
