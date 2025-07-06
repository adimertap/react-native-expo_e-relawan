import { FCMTest } from "@/components/FCMTest";
import { NotificationTest } from "@/components/NotificationTest";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchProfileRelawan } from "@/src/hooks/Relawan/useFetchProfile";
import { UserType } from "@/src/types/types";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";

export default function TestNotifScreen() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);
    const { authState, logout, isAuthenticated } = useAuthContext();
    const [profile, setProfile] = useState<UserType | null>(null);
    const isLoggingOut = useRef(false);
    const {
        profile: profileData,
        loading: loadingProfile,
        error: errorProfile,
        refetch: refetchProfile
    } = useFetchProfileRelawan();

    useEffect(() => {
        if (!isAuthenticated) {
            router.replace("/login");
            return;
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        if (profileData && isAuthenticated && !isLoggingOut.current) {
            setProfile(profileData);
        }
    }, [profileData, isAuthenticated]);

    const onRefresh = async () => {
        if (!isAuthenticated || isLoggingOut.current) return;
        setRefreshing(true);
        await refetchProfile();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        try {
            isLoggingOut.current = true;
            setProfile(null);
            await logout();
            router.replace("/login");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            isLoggingOut.current = false;
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loadingProfile) {
        return (
            <View style={tw`flex-1 bg-gray-50`}>
                <ActivityIndicator size="large" color="#2563eb" />
            </View>
        );
    }

    if (errorProfile) {
        return (
            <View style={tw`flex-1 bg-gray-50`}>
                <Text>Error: {errorProfile}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1`}>
            <View style={tw`h-[25%] bg-blue-600`}>
                <View style={tw`flex-1 items-center justify-center`}>
                    <Text style={tw`text-white text-xl font-bold mt-4`}>
                        {authState?.nama}, User ID: {authState?.user_id}
                    </Text>
                    <Text style={tw`text-white text-base italic`}>
                        {authState?.email}
                    </Text>
                </View>
            </View>

            <View style={tw`h-[75%] bg-white rounded-t-3xl -mt-8 pt-5 px-2`}>
                <ScrollView
                    style={tw`px-5 mt-5`}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={tw`pb-20`}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={["#2563eb"]}
                            tintColor="#2563eb"
                        />
                    }>
                    <Text style={tw`text-black text-sm font-medium italic mb-1`}>Test Notification Here</Text>
                    <View style={tw`h-0.4 bg-gray-100 mt-2 mb-5`} />
                    <FCMTest />
                    <NotificationTest />
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={tw`bg-white border border-red-500 rounded-lg p-2 mt-4 flex-row items-center justify-center`}>
                        <Text style={tw`text-red-500 text-sm font-medium`}>Back</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
}
