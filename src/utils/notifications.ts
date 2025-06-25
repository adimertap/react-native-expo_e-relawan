import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Device from 'expo-device';
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

    if (Device.isDevice) {
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
          projectId: 'Ca-wan'
        });

        // Store the token
        if (token) {
          console.log('Got FCM token:', token.data);
          setExpoPushToken(token.data);
          await AsyncStorage.setItem('fcmToken', token.data);

          // If user is logged in, send token to backend
          if (authState?.user_id) {
            try {
              const response = await axios.post(`${API_URL}/user/update-fcm-token`, {
                user_id: authState.user_id,
                fcm_token: token.data
              }, {
                headers: {
                  'Authorization': `Bearer ${authState.token}`
                }
              });
              console.log('FCM token updated successfully:', response.data);
            } catch (error) {
              console.error('Error updating FCM token:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error getting push token:', error);
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

    } else {
      // For emulator testing, generate a mock token
      const mockToken = `mock-token-${Date.now()}`;
      console.log('Using mock token for emulator:', mockToken);
      setExpoPushToken(mockToken);
      await AsyncStorage.setItem('fcmToken', mockToken);
      
      // If user is logged in, send mock token to backend
      // if (authState?.user_id) {
      //   try {
      //     const response = await axios.post(`${API_URL}/user/update-fcm-token`, {
      //       user_id: authState.user_id,
      //       fcm_token: mockToken
      //     }, {
      //       headers: {
      //         'Authorization': `Bearer ${authState.token}`
      //       }
      //     });
      //     console.log('Mock FCM token updated successfully:', response.data);
      //   } catch (error) {
      //     // console.error('Error updating mock FCM token:', error);
      //   }
      // }
      return { data: mockToken };
    }

    return token;
  }, [authState?.user_id, authState?.token]);

  // Setup notification handlers
  useEffect(() => {
    // Register for notifications when component mounts or user logs in
    if (authState?.user_id) {
      registerForPushNotifications();
    }

    // Listen for notifications
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
      // Handle notification tap here
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