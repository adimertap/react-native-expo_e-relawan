import ModalApply from "@/app/organisasi/kegiatan/modal/modalApply";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchApplyKegiatan } from "@/src/hooks/Organisasi/useFetchApplyKegiatan";
import { useVerifikasiKegiatan } from "@/src/hooks/Organisasi/useVerifikasiKegiatan";
import { SubsKegiatanType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function ApplyKegiatanScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { authState, logout } = useAuthContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<SubsKegiatanType | null>(null);
  const [isPertanyaan, setIsPertanyaan] = useState<string>("");

  const {
    kegiatan,
    loading: loadingApplyKegiatan,
    error: errorApplyKegiatan,
    refetch: refetchApplyKegiatan
  } = useFetchApplyKegiatan();
  const {
    verifikasiKegiatan,
    loading: loadingVerifikasiKegiatan,
    error: errorVerifikasiKegiatan
  } = useVerifikasiKegiatan();
  const [applyKegiatanList, setApplyKegiatanList] = useState<
    SubsKegiatanType[]
  >([]);

  useEffect(() => {
    if (kegiatan) {
      setApplyKegiatanList(kegiatan);
    }
  }, [kegiatan]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchApplyKegiatan();
    setRefreshing(false);
  };

  const handleVerifikasi = async (subs_kegiatan_id: number) => {
    try {
      const subs = applyKegiatanList.find(
        (s) => s.subs_kegiatan_id === subs_kegiatan_id
      );
      if (subs?.kegiatan?.perlu_pertanyaan === "Y") {
        setSelectedSubs(subs);
        setIsPertanyaan(subs.kegiatan.perlu_pertanyaan);
        setModalVisible(true);
      } else {
        await verifikasiKegiatan(subs?.kegiatan?.kegiatan_id || 0, subs?.user_id || 0);
        Alert.alert("Berhasil", "Relawan berhasil diverifikasi");
        await refetchApplyKegiatan();
        setModalVisible(false);
        setSelectedSubs(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmVerifikasi = async () => {
    try {
      await verifikasiKegiatan(selectedSubs?.kegiatan?.kegiatan_id || 0, selectedSubs?.user_id || 0);
      Alert.alert("Berhasil", "Relawan berhasil diverifikasi");
      await refetchApplyKegiatan();
      setModalVisible(false);
      setSelectedSubs(null);
    } catch (error) {
      console.log(error);
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
  if (loadingApplyKegiatan) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (loadingVerifikasiKegiatan) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (errorApplyKegiatan) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <Text>Error: {errorApplyKegiatan}</Text>
      </View>
    );
  }
  if (errorVerifikasiKegiatan) {
    return (
      <View style={tw`flex-1 bg-gray-50`}>
        <Text>Error: {errorApplyKegiatan}</Text>
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
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity onPress={() => logout()}>
              <Ionicons name="log-out-outline" size={25} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={tw`flex-row items-center justify-between px-5 mt-5`}>
        <Text style={tw`text-black text-sm font-medium ml-1 italic`}>
          List Relawan Mendaftar di Kegiatan Anda
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
        {applyKegiatanList.map((kegiatan) => (
          <TouchableOpacity
            key={kegiatan.subs_kegiatan_id}
            onPress={() => handleVerifikasi(kegiatan.subs_kegiatan_id || 0)}
            style={tw`bg-white border border-gray-200 shadow-md rounded-3xl px-3 py-3 mb-6 border border-gray-100`}>
            <View
              key={kegiatan.subs_kegiatan_id}
              style={tw`bg-white px-2 py-2 mr-2`}>
              <View style={tw`w-full flex-row items-center justify-between`}>
                <View style={tw`flex-col`}>
                  <Text style={tw`text-black text-sm font-medium`}>
                    {kegiatan.user?.nama || ""}
                  </Text>
                  <Text style={tw`text-gray-500 text-sm italic mt-1`}>
                    {kegiatan.kegiatan?.nama_kegiatan || ""}
                  </Text>
                  <View style={tw`mt-2`}>
                    <Text style={tw`text-red-500 text-xs italic`}>
                      {formatDate(kegiatan.created_at || "")} Menunggu
                      Verifikasi
                    </Text>
                  </View>
                </View>
                <View style={tw`flex-row items-center`}>
                  <Ionicons name="eye-outline" size={20} color="gray" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ModalApply
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedSubs={selectedSubs}
        setSelectedSubs={setSelectedSubs}
        isPertanyaan={isPertanyaan}
        handleConfirmVerifikasi={handleConfirmVerifikasi}
      />
    </View>
  );
}
