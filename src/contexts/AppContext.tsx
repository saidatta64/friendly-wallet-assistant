
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";

export type TransactionType = 'GIVEN' | 'TAKEN';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: TransactionType;
  description: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  balance: number; // positive means they owe you, negative means you owe them
  transactions: Transaction[];
}

interface AppContextType {
  users: User[];
  currentUser: User | null;
  currentUserId: string;
  totalToGet: number;
  totalToGive: number;
  setCurrentUserId: (id: string) => void;
  addUser: (name: string, phone: string) => void;
  updateUser: (id: string, name: string, phone: string) => void;
  addTransaction: (userId: string, amount: number, type: TransactionType, description: string) => void;
  updateUserSettings: (name: string, phone: string) => void;
  getUserById: (id: string) => User | undefined;
}

const defaultAppSettings = {
  userName: '',
  userPhone: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [appSettings, setAppSettings] = useState(defaultAppSettings);
  
  // Load data from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('khataUsers');
    const storedSettings = localStorage.getItem('khataSettings');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (storedSettings) {
      setAppSettings(JSON.parse(storedSettings));
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('khataUsers', JSON.stringify(users));
  }, [users]);
  
  useEffect(() => {
    localStorage.setItem('khataSettings', JSON.stringify(appSettings));
  }, [appSettings]);
  
  const addUser = (name: string, phone: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      phone,
      balance: 0,
      transactions: []
    };
    
    setUsers([...users, newUser]);
    toast.success("New contact added successfully");
  };
  
  const updateUser = (id: string, name: string, phone: string) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, name, phone };
      }
      return user;
    }));
    toast.success("Contact updated successfully");
  };
  
  const addTransaction = (userId: string, amount: number, type: TransactionType, description: string) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId,
      amount,
      type,
      description,
      date: new Date().toISOString()
    };
    
    setUsers(users.map(user => {
      if (user.id === userId) {
        // Update balance - GIVEN means they owe you, TAKEN means you owe them
        const newBalance = type === 'GIVEN' 
          ? user.balance + amount 
          : user.balance - amount;
        
        return {
          ...user,
          balance: newBalance,
          transactions: [...user.transactions, transaction]
        };
      }
      return user;
    }));
    
    toast.success(`Transaction of ₹${amount} recorded`);
  };
  
  const updateUserSettings = (name: string, phone: string) => {
    setAppSettings({
      userName: name,
      userPhone: phone
    });
    toast.success("Settings updated successfully");
  };
  
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };
  
  // Calculate total to get/give
  const totalToGet = users.reduce((acc, user) => {
    return user.balance > 0 ? acc + user.balance : acc;
  }, 0);
  
  const totalToGive = users.reduce((acc, user) => {
    return user.balance < 0 ? acc + Math.abs(user.balance) : acc;
  }, 0);
  
  return (
    <AppContext.Provider
      value={{
        users,
        currentUser: currentUserId ? getUserById(currentUserId) : null,
        currentUserId,
        totalToGet,
        totalToGive,
        setCurrentUserId,
        addUser,
        updateUser,
        addTransaction,
        updateUserSettings,
        getUserById
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
