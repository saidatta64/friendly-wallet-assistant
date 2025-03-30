
import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/contexts/AppContext';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionItemProps {
  transaction: Transaction;
}

const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const isGiven = transaction.type === 'GIVEN';
  const date = new Date(transaction.date);
  
  return (
    <div className="flex items-center p-3 my-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-full mr-3",
        isGiven ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" : "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300"
      )}>
        {isGiven ? (
          <ArrowUpRight className="h-5 w-5" />
        ) : (
          <ArrowDownRight className="h-5 w-5" />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {isGiven ? 'You gave' : 'You received'}
          </h4>
          <span className={cn(
            "font-semibold",
            isGiven ? "text-blue-600 dark:text-blue-400" : "text-green-600 dark:text-green-400"
          )}>
            ₹{transaction.amount}
          </span>
        </div>
        
        {transaction.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {transaction.description}
          </p>
        )}
        
        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {format(date, 'MMM d, yyyy • h:mm a')}
        </p>
      </div>
    </div>
  );
};

export default TransactionItem;
