import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { API_URL } from '../src/constants/env';
import { useAuthContext } from '../src/contexts/AuthContext';
import { useFCMToken } from '../src/hooks/Auth/useFCMToken';

export const FCMTest: React.FC = () => {
  const { authState, refreshFCMToken } = useAuthContext();
  const { registerFCMToken, getStoredFCMToken } = useFCMToken();
  const [isRegistered, setIsRegistered] = useState(false);
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('Not tested');

  useEffect(() => {
    if (authState?.token) {
      console.log('JWT Token available:', authState.token);
    }
    loadStoredToken();
  }, [authState?.token]);

  useEffect(() => {
    // Auto-register FCM token when component mounts and user is authenticated
    if (authState?.user_id && authState?.token && !isRegistered) {
      console.log('Auto-registering FCM token on component mount');
      handleTestRegistration();
    }
  }, [authState?.user_id, authState?.token]);

  const loadStoredToken = async () => {
    const token = await getStoredFCMToken();
    setStoredToken(token);
  };

  const handleTestRegistration = async () => {
    if (!authState?.user_id || !authState?.token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setApiStatus('Registering...');
      const { forceUpdateFCMToken } = await import('../src/hooks/Auth/useFCMToken');
      const success = await forceUpdateFCMToken(authState.user_id, authState.token);
      if (success) {
        setIsRegistered(true);
        setApiStatus('Success');
        await loadStoredToken();
        Alert.alert('Success', 'FCM token registered successfully!');
      } else {
        setApiStatus('Failed');
        Alert.alert('Error', 'Failed to register FCM token');
      }
    } catch (error) {
      setApiStatus('Error');
      Alert.alert('Error', 'Error registering FCM token');
    }
  };

  const handleTestAPI = async () => {
    if (!authState?.user_id || !authState?.token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setApiStatus('Testing API...');
      const body = {
        user_id: authState.user_id,
        fcm_token: storedToken
      };
      const response = await axios.post(`${API_URL}/auth/update-fcm-token`, body, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });
      
      console.log('API Test Response:', response.data);
      setApiStatus('API OK');
      
      Alert.alert(`Success`, `FCM token updated successfully: ${response.data.data.fcm_token} with user_id: ${response.data.data.user_id}`);
    } catch (error: any) {
      console.error('API Test Error:', error);
      setApiStatus('API Error');
      Alert.alert('API Error', error.response?.data?.message || error.message);
    }
  };

  const handleCheckFCMStatus = async () => {
    if (!authState?.user_id || !authState?.token) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    try {
      setApiStatus('Checking FCM status...');
      // This would be a new endpoint to check if FCM token is properly registered
      const response = await axios.get(`${API_URL}/auth/fcm-status`, {
        headers: {
          Authorization: `Bearer ${authState.token}`
        }
      });
      
      console.log('FCM Status Response:', response.data);
      setApiStatus('FCM Status OK');
      
      Alert.alert(`FCM Status`, `FCM token is properly registered: ${response.data.message}`);
    } catch (error: any) {
      console.error('FCM Status Error:', error);
      setApiStatus('FCM Status Error');
      Alert.alert('FCM Status Error', error.response?.data?.message || error.message);
    }
  };

  const handleRefreshToken = async () => {
    try {
      await refreshFCMToken();
      await loadStoredToken();
      Alert.alert('Success', 'FCM token refreshed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Error refreshing FCM token');
    }
  };

  const handleClearFCMToken = async () => {
    try {
      await AsyncStorage.removeItem('fcmToken');
      setStoredToken(null);
      setIsRegistered(false);
      Alert.alert('Success', 'FCM token cleared successfully!');
    } catch (error) {
      Alert.alert('Error', 'Error clearing FCM token');
    }
  };

  return (
    <View style={tw`p-5 bg-blue-100 rounded-xl`}>
      <Text style={tw`text-lg font-bold mb-2`}>FCM Test</Text>
      <Text style={tw`text-sm mb-2`}>User ID: {authState?.user_id || 'Not logged in'}</Text>
      <Text style={tw`text-sm mb-2`}>JWT Token: {authState?.token ? 'Available' : 'Not available'}</Text>
      <Text style={tw`text-sm mb-2`}>Status: {isRegistered ? 'Registered' : 'Not registered'}</Text>
      <Text style={tw`text-sm mb-2`}>API Status: {apiStatus}</Text>
      <Text style={tw`text-sm mb-2`}>Stored Token: {storedToken ? 'Present' : 'Not stored'}</Text>
      
      <TouchableOpacity
        style={tw`bg-blue-500 p-3 rounded-lg mt-2`}
        onPress={handleTestRegistration}
        disabled={!authState?.user_id || !authState?.token}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Test FCM Registration
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-purple-500 p-3 rounded-lg mt-2`}
        onPress={handleTestAPI}
        disabled={!authState?.user_id || !authState?.token}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Test API Endpoint
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-red-500 p-3 rounded-lg mt-2`}
        onPress={handleRefreshToken}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Force Refresh FCM Token
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-green-500 p-3 rounded-lg mt-2`}
        onPress={handleTestRegistration}
        disabled={!authState?.user_id || !authState?.token}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Test Manual Registration
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-orange-500 p-3 rounded-lg mt-2`}
        onPress={handleCheckFCMStatus}
        disabled={!authState?.user_id || !authState?.token}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Check FCM Status
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={tw`bg-gray-500 p-3 rounded-lg mt-2`}
        onPress={handleClearFCMToken}
      >
        <Text style={tw`text-white text-center font-bold`}>
          Clear FCM Token
        </Text>
      </TouchableOpacity>
    </View>
  );
}; 