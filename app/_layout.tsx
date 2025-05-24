import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, usePathname, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import React, { useEffect } from 'react';
import { AuthProvider, useAuthContext } from '../src/contexts/AuthContext';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const { isAuthenticated, initialized, authState } = useAuthContext();
  const pathname = usePathname();

  useEffect(() => {
    console.log('Auth state changed', { isAuthenticated, initialized, pathname });
    
    const navigate = async () => {
      if (!initialized) return;
      
      await SplashScreen.hideAsync();
      
      if (isAuthenticated) {
        const role = authState?.role;
        if (role === 'relawan') {
          if (pathname !== '/(tabs)/subcribeTopic') {
            router.replace('/(tabs)/subcribeTopic');
          }
        } else if (role === 'organisasi') {
          if (pathname === '/' || pathname === '/login' || pathname === '/welcome' || pathname === '/veriforg' || pathname === '/signuporg' ) {
            router.replace('/(tabs)');
          }
        } else {
          if (pathname === '/' || pathname === '/login' || pathname === '/welcome' || pathname === '/veriforg' || pathname === '/signuporg' ) {
            router.replace('/(tabs)');
          }
        }
      } else {
        if (pathname !== '/login' && pathname !== '/signup' && pathname !== '/signuporg' && pathname !== '/veriforg' && pathname !== '/welcome') {
          console.log('Navigating to login...');
          router.replace('/login');
        }
      }
    };
    
    navigate();
  }, [isAuthenticated, initialized, router, pathname, authState]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="signuporg" options={{ headerShown: false }} />
      <Stack.Screen name="veriforg" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}