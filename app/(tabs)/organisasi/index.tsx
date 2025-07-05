import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
import { useCheckVerified } from "@/src/hooks/Organisasi/useCheckVerified";
import { useFetchKegiatanSelf } from "@/src/hooks/Organisasi/useFetchKegiatanSelf";
import { KegiatanType, TopicType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function HomeScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const { authState, logout } = useAuthContext();
  const [topicList, setTopicList] = useState<TopicType[]>([]);
  const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
  const {
    kegiatan,
    loading: loadingKegiatan,
    error: errorKegiatan,
    refetch: refetchKegiatan
  } = useFetchKegiatanSelf({
    search: search,
    topic_id: selectedTopicId || undefined
  });
  const [kegiatanList, setKegiatanList] = useState<KegiatanType[]>([]);
  const { isVerified, refetch: refetchVerified } = useCheckVerified();
  const [isVerifiedState, setIsVerifiedState] = useState(isVerified);
  
  useEffect(() => {
    if (topic) {
      setTopicList(topic);
    }
    if (kegiatan) {
      setKegiatanList(kegiatan);
    }
    if (isVerified !== undefined) {
      setIsVerifiedState(isVerified);
    }
  }, [topic, kegiatan, isVerified]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchKegiatan();
    setRefreshing(false);
  };

  const handleTopicSelect = (topicId: number | null) => {
    setSelectedTopicId(topicId === selectedTopicId ? null : topicId);
  };

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  const handleAddKegiatan = async () => {
    try {
      // Fetch the latest verification status and get the result
      const currentVerifiedStatus = await refetchVerified();
      console.log("Current verification status:", currentVerifiedStatus);
      
      if (currentVerifiedStatus === true) {
        router.push({
          pathname: "/organisasi/kegiatan/tambah"
        });
      } else if (currentVerifiedStatus === false) {
        Alert.alert(
          "Akun Anda di Tolak",
          "Silakan Hubungi Admin untuk mengetahui alasan akun Anda di Tolak"
        );
      } else {
        Alert.alert(
          "Akun Anda Belum Terverifikasi",
          "Pembuatan Kegiatan Gagal, Mohon tunggu proses verifikasi akun Anda"
        );
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
      Alert.alert(
        "Error",
        "Terjadi kesalahan saat memeriksa status verifikasi. Silakan coba lagi."
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-gray-600 rounded-b-3xl mb-3 py-1`}>
        <View
          style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={require("@/assets/group.png")}
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
            {/* logout button */}
            <TouchableOpacity onPress={() => logout()}>
              <Ionicons name="log-out-outline" size={25} color="white" />
            </TouchableOpacity>
            {/* <Ionicons name="search-outline" size={25} color="black" /> */}
          </View>
        </View>
      </View>

      <View style={tw`px-5`}>
        <View style={tw`flex-row items-center justify-between`}>
          <TextInput
            style={tw`text-black bg-white py-3 px-4 rounded-full w-3/4 border border-gray-100`}
            placeholder="Cari Kegiatan yang pernah Anda Buat"
            placeholderTextColor="gray"
            autoCapitalize="none"
            value={search}
            onChangeText={setSearch}
          />
          <View style={tw`flex-row items-center w-1/4 justify-center`}>
            <Ionicons name="filter-outline" size={25} color="black" />
            <Text style={tw`text-black text-xs font-medium ml-2`}>Filter</Text>
          </View>
        </View>
        <ScrollView
          horizontal
          style={tw`mt-4 py-1`}
          showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => handleTopicSelect(null)}
            style={tw`${
              selectedTopicId === null
                ? "bg-gray-500 border-gray-500"
                : "bg-gray-100 border-gray-100"
            } rounded-full px-4 py-2 mr-2 border`}>
            <Text
              style={tw`${
                selectedTopicId === null ? "text-white" : "text-black"
              } text-xs`}>
              Semua
            </Text>
          </TouchableOpacity>
          {topicList.map((topic) => (
            <TouchableOpacity
              key={topic.topic_id}
              onPress={() => handleTopicSelect(topic.topic_id || null)}
              style={tw`${
                selectedTopicId === topic.topic_id
                  ? "bg-gray-500 border-gray-500"
                  : "bg-gray-100 border-gray-100"
              } rounded-full px-4 py-2 mr-2 border`}>
              <Text
                style={tw`${
                  selectedTopicId === topic.topic_id
                    ? "text-white"
                    : "text-black"
                } text-xs`}>
                {topic.topic_nama}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={tw`flex-row items-center justify-between px-5 mt-5`}>
        <Text style={tw`text-black text-sm font-medium ml-1`}>
          {kegiatanList.length} Kegiatan
        </Text>
        <View style={tw`flex-row items-center ml-4 mr-6`}>
          <View style={tw`w-1/2 h-0.5 bg-gray-200`} />
          <View style={tw`w-1/4 h-0.5 bg-gray-200 mr-5`} />
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color="gray"
            style={tw`mr-2`}
          />
        </View>
      </View>
      <ScrollView
        style={tw`px-5 mt-5 mb-20`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]} // blue-600 color
            tintColor="#2563eb"
          />
        }>
        {kegiatanList.map((kegiatan) => (
          <TouchableOpacity
            key={kegiatan.kegiatan_id}
            onPress={() =>
              router.push({
                pathname: "/organisasi/kegiatan/detail",
                params: { id: kegiatan.kegiatan_id }
              })
            }
            style={tw`bg-white border border-gray-200 shadow-md rounded-3xl px-3 py-3 mb-6 border border-gray-100 ${
              kegiatan.status === "Rejected"
                ? "bg-red-200"
                : kegiatan.status === "Selesai"
                ? "bg-blue-200"
                : "bg-white"
            }`}>
            <View
              key={kegiatan.kegiatan_id}
              style={tw`bg-white px-2 py-2 mr-2 ${
                kegiatan.status === "Rejected"
                  ? "bg-red-200"
                  : kegiatan.status === "Selesai"
                  ? "bg-blue-200"
                  : "bg-white"
              }`}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`bg-gray-400 rounded-md px-2 py-1`}>
                  <Text style={tw`text-white text-xs`}>
                    {kegiatan.topic?.topic_nama}
                  </Text>
                </View>
                <View style={tw`bg-gray-400 rounded-md px-2 py-1 ml-3`}>
                  <Text style={tw`text-white text-xs`}>
                    {kegiatan.jenis_kegiatan?.jenis_kegiatan}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row items-center justify-between w-full`}>
                <View style={tw`flex-col`}>
                  <Text style={tw`text-black text-sm font-medium`}>
                    {kegiatan.nama_kegiatan}
                  </Text>
                  <Text style={tw`text-gray-500 text-sm`}>
                    Tanggal: {formatDate(kegiatan.start_date || "")}
                  </Text>
                </View>
                <View style={tw`ml-2`}>
                  {kegiatan.status === "Draft" && (
                    <Text
                      style={tw`bg-red-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Draft
                    </Text>
                  )}
                  {kegiatan.status === "Verified" && (
                    <Text
                      style={tw`bg-green-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Verified
                    </Text>
                  )}
                  {kegiatan.status === "Rejected" && (
                    <Text
                      style={tw`bg-red-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Ditolak
                    </Text>
                  )}
                  {kegiatan.status === "Berjalan" && (
                    <Text
                      style={tw`bg-blue-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Sedang Berjalan
                    </Text>
                  )}
                  {kegiatan.status === "Selesai" && (
                    <Text
                      style={tw`bg-green-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Selesai
                    </Text>
                  )}
                  {kegiatan.status === "Cancelled" && (
                    <Text
                      style={tw`bg-red-500 text-white text-xs px-2 py-1 rounded-2xl`}>
                      Cancelled
                    </Text>
                  )}
                </View>
              </View>
              <View style={tw`h-0.5 bg-white mt-2 mb-2`} />
              <Text style={tw`text-gray-500 text-sm`}>
                Lokasi: {kegiatan.location}
              </Text>
              <View style={tw`flex-row items-center mt-2`}>
                <Text style={tw`text-red-500 text-xs italic`}>
                  {kegiatan.status === "Draft" &&
                    "Menunggu persetujuan dari Admin"}
                  {kegiatan.status === "Verified" && "Terverifikasi"}
                  {kegiatan.status === "Berjalan" && "Sedang Berjalan"}
                  {kegiatan.status === "Selesai" && "Selesai"}
                  {kegiatan.status === "Cancelled" && "Dibatalkan oleh Admin"}
                  {kegiatan.status === "Rejected" && "Ditolak oleh Admin"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <TouchableOpacity
        // onPress={() =>
        //   router.push({
        //     pathname: "/organisasi/kegiatan/tambah"
        //   })
        // }
          onPress={handleAddKegiatan}
        style={tw`absolute bottom-30 right-7 w-13 h-13 bg-blue-600 rounded-full items-center justify-center shadow-lg`}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}
