
import React, { useState, useEffect } from 'react';
import { User, Save, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';

const SettingsTab: React.FC = () => {
  const { updateUserSettings } = useApp();
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  // Load settings from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('khataSettings');
    if (storedSettings) {
      const settings = JSON.parse(storedSettings);
      setName(settings.userName || '');
      setPhone(settings.userPhone || '');
    }
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
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Theme</CardTitle>
          <CardDescription>Customize your app appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5 text-yellow-500" />
              <span>Light Mode</span>
            </div>
            <Switch 
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
            <div className="flex items-center space-x-2">
              <span>Dark Mode</span>
              <Moon className="h-5 w-5 text-blue-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="Enter your name"
                  className="pl-9"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {nameError && (
                <p className="text-xs text-red-500">{nameError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Your Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter your 10-digit phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                type="tel"
              />
              {phoneError && (
                <p className="text-xs text-red-500">{phoneError}</p>
              )}
            </div>
            
            <Button 
              className="w-full"
              onClick={handleSave}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>Application information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>App Name:</strong> Friendly Wallet Assistant
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Version:</strong> 1.0.0
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Made with:</strong> React, TypeScript, Tailwind CSS
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsTab;
