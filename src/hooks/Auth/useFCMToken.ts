// src/hooks/Auth/useFCMToken.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { API_URL } from '../../constants/env';

export const useFCMToken = () => {
  const registerFCMToken = async (userId: number, jwtToken: string) => {
    try {
      console.log('🔧 Starting FCM token registration for user:', userId);
      
      // Request notification permissions
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('❌ Notification permission not granted');
        return false;
      }
      console.log('✅ Notification permission granted');

      // Get FCM token
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      console.log('📱 Using project ID:', projectId);
      
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      
      console.log('📱 Generated Expo push token:', token.data);
      
      // Check if token has changed
      const storedToken = await AsyncStorage.getItem('fcmToken');
      if (storedToken === token.data) {
        console.log('🔄 FCM token unchanged, skipping backend update');
        return true;
      }
      
      // Store new token locally
      await AsyncStorage.setItem('fcmToken', token.data);
      console.log('💾 FCM token stored locally');
      
      // Send token to backend
      console.log('🌐 Sending FCM token to backend...');
      console.log('🌐 API URL:', `${API_URL}/auth/update-fcm-token`);
      console.log('🌐 User ID:', userId);
      console.log('🌐 Token length:', token.data.length);
      
      const response = await axios.post(`${API_URL}/auth/update-fcm-token`, {
        user_id: userId,
        fcm_token: token.data
      }, {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        },
        timeout: 10000 // 10 second timeout
      });
      
      console.log('✅ FCM token updated in backend successfully:', response.data);
      return true;
    } catch (error: any) {
      console.error('❌ Error registering FCM token:', error);
      
      if (error.response) {
        console.error('❌ API Error Response:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error('❌ Network Error:', error.request);
      } else {
        console.error('❌ Other Error:', error.message);
      }
      
      return false;
    }
  };

  const getStoredFCMToken = async () => {
    try {
      return await AsyncStorage.getItem('fcmToken');
    } catch (error) {
      console.error('Error getting stored FCM token:', error);
      return null;
    }
  };

  const forceRefreshFCMToken = async (userId: number, jwtToken: string) => {
    try {
      console.log('🔄 Force refreshing FCM token for user:', userId);
      
      // Clear stored token to force regeneration
      await AsyncStorage.removeItem('fcmToken');
      console.log('🗑️ Cleared stored FCM token');
      
      // Register new token
      const success = await registerFCMToken(userId, jwtToken);
      if (success) {
        console.log('✅ FCM token force refreshed successfully');
      } else {
        console.log('❌ FCM token force refresh failed');
      }
      return success;
    } catch (error) {
      console.error('❌ Error force refreshing FCM token:', error);
      return false;
    }
  };

  return { registerFCMToken, getStoredFCMToken, forceRefreshFCMToken };
};

// Function that always sends token to backend, even if unchanged
export const forceUpdateFCMToken = async (userId: number, jwtToken: string) => {
  try {
    console.log('🔄 Force updating FCM token for user:', userId);
    
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Notification permission not granted');
      return false;
    }
    console.log('✅ Notification permission granted');

    // Get FCM token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log('📱 Using project ID:', projectId);
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    
    console.log('📱 Generated Expo push token:', token.data);
    
    // Store new token locally
    await AsyncStorage.setItem('fcmToken', token.data);
    console.log('💾 FCM token stored locally');
    
    // Always send token to backend
    console.log('🌐 Force sending FCM token to backend...');
    console.log('🌐 API URL:', `${API_URL}/auth/update-fcm-token`);
    console.log('🌐 User ID:', userId);
    console.log('🌐 Token length:', token.data.length);
    
    const response = await axios.post(`${API_URL}/auth/update-fcm-token`, {
      user_id: userId,
      fcm_token: token.data
    }, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ FCM token force updated in backend successfully:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Error force updating FCM token:', error);
    
    if (error.response) {
      console.error('❌ API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('❌ Network Error:', error.request);
    } else {
      console.error('❌ Other Error:', error.message);
    }
    
    return false;
  }
};

// Standalone function for direct import
export const registerFCMTokenStandalone = async (userId: number, jwtToken: string) => {
  try {
    console.log('🔧 Starting FCM token registration for user:', userId);
    
    // Request notification permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('❌ Notification permission not granted');
      return false;
    }
    console.log('✅ Notification permission granted');

    // Get FCM token
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log('📱 Using project ID:', projectId);
    
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    
    console.log('📱 Generated Expo push token:', token.data);
    
    // Store new token locally
    await AsyncStorage.setItem('fcmToken', token.data);
    console.log('💾 FCM token stored locally');
    
    // Always send token to backend (don't skip even if unchanged)
    console.log('🌐 Sending FCM token to backend...');
    console.log('🌐 API URL:', `${API_URL}/auth/update-fcm-token`);
    console.log('🌐 User ID:', userId);
    console.log('🌐 Token length:', token.data.length);
    
    const response = await axios.post(`${API_URL}/auth/update-fcm-token`, {
      user_id: userId,
      fcm_token: token.data
    }, {
      headers: {
        Authorization: `Bearer ${jwtToken}`
      },
      timeout: 10000 // 10 second timeout
    });
    
    console.log('✅ FCM token updated in backend successfully:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ Error registering FCM token:', error);
    
    if (error.response) {
      console.error('❌ API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    } else if (error.request) {
      console.error('❌ Network Error:', error.request);
    } else {
      console.error('❌ Other Error:', error.message);
    }
    
    return false;
  }
};