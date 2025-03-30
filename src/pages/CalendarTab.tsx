
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface CalendarTransaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
}

const CalendarTab = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [transactions, setTransactions] = useState<CalendarTransaction[]>([]);
  
  // Load transactions from localStorage on component mount
  useEffect(() => {
    const storedTransactions = localStorage.getItem('calendarTransactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);
  
  // Save transactions to localStorage when they change
  useEffect(() => {
    localStorage.setItem('calendarTransactions', JSON.stringify(transactions));
  }, [transactions]);
  
  // Get transactions for the selected date
  const getDailyTransactions = () => {
    if (!selectedDate) return [];
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    return transactions.filter(transaction => 
      transaction.date.substring(0, 10) === formattedDate
    );
  };
  
  // Calculate total balance
  const calculateTotalBalance = () => {
    return transactions.reduce((total, transaction) => {
      if (transaction.type === 'INCOME') {
        return total + transaction.amount;
      } else {
        return total - transaction.amount;
      }
    }, 0);
  };
  
  const dailyTransactions = getDailyTransactions();
  const totalBalance = calculateTotalBalance();
  
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
    setIsDrawerOpen(true);
  };
  
  const handleAddTransaction = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const newTransaction: CalendarTransaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      description: description || `${type} on ${format(selectedDate!, 'PP')}`,
      date: selectedDate!.toISOString()
    };
    
    setTransactions([...transactions, newTransaction]);
    setIsDrawerOpen(false);
    toast.success(`${type.toLowerCase()} of ₹${amount} recorded`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    toast.success("Transaction deleted successfully");
  };
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-4">Money Calendar</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
        <div className={`p-4 rounded-lg ${totalBalance >= 0 ? 'bg-green-50 dark:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/30'} mb-4`}>
          <p className="text-sm font-medium">Total Balance</p>
          <p className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            ₹{totalBalance.toFixed(2)}
          </p>
        </div>
        
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
              className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 ${
                transaction.type === 'INCOME' 
                  ? 'border-l-green-500' 
                  : 'border-l-red-500'
              }`}
            >
              <div className="flex justify-between mb-1">
                <span className="font-medium">{transaction.type}</span>
                <div className="flex items-center gap-3">
                  <span className={transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'INCOME' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => handleDeleteTransaction(transaction.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
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
