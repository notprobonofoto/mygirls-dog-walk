import { useState } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { HistoryScreen } from '@/components/HistoryScreen';
import { StatsScreen } from '@/components/StatsScreen';
import { DogsScreen } from '@/components/DogsScreen';
import { BackdateScreen } from '@/components/BackdateScreen';
import { GalleryScreen } from '@/components/GalleryScreen';
import { SettingsScreen } from '@/components/SettingsScreen';
import { BottomNav } from '@/components/BottomNav';
import { PersonSelector } from '@/components/PersonSelector';
import { PasswordGate } from '@/components/PasswordGate';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useApp } from '@/contexts/AppContext';
import { AnimatePresence, motion } from 'framer-motion';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { isSelected } = useCurrentUser();
  const { isUnlocked, passwordLoading } = useApp();

  // Loading password state
  if (passwordLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-5xl"
        >
          🐾
        </motion.div>
      </div>
    );
  }

  // Password gate
  if (!isUnlocked) {
    return <PasswordGate />;
  }

  // Show person selector if no person is selected
  if (!isSelected) {
    return <PersonSelector />;
  }

  // Settings screen
  if (activeTab === 'settings') {
    return (
      <>
        <SettingsScreen onClose={() => setActiveTab('home')} />
        <BottomNav activeTab="home" onTabChange={setActiveTab} />
      </>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen key="home" onOpenSettings={() => setActiveTab('settings')} />;
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
        return <HomeScreen key="home" onOpenSettings={() => setActiveTab('settings')} />;
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
