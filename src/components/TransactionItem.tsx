
import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isGiven = transaction.type === 'GIVEN';
  const date = new Date(transaction.date);
  
  return (
    <div className={cn(
      "flex mb-3",
      isGiven ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
        isGiven 
          ? "bg-red-50 dark:bg-red-900/20 rounded-br-sm" 
          : "bg-green-50 dark:bg-green-900/20 rounded-bl-sm"
      )}>
        <div className={cn(
          "text-xl font-bold mb-1",
          isGiven ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
        )}>
          ₹{transaction.amount}
        </div>
        
        {transaction.description && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
            {transaction.description}
          </p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {format(date, 'dd MMM yyyy')}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
