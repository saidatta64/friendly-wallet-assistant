
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
  
  // Load data from AsyncStorage on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('khataUsers');
        const storedSettings = await AsyncStorage.getItem('khataSettings');
        
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers));
        }
        
        if (storedSettings) {
          setAppSettings(JSON.parse(storedSettings));
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      }
    };
    
    loadData();
  }, []);
  
  // Save data to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUsers = async () => {
      try {
        await AsyncStorage.setItem('khataUsers', JSON.stringify(users));
      } catch (error) {
        console.error("Error saving users to AsyncStorage:", error);
      }
    };
    
    saveUsers();
  }, [users]);
  
  useEffect(() => {
    const saveSettings = async () => {
      try {
        await AsyncStorage.setItem('khataSettings', JSON.stringify(appSettings));
      } catch (error) {
        console.error("Error saving settings to AsyncStorage:", error);
      }
    };
    
    saveSettings();
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
    Alert.alert("Success", "New contact added successfully");
  };
  
  const updateUser = (id: string, name: string, phone: string) => {
    setUsers(users.map(user => {
      if (user.id === id) {
        return { ...user, name, phone };
      }
      return user;
    }));
    Alert.alert("Success", "Contact updated successfully");
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
    
    Alert.alert("Success", `Transaction of ₹${amount} recorded`);
  };
  
  const updateUserSettings = (name: string, phone: string) => {
    setAppSettings({
      userName: name,
      userPhone: phone
    });
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
