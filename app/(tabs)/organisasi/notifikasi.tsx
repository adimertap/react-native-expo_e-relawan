import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchNotifikasi } from "@/src/hooks/Organisasi/useFetchNotifikasi";
import { NotifikasiType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  View
} from "react-native";
import tw from "twrnc";

export default function NotifikasiScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { authState, logout } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotifikasi, setSelectedNotifikasi] =
    useState<NotifikasiType | null>(null);

  const {
    notifikasi,
    loading: loadingNotifikasi,
    error: errorNotifikasi,
    refetch: refetchNotifikasi
  } = useFetchNotifikasi();
  const [notifikasiList, setNotifikasiList] = useState<NotifikasiType[]>([]);

  useEffect(() => {
    if (notifikasi) {
      setNotifikasiList(notifikasi);
    }
  }, [notifikasi]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchNotifikasi();
    setRefreshing(false);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };
  if (loadingNotifikasi) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (errorNotifikasi) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <Text>Error: {errorNotifikasi}</Text>
      </View>
    );
  }
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-gray-600 rounded-b-3xl mb-3 py-1`}>
        <View
          style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={require("@/assets/hipo.png")}
              style={tw`w-10 h-10`}
            />
            <View style={tw`flex-col ml-2`}>
              <Text style={tw`text-white text-base font-bold ml-2`}>
                Hello, {authState?.nama}
              </Text>
              <Text style={tw`text-white text-sm ml-2 italic`}>Organisasi</Text>
            </View>
          </View>
          {/* <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => logout()}>
              <Ionicons name="log-out-outline" size={25} color="white" />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      <View style={tw`flex-row items-center justify-between px-5 mt-5`}>
        <Text style={tw`text-black text-sm font-medium ml-1 italic`}>
          Notifikasi
        </Text>
      </View>
      <View style={tw`h-0.4 bg-gray-200 mt-3 mb-1 mx-5`} />
      <ScrollView
        style={tw`px-5 mt-5 mb-20`}
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
        {notifikasiList.map((notifikasi) => (
          <View
            key={notifikasi.notifikasi_id}
            style={tw`bg-white border border-gray-200 shadow-md rounded-2xl px-4 py-4 mb-4 border border-gray-100`}>
            <View style={tw`flex-row items-center justify-between`}>
              <View style={tw`flex-col`}>
                <View style={tw`flex-row items-center mb-1 justify-between`}>
                  <Text style={tw`text-black text-sm font-medium`}>
                    {notifikasi.subject}
                  </Text>
                  <Ionicons
                    name="notifications-outline"
                    size={20}
                    color="blue"
                  />
                </View>
                <Text style={tw`text-gray-500 text-sm italic mt-1`}>
                  {notifikasi.message}
                </Text>
                <Text style={tw`text-blue-500 text-xs italic mt-1`}>
                  {formatDate(notifikasi.created_at || "")}
                </Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
