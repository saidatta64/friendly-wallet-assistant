
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useApp, TransactionType } from '@/contexts/AppContext';

interface AddTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

const AddTransactionDialog: React.FC<AddTransactionDialogProps> = ({ 
  isOpen, 
  onClose,
  userId
}) => {
  const { addTransaction, getUserById } = useApp();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TransactionType>('GIVEN');
  const [amountError, setAmountError] = useState('');
  
  const user = getUserById(userId);
  
  const handleSave = () => {
    // Reset errors
    setAmountError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!amount.trim()) {
      setAmountError('Amount is required');
      isValid = false;
    } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setAmountError('Enter a valid amount');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Add transaction
    addTransaction(userId, parseFloat(amount), type, description.trim());
    
    // Reset form and close dialog
    setAmount('');
    setDescription('');
    setType('GIVEN');
    onClose();
  };

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setAmount('');
      setDescription('');
      setType('GIVEN');
      setAmountError('');
    }
  }, [isOpen]);
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction with {user?.name || ""}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Transaction Type</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as TransactionType)}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="GIVEN" id="given" />
                <Label htmlFor="given" className="cursor-pointer">You gave money</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="TAKEN" id="taken" />
                <Label htmlFor="taken" className="cursor-pointer">You received money</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              className={amountError ? "border-red-500" : ""}
              type="text"
            />
            {amountError && (
              <p className="text-xs text-red-500">{amountError}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="What was this transaction for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>Save Transaction</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
