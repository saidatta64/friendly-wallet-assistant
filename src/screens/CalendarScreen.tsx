
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Button, Card, RadioButton, Modal, Portal, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalendarTransaction {
  id: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
}

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME');
  const [transactions, setTransactions] = useState<CalendarTransaction[]>([]);
  
  // Load transactions from AsyncStorage on component mount
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('calendarTransactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
      }
    };
    
    loadTransactions();
  }, []);
  
  // Save transactions to AsyncStorage when they change
  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('calendarTransactions', JSON.stringify(transactions));
      } catch (error) {
        console.error('Error saving transactions:', error);
      }
    };
    
    saveTransactions();
  }, [transactions]);
  
  // Get transactions for the selected date
  const getDailyTransactions = () => {
    return transactions.filter(transaction => 
      transaction.date.substring(0, 10) === selectedDate
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
  
  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };
  
  const handleAddTransaction = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    
    const newTransaction: CalendarTransaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      type,
      description: description || `${type} on ${selectedDate}`,
      date: new Date(selectedDate).toISOString()
    };
    
    setTransactions([...transactions, newTransaction]);
    setIsModalVisible(false);
    setAmount('');
    setDescription('');
    alert(`${type.toLowerCase()} of ₹${amount} recorded`);
  };
  
  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
    alert("Transaction deleted successfully");
  };
  
  // Generate marked dates for the calendar
  const markedDates = {};
  transactions.forEach(transaction => {
    const dateStr = transaction.date.substring(0, 10);
    if (!markedDates[dateStr]) {
      markedDates[dateStr] = { marked: true };
    }
  });
  
  // Highlight the selected date
  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: '#3b82f6',
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Money Calendar</Text>
      
      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text style={styles.balanceTitle}>Total Balance</Text>
          <Text style={[
            styles.balanceAmount,
            totalBalance >= 0 ? styles.positiveAmount : styles.negativeAmount
          ]}>
            ₹{totalBalance.toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
      
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDateSelect}
          markedDates={markedDates}
          theme={{
            todayTextColor: '#3b82f6',
            selectedDayBackgroundColor: '#3b82f6',
            dotColor: '#3b82f6',
          }}
          enableSwipeMonths={true}
        />
      </View>
      
      <View style={styles.transactionHeader}>
        <Text style={styles.dateText}>{new Date(selectedDate).toDateString()}</Text>
        <Button mode="contained" onPress={() => setIsModalVisible(true)}>
          Add Transaction
        </Button>
      </View>
      
      {dailyTransactions.length > 0 ? (
        <FlatList
          data={dailyTransactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={[
              styles.transactionCard,
              item.type === 'INCOME' ? styles.incomeCard : styles.expenseCard
            ]}>
              <Card.Content style={styles.transactionContent}>
                <View style={styles.transactionInfo}>
                  <Text style={styles.transactionType}>{item.type}</Text>
                  <Text style={styles.transactionDesc}>{item.description}</Text>
                </View>
                <View style={styles.transactionAmount}>
                  <Text style={item.type === 'INCOME' ? styles.incomeText : styles.expenseText}>
                    {item.type === 'INCOME' ? '+' : '-'}₹{item.amount.toFixed(2)}
                  </Text>
                  <IconButton
                    icon="trash-outline"
                    iconColor="#ff4d4f"
                    size={18}
                    onPress={() => handleDeleteTransaction(item.id)}
                  />
                </View>
              </Card.Content>
            </Card>
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No transactions on this date</Text>
        </View>
      )}
      
      <Portal>
        <Modal
          visible={isModalVisible}
          onDismiss={() => setIsModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add Transaction for {new Date(selectedDate).toDateString()}</Text>
          
          <RadioButton.Group onValueChange={(value) => setType(value as 'INCOME' | 'EXPENSE')} value={type}>
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton value="INCOME" />
                <Text>Income</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="EXPENSE" />
                <Text>Expense</Text>
              </View>
            </View>
          </RadioButton.Group>
          
          <TextInput
            style={styles.input}
            placeholder="Amount (₹)"
            value={amount}
            onChangeText={(text) => setAmount(text.replace(/[^\d.]/g, ''))}
            keyboardType="numeric"
          />
          
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description (Optional)"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />
          
          <View style={styles.modalButtons}>
            <Button mode="outlined" onPress={() => setIsModalVisible(false)} style={styles.button}>
              Cancel
            </Button>
            <Button mode="contained" onPress={handleAddTransaction} style={styles.button}>
              Save
            </Button>
          </View>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  balanceCard: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  balanceTitle: {
    fontSize: 14,
    color: '#666',
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  positiveAmount: {
    color: '#22c55e',
  },
  negativeAmount: {
    color: '#ef4444',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '500',
  },
  transactionCard: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  incomeCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  expenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionDesc: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeText: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  expenseText: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 4,
  },
});

export default CalendarScreen;
