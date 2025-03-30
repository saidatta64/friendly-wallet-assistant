
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser?: {
    id: string;
    name: string;
    phone: string;
  } | null;
}

const AddUserDialog: React.FC<AddUserDialogProps> = ({ 
  isOpen, 
  onClose,
  editingUser 
}) => {
  const { addUser, updateUser } = useApp();
  const [name, setName] = useState(editingUser?.name || '');
  const [phone, setPhone] = useState(editingUser?.phone || '');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const handleSave = () => {
    // Reset errors
    setNameError('');
    setPhoneError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.trim())) {
      setPhoneError('Enter a valid 10-digit phone number');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Add/update user
    if (editingUser) {
      updateUser(editingUser.id, name.trim(), phone.trim());
    } else {
      addUser(name.trim(), phone.trim());
    }
    
    // Reset form and close dialog
    setName('');
    setPhone('');
    onClose();
  };

  // Reset form when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setName(editingUser?.name || '');
      setPhone(editingUser?.phone || '');
      setNameError('');
      setPhoneError('');
    }
  }, [isOpen, editingUser]);
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingUser ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={nameError ? "border-red-500" : ""}
            />
            {nameError && (
              <p className="text-xs text-red-500">{nameError}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter 10-digit phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className={phoneError ? "border-red-500" : ""}
              type="tel"
            />
            {phoneError && (
              <p className="text-xs text-red-500">{phoneError}</p>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave}>{editingUser ? 'Update' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
