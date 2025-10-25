import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

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
  balance: number;
  transactions: Transaction[];
}

interface AppContextType {
  users: User[];
  currentUser: User | null;
  currentUserId: string;
  totalToGet: number;
  totalToGive: number;
  loading: boolean;
  setCurrentUserId: (id: string) => void;
  addUser: (name: string, phone: string) => void;
  updateUser: (id: string, name: string, phone: string) => void;
  addTransaction: (userId: string, amount: number, type: TransactionType, description: string) => void;
  updateUserSettings: (name: string, phone: string) => void;
  getUserById: (id: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const SupabaseAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [currentAuthUser, setCurrentAuthUser] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentAuthUser(session.user.id);
        loadContacts(session.user.id);
      } else {
        setLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentAuthUser(session.user.id);
        loadContacts(session.user.id);
      } else {
        setCurrentAuthUser(null);
        setUsers([]);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadContacts = async (userId: string) => {
    try {
      setLoading(true);

      const { data: contacts, error: contactsError } = await supabase
        .from('contacts')
        .select('*')
        .eq('user_id', userId);

      if (contactsError) throw contactsError;

      const { data: transactions, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      if (transactionsError) throw transactionsError;

      const usersWithTransactions = (contacts || []).map(contact => {
        const contactTransactions = (transactions || [])
          .filter(t => t.contact_id === contact.id)
          .map(t => ({
            id: t.id,
            userId: t.contact_id,
            amount: t.amount,
            type: t.type as TransactionType,
            description: t.description || '',
            date: t.date
          }));

        return {
          id: contact.id,
          name: contact.name,
          phone: contact.phone || '',
          balance: contact.balance,
          transactions: contactTransactions
        };
      });

      setUsers(usersWithTransactions);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const addUser = async (name: string, phone: string) => {
    if (!currentAuthUser) {
      toast.error('Please log in first');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('contacts')
        .insert({
          user_id: currentAuthUser,
          name,
          phone,
          balance: 0
        })
        .select()
        .single();

      if (error) throw error;

      const newUser: User = {
        id: data.id,
        name: data.name,
        phone: data.phone || '',
        balance: data.balance,
        transactions: []
      };

      setUsers([...users, newUser]);
      toast.success("New contact added successfully");
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add contact');
    }
  };

  const updateUser = async (id: string, name: string, phone: string) => {
    try {
      const { error } = await supabase
        .from('contacts')
        .update({ name, phone })
        .eq('id', id);

      if (error) throw error;

      setUsers(users.map(user => {
        if (user.id === id) {
          return { ...user, name, phone };
        }
        return user;
      }));

      toast.success("Contact updated successfully");
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update contact');
    }
  };

  const addTransaction = async (userId: string, amount: number, type: TransactionType, description: string) => {
    if (!currentAuthUser) {
      toast.error('Please log in first');
      return;
    }

    try {
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      const newBalance = type === 'GIVEN'
        ? user.balance + amount
        : user.balance - amount;

      const { data: transactionData, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: currentAuthUser,
          contact_id: userId,
          amount,
          type,
          description,
          date: new Date().toISOString()
        })
        .select()
        .single();

      if (transactionError) throw transactionError;

      const { error: balanceError } = await supabase
        .from('contacts')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (balanceError) throw balanceError;

      const newTransaction: Transaction = {
        id: transactionData.id,
        userId: transactionData.contact_id,
        amount: transactionData.amount,
        type: transactionData.type as TransactionType,
        description: transactionData.description || '',
        date: transactionData.date
      };

      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            balance: newBalance,
            transactions: [...user.transactions, newTransaction]
          };
        }
        return user;
      }));

      toast.success(`Transaction of ₹${amount} recorded`);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Failed to add transaction');
    }
  };

  const updateUserSettings = async (name: string, phone: string) => {
    if (!currentAuthUser) {
      toast.error('Please log in first');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name, phone })
        .eq('id', currentAuthUser);

      if (error) throw error;

      toast.success("Settings updated successfully");
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

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
        loading,
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

export const useSupabaseApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useSupabaseApp must be used within a SupabaseAppProvider');
  }
  return context;
};
