import * as Notifications from 'expo-notifications';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Index() {

  useEffect(() => {
    // Configure Android notification channel
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'Default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Note: FCM token registration is now handled in AuthContext
    // to prevent duplicate API calls
  }, []); // Remove authState dependency to prevent re-runs

  return <Redirect href="/welcome" />;
}