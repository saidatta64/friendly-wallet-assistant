
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  Switch,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { useApp } from '../contexts/AppContext';
import { Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const SettingsScreen = () => {
  const { updateUserSettings } = useApp();
  const systemColorScheme = useColorScheme();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  
  // Load settings from AsyncStorage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedSettings = await AsyncStorage.getItem('khataSettings');
        if (storedSettings) {
          const settings = JSON.parse(storedSettings);
          setName(settings.userName || '');
          setPhone(settings.userPhone || '');
          
          // Load theme preference if available
          const themePreference = await AsyncStorage.getItem('themePreference');
          if (themePreference) {
            setIsDarkMode(themePreference === 'dark');
          }
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  const handleSave = () => {
    // Reset errors
    setNameError('');
    setPhoneError('');
    
    // Validate inputs
    let isValid = true;
    
    if (!name.trim()) {
      setNameError('Name is required');
      isValid = false;
    }
    
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^\d{10}$/.test(phone.trim())) {
      setPhoneError('Enter a valid 10-digit phone number');
      isValid = false;
    }
    
    if (!isValid) return;
    
    // Update settings
    updateUserSettings(name.trim(), phone.trim());
    alert('Settings updated successfully');
  };
  
  const toggleTheme = () => {
    const newThemeValue = !isDarkMode;
    setIsDarkMode(newThemeValue);
    AsyncStorage.setItem('themePreference', newThemeValue ? 'dark' : 'light');
    // In a real app, we would update the app theme here
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Settings</Text>
        
        <Card style={styles.card}>
          <Card.Title title="Theme" subtitle="Customize your app appearance" />
          <Card.Content>
            <View style={styles.themeRow}>
              <View style={styles.themeOption}>
                <Ionicons name="sunny" size={20} color="#f59e0b" />
                <Text style={styles.themeText}>Light Mode</Text>
              </View>
              
              <Switch
                value={isDarkMode}
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: "#3b82f6" }}
              />
              
              <View style={styles.themeOption}>
                <Text style={styles.themeText}>Dark Mode</Text>
                <Ionicons name="moon" size={20} color="#3b82f6" />
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Title title="User Profile" subtitle="Update your personal information" />
          <Card.Content>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Name</Text>
              <View style={styles.inputWithIcon}>
                <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Your Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 10))}
                keyboardType="phone-pad"
              />
              {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
            </View>
            
            <Button
              mode="contained"
              onPress={handleSave}
              style={styles.saveButton}
              icon="content-save-outline"
            >
              Save Changes
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Title title="About" subtitle="Application information" />
          <Card.Content>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>App Name:</Text>
              <Text style={styles.aboutValue}>Friendly Wallet Assistant</Text>
            </View>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Version:</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Made with:</Text>
              <Text style={styles.aboutValue}>React Native, Expo</Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  card: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeText: {
    marginHorizontal: 8,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  inputIcon: {
    marginLeft: 12,
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 8,
  },
  aboutItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  aboutLabel: {
    fontWeight: '500',
    marginRight: 8,
    color: '#64748b',
  },
  aboutValue: {
    color: '#334155',
  },
});

export default SettingsScreen;
