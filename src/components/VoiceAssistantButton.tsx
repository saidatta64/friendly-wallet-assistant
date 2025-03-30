
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { voiceAssistant } from '@/utils/VoiceAssistant';
import { useApp } from '@/contexts/AppContext';
import { toast } from "sonner";

const VoiceAssistantButton: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const { users, addTransaction } = useApp();
  
  const toggleVoiceAssistant = () => {
    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceAssistant.startListening((command) => {
        processVoiceCommand(command);
        setIsListening(false);
      });
      
      // Automatically stop after 5 seconds if no command is recognized
      setTimeout(() => {
        if (voiceAssistant.isActive()) {
          voiceAssistant.stopListening();
          setIsListening(false);
          toast.error("No voice command detected. Please try again.");
        }
      }, 5000);
    }
  };
  
  const processVoiceCommand = (command: {
    username: string;
    transactionType: 'given' | 'taken';
    amount: number;
    description?: string;
  }) => {
    // Find user by name
    const user = users.find(
      u => u.name.toLowerCase() === command.username.toLowerCase()
    );
    
    if (!user) {
      toast.error(`User "${command.username}" not found`);
      return;
    }
    
    // Convert to our transaction type
    const transactionType = command.transactionType === 'given' ? 'GIVEN' : 'TAKEN';
    
    // Add the transaction
    addTransaction(
      user.id, 
      command.amount, 
      transactionType, 
      command.description || ''
    );
    
    toast.success(`Transaction added: ${command.amount} ${transactionType.toLowerCase()} ${command.username}`);
  };
  
  return (
    <Button
      variant="outline"
      size="icon"
      className={`rounded-full w-12 h-12 fixed bottom-20 right-4 shadow-lg ${isListening ? 'bg-red-100 text-red-600 animate-pulse-slow border-red-300' : 'bg-primary text-white'}`}
      onClick={toggleVoiceAssistant}
    >
      {isListening ? (
        <MicOff className="h-5 w-5" />
      ) : (
        <Mic className="h-5 w-5" />
      )}
    </Button>
  );
};

export default VoiceAssistantButton;
