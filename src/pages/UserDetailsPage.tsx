
import React, { useState } from 'react';
import { ArrowLeft, Edit2, Plus, Share } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import TransactionItem from '@/components/TransactionItem';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import AddUserDialog from '@/components/AddUserDialog';
import { toast } from "sonner";

interface UserDetailsPageProps {
  userId: string;
  onBack: () => void;
}

const UserDetailsPage: React.FC<UserDetailsPageProps> = ({ userId, onBack }) => {
  const { getUserById } = useApp();
  const user = getUserById(userId);
  
  const [isAddTransactionDialogOpen, setIsAddTransactionDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">User not found</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }
  
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${user.name}, according to my records${user.balance > 0 ? 
        ` you owe me ₹${user.balance}` : 
        user.balance < 0 ? 
        ` I owe you ₹${Math.abs(user.balance)}` : 
        ` we are settled up`}.`
    );
    
    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/${user.phone}?text=${message}`, '_blank');
  };
  
  const handleShareSMS = () => {
    const message = encodeURIComponent(
      `Hi ${user.name}, according to my records${user.balance > 0 ? 
        ` you owe me ₹${user.balance}` : 
        user.balance < 0 ? 
        ` I owe you ₹${Math.abs(user.balance)}` : 
        ` we are settled up`}.`
    );
    
    // Try to open native SMS app
    window.open(`sms:${user.phone}?body=${message}`, '_blank');
    
    // If native SMS app doesn't open, show a toast notification
    setTimeout(() => {
      toast("If SMS didn't open, your device may not support SMS links");
    }, 1000);
  };
  
  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{user.name}</h1>
          <p className="text-sm text-gray-500">{user.phone}</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setIsEditUserDialogOpen(true)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Balance card */}
      <div className="p-6 mb-6 rounded-xl balance-card text-white text-center">
        <p className="text-sm font-medium opacity-90 mb-1">
          {user.balance >= 0 ? 'You will get' : 'You will give'}
        </p>
        <p className="text-3xl font-bold mb-2">
          ₹{Math.abs(user.balance).toFixed(2)}
        </p>
      </div>
      
      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3"
          onClick={() => setIsAddTransactionDialogOpen(true)}
        >
          <Plus className="h-5 w-5 mb-1" />
          <span className="text-xs">Add</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3"
          onClick={handleShareWhatsApp}
        >
          <Share className="h-5 w-5 mb-1" />
          <span className="text-xs">WhatsApp</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="flex flex-col items-center py-3"
          onClick={handleShareSMS}
        >
          <Share className="h-5 w-5 mb-1" />
          <span className="text-xs">SMS</span>
        </Button>
      </div>
      
      {/* Transactions list */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Transactions</h2>
        
        {user.transactions.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No transactions yet
          </div>
        ) : (
          <div className="space-y-2">
            {user.transactions
              .slice() // Create a copy to avoid mutating the original
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date (newest first)
              .map(transaction => (
                <TransactionItem 
                  key={transaction.id} 
                  transaction={transaction} 
                />
              ))
            }
          </div>
        )}
      </div>
      
      {/* Dialogs */}
      <AddTransactionDialog
        isOpen={isAddTransactionDialogOpen}
        onClose={() => setIsAddTransactionDialogOpen(false)}
        userId={userId}
      />
      
      <AddUserDialog
        isOpen={isEditUserDialogOpen}
        onClose={() => setIsEditUserDialogOpen(false)}
        editingUser={{
          id: user.id,
          name: user.name,
          phone: user.phone
        }}
      />
    </div>
  );
};

export default UserDetailsPage;
