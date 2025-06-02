import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
import { useFetchApplyKegiatan } from "@/src/hooks/Relawan/useFetchApplyKegiatan";
import { SubsKegiatanType, TopicType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";

export default function ApplyKegiatanScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const { authState, logout } = useAuthContext();
  const [topicList, setTopicList] = useState<TopicType[]>([]);
  const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
  const {
    applyKegiatan,
    loading: loadingApplyKegiatan,
    error: errorApplyKegiatan,
    refetch: refetchApplyKegiatan
  } = useFetchApplyKegiatan({
    topic_id: selectedTopicId || undefined
  });
  const [applyKegiatanList, setApplyKegiatanList] = useState<SubsKegiatanType[]>([]);

  useEffect(() => {
    if (topic) {
      setTopicList(topic);
    }
    if (applyKegiatan) {
      setApplyKegiatanList(applyKegiatan);
    }
  }, [topic, applyKegiatan]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchApplyKegiatan();
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
            {/* logout button */}
            <TouchableOpacity onPress={() => logout()}>
              <Ionicons name="log-out-outline" size={25} color="white" />
            </TouchableOpacity>
            {/* <Ionicons name="search-outline" size={25} color="black" /> */}
          </View>
        </View>
      </View>
      <View style={tw`flex-row items-center justify-between px-5 mt-5`}>
        <Text style={tw`text-black text-sm font-medium ml-1 italic`}>
            List Relawan Mendaftar di Kegiatan Anda
        </Text>
      </View>
      <ScrollView 
        style={tw`px-5 mt-5 mb-20`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']} // blue-600 color
            tintColor="#2563eb"
          />
        }
      >
        {applyKegiatanList.map((applyKegiatan) => (
          <TouchableOpacity
            key={applyKegiatan.subs_kegiatan_id}
            onPress={() => router.push({
              pathname: "/relawan/kegiatan/detailApply",
              params: { id: applyKegiatan.kegiatan_id }
            })}
            style={tw`bg-white border border-gray-200 shadow-md rounded-3xl px-3 py-3 mb-6 border border-gray-100`}>
            <View
              key={applyKegiatan.subs_kegiatan_id}
              style={tw`bg-white px-2 py-2 mr-2`}>
              <View style={tw`flex-row items-center mb-3`}>
                <View style={tw`bg-blue-400 rounded-md px-2 py-1`}>
                  <Text style={tw`text-white text-xs`}>
                    {applyKegiatan.kegiatan?.topic?.topic_nama}
                  </Text>
                </View>
                <View style={tw`bg-blue-400 rounded-md px-2 py-1 ml-3`}>
                  <Text style={tw`text-white text-xs`}>
                    {applyKegiatan.kegiatan?.jenis_kegiatan?.jenis_kegiatan}
                  </Text>
                </View>
              </View>
              <View style={tw`flex-row items-center justify-between w-full`}>
                <View style={tw`flex-col`}>
                  <Text style={tw`text-black text-sm font-medium`}>
                    {applyKegiatan.kegiatan?.nama_kegiatan}
                  </Text>
                  <Text style={tw`text-gray-500 text-sm`}>
                    Tanggal: {formatDate(applyKegiatan.kegiatan?.start_date || "")}
                  </Text>
                </View>
               
              </View>
              <View style={tw`h-0.5 bg-white mt-1 mb-1`} />
              <Text style={tw`text-gray-500 text-sm`}>
                Lokasi: {applyKegiatan.kegiatan?.location}
              </Text>
              <View style={tw`mt-1`}>
                  {applyKegiatan.is_verified === "N" && (
                    <Text style={tw`text-red-500 text-xs italic`}>
                      Menunggu Verifikasi
                    </Text>
                  )}
                  {applyKegiatan.is_verified === "Y" && (
                    <Text style={tw`text-blue-500 text-xs italic`}>
                      Diterima
                    </Text>
                  )}
                </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
