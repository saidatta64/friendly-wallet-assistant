
import React from 'react';
import { User } from '@/contexts/AppContext';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const isPositiveBalance = user.balance >= 0;
  
  return (
    <div 
      className="flex items-center p-4 my-2 bg-white dark:bg-gray-800 rounded-lg shadow-custom cursor-pointer border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="flex-1">
        <h3 className="font-medium text-gray-900 dark:text-white">{user.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
      </div>
      
      <div className="flex flex-col items-end">
        <span 
          className={cn(
            "font-semibold",
            isPositiveBalance ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}
        >
          {isPositiveBalance ? '₹' + user.balance : '₹' + Math.abs(user.balance)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {isPositiveBalance ? 'You will get' : 'You will give'}
        </span>
      </div>
      
      <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
    </div>
  );
};

export default UserCard;
