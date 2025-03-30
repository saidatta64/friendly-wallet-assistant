
// This is a mock implementation of a voice assistant
// In a real implementation, you would integrate with Web Speech API or another speech recognition service

type VoiceCommand = {
  username: string;
  transactionType: 'given' | 'taken';
  amount: number;
  description?: string;
};

class VoiceAssistant {
  private isListening: boolean = false;
  private callback: ((command: VoiceCommand) => void) | null = null;
  
  startListening(callback: (command: VoiceCommand) => void) {
    if (this.isListening) {
      return;
    }
    
    this.isListening = true;
    this.callback = callback;
    
    // In a real implementation, you would set up speech recognition here
    console.log('Voice assistant started listening');
    
    // Simulate processing in a real implementation
    setTimeout(() => {
      this.stopListening();
    }, 5000);
  }
  
  stopListening() {
    if (!this.isListening) {
      return;
    }
    
    this.isListening = false;
    console.log('Voice assistant stopped listening');
  }
  
  // This would be called by the speech recognition API in a real implementation
  processVoiceInput(transcription: string) {
    if (!this.isListening || !this.callback) {
      return;
    }
    
    // Example of parsing a voice command
    // In a real app, this would be much more sophisticated
    try {
      // Example format: "Rahul given 500 for lunch"
      const parts = transcription.toLowerCase().split(' ');
      
      if (parts.length < 3) {
        throw new Error('Invalid command format');
      }
      
      const username = parts[0];
      const transactionType = parts[1] as 'given' | 'taken';
      const amount = parseFloat(parts[2]);
      
      if (isNaN(amount)) {
        throw new Error('Invalid amount');
      }
      
      if (transactionType !== 'given' && transactionType !== 'taken') {
        throw new Error('Transaction type must be "given" or "taken"');
      }
      
      // Extract description if available
      const description = parts.length > 4 && parts[3] === 'for' 
        ? parts.slice(4).join(' ')
        : '';
      
      this.callback({
        username,
        transactionType,
        amount,
        description
      });
    } catch (error) {
      console.error('Error processing voice command:', error);
    }
  }
  
  isActive() {
    return this.isListening;
  }
}

// Export a singleton instance
export const voiceAssistant = new VoiceAssistant();
