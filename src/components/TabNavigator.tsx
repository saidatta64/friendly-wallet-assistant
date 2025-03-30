
import React from 'react';
import { Home, PieChart, Settings, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TabNavigatorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                isActive ? "tab-active" : "text-gray-500"
              )}
              onClick={() => onTabChange(tab.id)}
            >
              <tab.icon 
                className={cn(
                  "h-5 w-5 mb-1",
                  isActive ? "tab-icon-active" : "text-gray-500"
                )} 
              />
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TabNavigator;
