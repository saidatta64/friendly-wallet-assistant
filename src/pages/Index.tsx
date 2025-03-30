
import React, { useState, useEffect } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import TabNavigator from '@/components/TabNavigator';
import HomeTab from './HomeTab';
import ReportsTab from './ReportsTab';
import SettingsTab from './SettingsTab';
import CalendarTab from './CalendarTab';
import UserDetailsPage from './UserDetailsPage';
import VoiceAssistantButton from '@/components/VoiceAssistantButton';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  
  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
  };
  
  const handleBackToHome = () => {
    setSelectedUserId(null);
  };
  
  const renderContent = () => {
    if (selectedUserId) {
      return (
        <UserDetailsPage 
          userId={selectedUserId} 
          onBack={handleBackToHome} 
        />
      );
    }
    
    switch (activeTab) {
      case 'home':
        return <HomeTab onUserClick={handleUserClick} />;
      case 'calendar':
        return <CalendarTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <HomeTab onUserClick={handleUserClick} />;
    }
  };
  
  return (
    <AppProvider>
      <div className="container max-w-md mx-auto px-4 py-6">
        {renderContent()}
        
        {!selectedUserId && (
          <TabNavigator 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        )}
        
        <VoiceAssistantButton />
      </div>
    </AppProvider>
  );
};

export default Index;
