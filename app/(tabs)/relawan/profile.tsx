import ModalChangePassword from "@/components/new/ModalChangePassword";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchProfileRelawan } from "@/src/hooks/Relawan/useFetchProfile";
import { UserType } from "@/src/types/types";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";

export default function ProfileRelawanScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { authState, logout, isAuthenticated } = useAuthContext();
  const [profile, setProfile] = useState<UserType | null>(null);
  const isLoggingOut = useRef(false);
  const [modalVisible, setModalVisible] = useState(false);
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

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
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


  const handleModalChangePassword = async () => {
    try {
      setModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={tw`flex-1`}>
      <View style={tw`h-[40%] bg-blue-600`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Image
            source={require("@/assets/hipo.png")}
            style={tw`w-24 h-24 rounded-full`}
          />
          <Text style={tw`text-white text-xl font-bold mt-4`}>
            {authState?.nama}
          </Text>
          <Text style={tw`text-white text-base italic`}>
            {authState?.email}
          </Text>
        </View>
      </View>

      <View style={tw`h-[60%] bg-white rounded-t-3xl -mt-8 pt-5 px-2`}>
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
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-black text-sm font-medium`}>
              Tanggal Bergabung
            </Text>
            <Text style={tw`text-gray-500 text-sm italic`}>
              {formatDate(profile?.created_at || "")}
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2 `} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-black text-sm font-medium`}>No. HP</Text>
            <Text style={tw`text-gray-500 text-sm italic`}>
              {profile?.phone || "-"}
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-black text-sm font-medium`}>Email</Text>
            <Text style={tw`text-gray-500 text-sm italic`}>
              {profile?.email || "-"}
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-black text-sm font-medium`}>Alamat</Text>
            <Text style={tw`text-gray-500 text-sm italic`}>
              {profile?.alamat || "-"}
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-black text-sm font-medium`}>Profesi</Text>
            <Text style={tw`text-gray-500 text-sm italic`}>
              {profile?.profesi || "-"}
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-blue-500 text-sm font-medium`}>Kegiatan yang telah diikuti</Text>
            <Text style={tw`text-blue-500 text-sm italic`}>
              {profile?.subs_kegiatan?.length || 0} Kegiatan
            </Text>
          </View>
          <View style={tw`h-0.4 bg-gray-100 mt-2 mb-2`} />

          <TouchableOpacity
            style={tw`bg-white border border-gray-400 rounded-lg p-2 mt-5 flex-row items-center justify-center`}>
            <Text style={tw`text-black text-sm font-medium`}>
              Update Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
             onPress={() => handleModalChangePassword()}
            style={tw`bg-white border border-gray-400 rounded-lg p-2 mt-5 flex-row items-center justify-center`}>
            <Text style={tw`text-black text-sm font-medium`}>
              Change Password
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLogout}
            style={tw`bg-white border border-red-500 rounded-lg p-2 mt-5 flex-row items-center justify-center`}>
            <Text style={tw`text-red-500 text-sm font-medium`}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      <ModalChangePassword
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        user_id={authState?.user_id || 0}
      />


    </View>
  );
}
