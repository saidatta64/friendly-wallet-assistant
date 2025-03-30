
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserCard from '@/components/UserCard';
import AddUserDialog from '@/components/AddUserDialog';

interface HomeTabProps {
  onUserClick: (userId: string) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ onUserClick }) => {
  const { users, totalToGet, totalToGive } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );
  
  return (
    <div className="pb-20">
      {/* Balance cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-green-500 text-white shadow-md">
          <p className="text-xs font-medium opacity-80 mb-1">You'll Get</p>
          <p className="text-xl font-bold">₹{totalToGet.toFixed(2)}</p>
        </div>
        
        <div className="p-4 rounded-xl bg-red-500 text-white shadow-md">
          <p className="text-xs font-medium opacity-80 mb-1">You'll Give</p>
          <p className="text-xl font-bold">₹{totalToGive.toFixed(2)}</p>
        </div>
      </div>
      
      {/* Search and add button */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          size="icon"
          onClick={() => setIsAddUserDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      {/* User list */}
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Contacts</h2>
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No contacts match your search' : 'No contacts yet'}
          </div>
        ) : (
          filteredUsers.map(user => (
            <UserCard
              key={user.id}
              user={user}
              onClick={() => onUserClick(user.id)}
            />
          ))
        )}
      </div>
      
      {/* Add user dialog */}
      <AddUserDialog
        isOpen={isAddUserDialogOpen}
        onClose={() => setIsAddUserDialogOpen(false)}
      />
    </div>
  );
};

export default HomeTab;
