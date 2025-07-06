import React, { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import tw from 'twrnc';
import { useAuthContext } from '../src/contexts/AuthContext';
import { sendLocalNotification } from '../src/utils/notifications';

export const NotificationTest: React.FC = () => {
  const { authState } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const testLocalNotification = async () => {
    try {
      setIsLoading(true);
      await sendLocalNotification(
        'Test Notification',
        'This is a test notification from the app',
        {
          type: 'TEST',
          screen: '/(tabs)/relawan'
        }
      );
      Alert.alert('Success', 'Local notification sent!');
    } catch (error) {
      Alert.alert('Error', 'Failed to send local notification');
    } finally {
      setIsLoading(false);
    }
  };

  const showFCMInfo = () => {
    Alert.alert(
      'FCM Token Info',
      `User ID: ${authState?.user_id}\nToken: ${authState?.token ? 'Available' : 'Not available'}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={tw`p-5 bg-blue-100 rounded-xl mt-5`}>
      <Text style={tw`text-base italic font-bold mb-4 text-center`}>
        Push Notification Test
      </Text>
      <View style={tw`bg-white p-3 rounded-lg mb-3`}>
          <Text style={tw`text-sm text-gray-600 italic`}>
            Status: {authState?.user_id ? 'Logged In' : 'Not Logged In'}
          </Text>
          <Text style={tw`text-sm text-gray-600 italic font-bold`}>
            User ID: {authState?.user_id || 'N/A'}
          </Text>
        </View>
      <View style={tw`space-y-3`}>
        <TouchableOpacity
          style={tw`bg-blue-500 p-3 rounded-lg`}
          onPress={testLocalNotification}
          disabled={isLoading}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            {isLoading ? 'Sending...' : 'Test Local Notification'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-green-500 p-3 rounded-lg mt-3 mb-5`}
          onPress={showFCMInfo}
        >
          <Text style={tw`text-white text-center font-semibold`}>
            Show FCM Info
          </Text>
        </TouchableOpacity>

     
      </View>
    </View>
  );
}; 