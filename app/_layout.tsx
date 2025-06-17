import { useColorScheme } from "@/src/hooks/useColorScheme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { AuthProvider, useAuthContext } from "../src/contexts/AuthContext";
import { useNotifications } from "../src/utils/notifications";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const router = useRouter();
  const { isAuthenticated, initialized, authState } = useAuthContext();
  const pathname = usePathname();
  const { expoPushToken, registerForPushNotifications } = useNotifications();

  useEffect(() => {
    if (expoPushToken) {
      console.log('FCM Token:', expoPushToken);
    }
  }, [expoPushToken]);

  useEffect(() => {
    const navigate = async () => {
      if (!initialized) return;
      await SplashScreen.hideAsync();
      console.log("Current auth state:", {
        isAuthenticated,
        role: authState?.role,
        choose_topic: authState?.choose_topic,
        pathname
      });

      // Don't redirect if we're already on a valid path
      const validPaths = [
        "/login",
        "/signup",
        "/signuporg",
        "/veriforg",
        "/welcome",
        "/subcribeTopic",
        "/organisasi/kegiatan/tambah",
        "/organisasi/kegiatan/detail",
        "/relawan/kegiatan/detail",
        "/relawan/kegiatan/daftar",
        "/relawan/kegiatan/detailApply"
      ];

      if (validPaths.some((path) => pathname.startsWith(path))) {
        return;
      }

      if (isAuthenticated) {
        const role = authState?.role;
        const is_subcribed = authState?.choose_topic;

        // Don't redirect if we're already in the tabs structure
        if (pathname.startsWith("/(tabs)")) {
          return;
        }

        if (role === "relawan") {
          if (is_subcribed === "N" || is_subcribed === null) {
            console.log("Redirecting to subscribe topic");
            router.replace("/subcribeTopic");
          } else if (
            is_subcribed === "Y" &&
            pathname.startsWith("/(tabs)/relawan")
          ) {
            console.log("Redirecting to relawan tabs");
            router.replace("/(tabs)/relawan");
          } else if (
            is_subcribed === "Y" &&
            pathname.startsWith("/(tabs)/relawan/history")
          ) {
            console.log("Redirecting to relawan history");
            router.replace("/(tabs)/relawan/history");
          } else if (pathname.startsWith("/(tabs)/relawan/notifikasi")) {
            console.log("Redirecting to relawan notifikasi");
            router.replace("/(tabs)/relawan/notifikasi");
          } else if (pathname.startsWith("/(tabs)/relawan/profile")) {
            console.log("Redirecting to relawan profile");
            router.replace("/(tabs)/relawan/profile");
          }
        } else if (role === "organisasi") {
          if (pathname.startsWith("/(tabs)/organisasi/apply")) {
            console.log("Redirecting to organisasi apply");
            router.replace("/(tabs)/organisasi/apply");
          } else if (pathname.startsWith("/(tabs)/organisasi")) {
            console.log("Redirecting to organisasi tabs");
            router.replace("/(tabs)/organisasi");
          } else if (pathname.startsWith("/(tabs)/organisasi/notifikasi")) {
            console.log("Redirecting to organisasi notifikasi");
            router.replace("/(tabs)/organisasi/notifikasi");
          } else if (pathname.startsWith("/(tabs)/organisasi/profile")) {
            console.log("Redirecting to organisasi profile");
            router.replace("/(tabs)/organisasi/profile");
          }
        }
      } else {
        if (
          pathname !== "/login" &&
          pathname !== "/signup" &&
          pathname !== "/signuporg" &&
          pathname !== "/veriforg" &&
          pathname !== "/welcome"
        ) {
          console.log("Not authenticated, redirecting to login");
          router.replace("/login");
        }
      }
    };

    navigate();
  }, [isAuthenticated, initialized, router, pathname, authState]);

  // Setup notifications when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      registerForPushNotifications();
    }
  }, [isAuthenticated, registerForPushNotifications]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
      <Stack.Screen name="signuporg" options={{ headerShown: false }} />
      <Stack.Screen name="veriforg" options={{ headerShown: false }} />
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="subcribeTopic" options={{ headerShown: false }} />
      <Stack.Screen
        name="organisasi/kegiatan/tambah"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="organisasi/kegiatan/detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="organisasi/apply" options={{ headerShown: false }} />
      <Stack.Screen
        name="relawan/kegiatan/detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="relawan/kegiatan/daftar"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="relawan/history" options={{ headerShown: false }} />
      <Stack.Screen
        name="relawan/kegiatan/detailApply"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf")
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  );
}

// <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
