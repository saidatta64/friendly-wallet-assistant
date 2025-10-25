
import React, { useState } from 'react';
import { ArrowLeft, Edit2, Plus, Phone, MessageCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import ChatTransactionView from '@/components/ChatTransactionView';
import AddTransactionDialog from '@/components/AddTransactionDialog';
import AddUserDialog from '@/components/AddUserDialog';
import { toast } from "sonner";
import { Badge } from '@/components/ui/badge';

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
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">{user.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditUserDialogOpen(true)}
                className="h-6 w-6 text-white hover:bg-white/20"
              >
                <Edit2 className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-xs text-white/80">{user.phone}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShareWhatsApp}
            className="text-white hover:bg-white/20"
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleShareSMS}
            className="text-white hover:bg-white/20"
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>

        {/* Balance Badge */}
        <div className="mt-3 flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
            user.balance >= 0
              ? 'bg-red-500/90'
              : 'bg-green-500/90'
          }`}>
            <ArrowLeft className={`h-4 w-4 ${user.balance >= 0 ? 'rotate-45' : '-rotate-45'}`} />
            <span className="text-sm font-semibold">
              ₹ {Math.abs(user.balance)}
            </span>
          </div>
          <span className="text-xs text-white/80">
            {user.balance >= 0 ? "You'll Get" : "You'll Give"}
          </span>
        </div>
      </div>

      {/* Chat View */}
      <div className="flex-1 overflow-y-auto px-4">
        <ChatTransactionView
          transactions={user.transactions}
          userName={user.name}
        />
      </div>

      {/* Bottom Summary */}
      <div className="bg-white border-t px-4 py-3 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <ArrowDownLeft className="h-3 w-3 mr-1" />
              You've Taken
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              You've Given
            </Badge>
          </div>
        </div>

        <Button
          onClick={() => setIsAddTransactionDialogOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Transaction
        </Button>
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
