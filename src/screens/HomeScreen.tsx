
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar,
  SafeAreaView,
  TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar, Button, Card, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../contexts/AppContext';

const HomeScreen = () => {
  const { users, totalToGet, totalToGive, addUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const navigation = useNavigation();

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const handleAddUser = () => {
    if (newName.trim() && newPhone.trim()) {
      addUser(newName.trim(), newPhone.trim());
      setNewName('');
      setNewPhone('');
      setIsAddUserDialogOpen(false);
    }
  };

  const handleUserPress = (userId) => {
    navigation.navigate('UserDetails', { userId });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Balance cards */}
      <View style={styles.balanceContainer}>
        <Card style={[styles.balanceCard, styles.getCard]}>
          <Card.Content>
            <Text style={styles.balanceLabel}>You'll Get</Text>
            <Text style={styles.balanceValue}>₹{totalToGet.toFixed(2)}</Text>
          </Card.Content>
        </Card>
        
        <Card style={[styles.balanceCard, styles.giveCard]}>
          <Card.Content>
            <Text style={styles.balanceLabel}>You'll Give</Text>
            <Text style={styles.balanceValue}>₹{totalToGive.toFixed(2)}</Text>
          </Card.Content>
        </Card>
      </View>
      
      {/* Search and add button */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search contacts..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <IconButton
          icon="plus"
          size={24}
          onPress={() => setIsAddUserDialogOpen(true)}
          style={styles.addButton}
        />
      </View>
      
      {/* User list */}
      <Text style={styles.contactsHeading}>Contacts</Text>
      
      {filteredUsers.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No contacts match your search' : 'No contacts yet'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleUserPress(item.id)}>
              <Card style={styles.userCard}>
                <Card.Content style={styles.userCardContent}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.userPhone}>{item.phone}</Text>
                  </View>
                  <View style={styles.userBalance}>
                    <Text style={item.balance >= 0 ? styles.positiveBalance : styles.negativeBalance}>
                      ₹{Math.abs(item.balance).toFixed(2)}
                    </Text>
                    <Text style={styles.balanceLabel}>
                      {item.balance >= 0 ? 'You will get' : 'You will give'}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#aaa" />
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
      
      {/* Add User Dialog */}
      {isAddUserDialogOpen && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={newPhone}
              onChangeText={text => setNewPhone(text.replace(/[^0-9]/g, ''))}
              keyboardType="phone-pad"
              maxLength={10}
            />
            
            <View style={styles.buttonRow}>
              <Button 
                mode="outlined" 
                onPress={() => setIsAddUserDialogOpen(false)}
                style={styles.button}
              >
                Cancel
              </Button>
              <Button 
                mode="contained" 
                onPress={handleAddUser}
                style={styles.button}
              >
                Add
              </Button>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  balanceContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  balanceCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 4,
  },
  getCard: {
    backgroundColor: '#4ade80',
  },
  giveCard: {
    backgroundColor: '#f87171',
  },
  balanceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'white',
  },
  addButton: {
    backgroundColor: '#3b82f6',
  },
  contactsHeading: {
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
  userCard: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
  },
  userPhone: {
    fontSize: 14,
    color: '#888',
  },
  userBalance: {
    marginRight: 10,
    alignItems: 'flex-end',
  },
  positiveBalance: {
    color: '#22c55e',
    fontWeight: 'bold',
  },
  negativeBalance: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    margin: 4,
  },
});

export default HomeScreen;
