import React from 'react';
import { format } from 'date-fns';
import { Transaction } from '@/contexts/AppContext';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatTransactionViewProps {
  transactions: Transaction[];
  userName: string;
}

const ChatTransactionView: React.FC<ChatTransactionViewProps> = ({ transactions, userName }) => {
  const sortedTransactions = transactions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="space-y-4 py-4">
      {sortedTransactions.map((transaction) => {
        const isGiven = transaction.type === 'GIVEN';

        return (
          <div
            key={transaction.id}
            className={cn(
              "flex",
              isGiven ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-2xl p-3 shadow-sm",
                isGiven
                  ? "bg-red-50 border border-red-100"
                  : "bg-green-50 border border-green-100"
              )}
            >
              <div className="flex items-start gap-2 mb-1">
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                  isGiven ? "bg-red-500" : "bg-green-500"
                )}>
                  {isGiven ? (
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className={cn(
                    "text-xl font-bold mb-1",
                    isGiven ? "text-red-700" : "text-green-700"
                  )}>
                    ₹ {transaction.amount}
                  </div>
                  {transaction.description && (
                    <div className="text-sm text-gray-700 mb-1">
                      {transaction.description}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {format(new Date(transaction.date), 'dd MMM yyyy')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {transactions.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No transactions yet
        </div>
      )}
    </div>
  );
};

export default ChatTransactionView;
