
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView,
  Alert,
  Linking
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, Card, IconButton, Modal, Portal, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

interface RouteParams {
  userId: string;
}

const UserDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { userId } = route.params as RouteParams;
  const { getUserById, addTransaction, updateUser } = useApp();
  const user = getUserById(userId);
  
  const [isAddTransactionModalVisible, setIsAddTransactionModalVisible] = useState(false);
  const [isEditUserModalVisible, setIsEditUserModalVisible] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionType, setTransactionType] = useState<'GIVEN' | 'TAKEN'>('GIVEN');
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>User not found</Text>
          <Button 
            mode="outlined" 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }
  
  const handleBackPress = () => {
    navigation.goBack();
  };
  
  const handleAddTransaction = () => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    
    addTransaction(
      userId,
      parseFloat(amount),
      transactionType,
      description || `${transactionType === 'GIVEN' ? 'Given to' : 'Taken from'} ${user.name}`
    );
    
    setAmount('');
    setDescription('');
    setIsAddTransactionModalVisible(false);
  };
  
  const handleEditUser = () => {
    if (!editName.trim()) {
      Alert.alert("Error", "Name is required");
      return;
    }
    
    if (!editPhone.trim() || !/^\d{10}$/.test(editPhone.trim())) {
      Alert.alert("Error", "A valid 10-digit phone number is required");
      return;
    }
    
    updateUser(userId, editName.trim(), editPhone.trim());
    setIsEditUserModalVisible(false);
  };
  
  const handleShareWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi ${user.name}, according to my records${user.balance > 0 ? 
        ` you owe me ₹${user.balance}` : 
        user.balance < 0 ? 
        ` I owe you ₹${Math.abs(user.balance)}` : 
        ` we are settled up`}.`
    );
    
    Linking.openURL(`whatsapp://send?phone=${user.phone}&text=${message}`)
      .catch(() => {
        Alert.alert(
          "WhatsApp Not Installed",
          "WhatsApp is not installed on your device"
        );
      });
  };
  
  const handleShareSMS = () => {
    const message = encodeURIComponent(
      `Hi ${user.name}, according to my records${user.balance > 0 ? 
        ` you owe me ₹${user.balance}` : 
        user.balance < 0 ? 
        ` I owe you ₹${Math.abs(user.balance)}` : 
        ` we are settled up`}.`
    );
    
    Linking.openURL(`sms:${user.phone}?body=${message}`)
      .catch(() => {
        Alert.alert(
          "Error",
          "Could not open SMS app"
        );
      });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-back-outline"
          size={24}
          onPress={handleBackPress}
        />
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{user.name}</Text>
          <Text style={styles.headerPhone}>{user.phone}</Text>
        </View>
        <IconButton
          icon="create-outline"
          size={24}
          onPress={() => {
            setEditName(user.name);
            setEditPhone(user.phone);
            setIsEditUserModalVisible(true);
          }}
        />
      </View>
      
      {/* Balance card */}
      <Card 
        style={[
          styles.balanceCard,
          user.balance >= 0 ? styles.positiveBalanceCard : styles.negativeBalanceCard
        ]}
      >
        <Card.Content style={styles.balanceCardContent}>
          <Text style={styles.balanceLabel}>
            {user.balance >= 0 ? 'You will get' : 'You will give'}
          </Text>
          <Text style={styles.balanceAmount}>
            ₹{Math.abs(user.balance).toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
      
      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsAddTransactionModalVisible(true)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#3b82f6" />
          <Text style={styles.actionButtonText}>Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShareWhatsApp}
        >
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          <Text style={styles.actionButtonText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShareSMS}
        >
          <Ionicons name="chatbubble-outline" size={24} color="#3b82f6" />
          <Text style={styles.actionButtonText}>SMS</Text>
        </TouchableOpacity>
      </View>
      
      {/* Transactions list */}
      <Text style={styles.sectionTitle}>Transactions</Text>
      
      {user.transactions.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No transactions yet</Text>
        </View>
      ) : (
        <FlatList
          data={[...user.transactions].sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.transactionCard}>
              <Card.Content>
                <View style={styles.transactionHeader}>
                  <View>
                    <Text style={styles.transactionType}>
                      {item.type === 'GIVEN' ? 'You gave' : 'You received'}
                    </Text>
                    <Text style={styles.transactionDesc}>{item.description}</Text>
                  </View>
                  <Text 
                    style={[
                      styles.transactionAmount,
                      item.type === 'GIVEN' ? styles.givenAmount : styles.takenAmount
                    ]}
                  >
                    ₹{item.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.transactionDate}>
                  {new Date(item.date).toLocaleString()}
                </Text>
              </Card.Content>
            </Card>
          )}
        />
      )}
      
      {/* Add Transaction Modal */}
      <Portal>
        <Modal
          visible={isAddTransactionModalVisible}
          onDismiss={() => setIsAddTransactionModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add Transaction</Text>
          
          <RadioButton.Group 
            onValueChange={(value) => setTransactionType(value as 'GIVEN' | 'TAKEN')} 
            value={transactionType}
          >
            <View style={styles.radioGroup}>
              <View style={styles.radioButton}>
                <RadioButton value="GIVEN" />
                <Text>You Gave (They Owe You)</Text>
              </View>
              <View style={styles.radioButton}>
                <RadioButton value="TAKEN" />
                <Text>You Received (You Owe Them)</Text>
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
            <Button 
              mode="outlined" 
              onPress={() => setIsAddTransactionModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleAddTransaction}
              style={styles.modalButton}
            >
              Add Transaction
            </Button>
          </View>
        </Modal>
      </Portal>
      
      {/* Edit User Modal */}
      <Portal>
        <Modal
          visible={isEditUserModalVisible}
          onDismiss={() => setIsEditUserModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Edit Contact</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={editName}
            onChangeText={setEditName}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={editPhone}
            onChangeText={(text) => setEditPhone(text.replace(/\D/g, '').slice(0, 10))}
            keyboardType="phone-pad"
          />
          
          <View style={styles.modalButtons}>
            <Button 
              mode="outlined" 
              onPress={() => setIsEditUserModalVisible(false)}
              style={styles.modalButton}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleEditUser}
              style={styles.modalButton}
            >
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  headerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerPhone: {
    fontSize: 14,
    color: '#666',
  },
  balanceCard: {
    marginBottom: 16,
  },
  positiveBalanceCard: {
    backgroundColor: '#22c55e',
  },
  negativeBalanceCard: {
    backgroundColor: '#ef4444',
  },
  balanceCardContent: {
    alignItems: 'center',
    padding: 16,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
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
  transactionCard: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  transactionType: {
    fontWeight: '500',
    fontSize: 16,
  },
  transactionDesc: {
    fontSize: 14,
    color: '#666',
  },
  transactionAmount: {
    fontWeight: 'bold',
  },
  givenAmount: {
    color: '#ef4444',
  },
  takenAmount: {
    color: '#22c55e',
  },
  transactionDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  backButton: {
    width: 120,
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
    marginBottom: 16,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
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
  modalButton: {
    flex: 1,
    margin: 4,
  },
});

export default UserDetailsScreen;
