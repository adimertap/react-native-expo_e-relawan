import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { API_URL } from '../constants/env';
import { useAuthContext } from '../contexts/AuthContext';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
  const { authState } = useAuthContext();

  // Register for push notifications
  const registerForPushNotifications = useCallback(async () => {
    let token;

    // Check if we have permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // If we don't have permission, ask for it
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // If we still don't have permission, exit
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }

    // Get the token
    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: 'ca-wan'
      });

      // Store the token
      if (token) {
        console.log('Got Expo push token:', token.data);
        setExpoPushToken(token.data);
        await AsyncStorage.setItem('expoPushToken', token.data);

        // If user is logged in, send token to backend
        if (authState?.user_id) {
          try {
            const response = await axios.post(`${API_URL}/auth/update-fcm-token`, {
              user_id: authState.user_id,
              fcm_token: token.data
            }, {
              headers: {
                'Authorization': `Bearer ${authState.token}`
              }
            });
            console.log('Expo push token updated successfully:', response.data);
          } catch (error) {
            console.error('Error updating Expo push token:', error);
          }
        }
      }
    } catch (error: any) {
      console.log('Expo push token failed:', error?.message || 'Unknown error');
      return;
    }

    // Set up notification channels for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Configure notification handler
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true
      }),
    });

    return token;
  }, [authState?.user_id, authState?.token]);

  // Setup notification handlers
  useEffect(() => {
    // Register for notifications when component mounts or user logs in
    if (authState?.user_id) {
      registerForPushNotifications();
    }

    // Listen for Expo notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Expo notification received:', notification);
      
      // Handle foreground notifications
      const data = notification.request.content.data;
      if (data?.type === 'KEGIATAN_VERIFIED') {
        console.log('Kegiatan verified notification received:', data);
        // You can add custom handling here, like updating local state
      }
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Expo notification response:', response);
      // Handle notification tap here
      const data = response.notification.request.content.data;
      
      // Navigate based on notification data
      if (data?.screen) {
        // Handle navigation here - you'll need to implement this based on your navigation setup
        console.log('Navigate to:', data.screen);
        
        // Example navigation logic (you'll need to adapt this to your navigation setup)
        if (data.type === 'KEGIATAN_VERIFIED' && data.kegiatan_id) {
          // Navigate to kegiatan detail or list
          console.log('Navigate to kegiatan:', data.kegiatan_id);
        }
      }
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [authState?.user_id, registerForPushNotifications]);

  return {
    expoPushToken,
    registerForPushNotifications
  };
};

// Utility function to send local notification for testing
export const sendLocalNotification = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null, // Send immediately
  });
};