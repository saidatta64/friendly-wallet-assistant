
import React, { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CalendarTab = () => {
  const { users, addTransaction } = useApp();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  
  // Get transactions for the selected date
  const getDailyTransactions = () => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    let dailyTransactions: Array<{
      id: string;
      userId: string;
      userName: string;
      amount: number;
      type: string;
      description: string;
    }> = [];
    
    users.forEach(user => {
      user.transactions.forEach(transaction => {
        const transactionDate = transaction.date.substring(0, 10);
        if (transactionDate === formattedDate) {
          dailyTransactions.push({
            id: transaction.id,
            userId: user.id,
            userName: user.name,
            amount: transaction.amount,
            type: transaction.type,
            description: transaction.description
          });
        }
      });
    });
    
    return dailyTransactions;
  };
  
  const dailyTransactions = getDailyTransactions();
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };
  
  const openAddTransactionDrawer = () => {
    if (!selectedDate) {
      toast.error("Please select a date first");
      return;
    }
    
    setAmount('');
    setDescription('');
    setType('INCOME');
    setSelectedUserId(users.length > 0 ? users[0].id : '');
    setIsDrawerOpen(true);
  };
  
  const handleAddTransaction = () => {
    if (!selectedUserId) {
      toast.error("Please select a user");
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    // Convert INCOME/EXPENSE to the app's GIVEN/TAKEN transaction types
    const transactionType = type === 'INCOME' ? 'TAKEN' : 'GIVEN';
    
    addTransaction(
      selectedUserId, 
      parseFloat(amount), 
      transactionType, 
      description || `${type} on ${format(selectedDate!, 'PP')}`
    );
    
    setIsDrawerOpen(false);
    toast.success(`${type.toLowerCase()} of ₹${amount} recorded`);
  };
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-4">Calendar</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          className="mx-auto"
        />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {selectedDate ? format(selectedDate, 'PP') : 'Select a date'}
        </h2>
        <Button onClick={openAddTransactionDrawer}>Add Transaction</Button>
      </div>
      
      {dailyTransactions.length > 0 ? (
        <div className="space-y-3">
          {dailyTransactions.map(transaction => (
            <div 
              key={transaction.id} 
              className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-l-solid border-l-primary"
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium">{transaction.userName}</span>
                <span className={transaction.type === 'TAKEN' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'TAKEN' ? '+' : '-'}₹{transaction.amount}
                </span>
              </div>
              {transaction.description && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.description}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No transactions on this date
        </div>
      )}
      
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Add Transaction for {selectedDate ? format(selectedDate, 'PP') : ''}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 py-2 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type</Label>
              <RadioGroup 
                value={type} 
                onValueChange={(val) => setType(val as 'INCOME' | 'EXPENSE')}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="INCOME" id="income" />
                  <Label htmlFor="income">Income</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EXPENSE" id="expense" />
                  <Label htmlFor="expense">Expense</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="user">Select User</Label>
              <select 
                id="user" 
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ''))}
              />
            </div>
            
            <div className="space-y-2">
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
          <DrawerFooter>
            <Button onClick={handleAddTransaction}>Save Transaction</Button>
            <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default CalendarTab;
