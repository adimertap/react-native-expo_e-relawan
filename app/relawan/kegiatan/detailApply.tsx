import { useAuthContext } from "@/src/contexts/AuthContext";
import { useApplyKegiatan } from "@/src/hooks/Relawan/useApplyKegiatan";
import { useFetchApplyDetailKegiatan } from "@/src/hooks/Relawan/useFetchApplyDetailKegiatan";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function DetailApplyKegiatanRelawanScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { logout } = useAuthContext();

  const {
    applyDetailKegiatan,
    loading: loadingApplyDetailKegiatan,
    error: errorApplyDetailKegiatan
  } = useFetchApplyDetailKegiatan(Number(id));
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [jenisKegiatan, setJenisKegiatan] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [kabupaten, setKabupaten] = useState<string>("");
  const [provinsi, setProvinsi] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const {
    applyKegiatan,
    loading: loadingApplyKegiatan,
    error: errorApplyKegiatan
  } = useApplyKegiatan();

  useEffect(() => {
    if (applyDetailKegiatan) {
      setNamaKegiatan(applyDetailKegiatan.kegiatan?.nama_kegiatan || "");
      setTopic(applyDetailKegiatan.kegiatan?.topic?.topic_nama || "");
      setJenisKegiatan(
        applyDetailKegiatan.kegiatan?.jenis_kegiatan?.jenis_kegiatan || ""
      );
      setStartDate(applyDetailKegiatan.kegiatan?.start_date || "");
      setEndDate(applyDetailKegiatan.kegiatan?.end_date || "");
      setLocation(applyDetailKegiatan.kegiatan?.location || "");
      setKabupaten(applyDetailKegiatan.kegiatan?.kabupaten?.kabupaten || "");
      setProvinsi(applyDetailKegiatan.kegiatan?.provinsi?.provinsi || "");
      setStatus(applyDetailKegiatan.is_verified || "");
    }
  }, [applyDetailKegiatan]);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-blue-600 rounded-b-3xl mb-3 py-1`}>
        <View
          style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-outline" size={25} color="white" />
          </TouchableOpacity>

          <View style={tw`flex-col items-center absolute left-0 right-0`}>
            <Text style={tw`text-white text-sm font-bold`}>
              Detail Kegiatan Diikuti
            </Text>
            <Text style={tw`text-white text-sm italic`}>
              Data Kegiatan yang telah diisi
            </Text>
          </View>
          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`p-6 pt-3 mt-2`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={tw`text-white text-xs px-2 py-1 rounded-2xl ${
              status === "Y" ? "bg-green-500" : ""
            } ${status === "N" ? "bg-red-500" : ""}`}>
            {status === "Y" && "Diterima"}
            {status === "N" && "Pendaftaran On Review"}
          </Text>
          {/* Tambah button add to calendar */}
          {status === "Y" && (
            <TouchableOpacity
              style={tw`bg-blue-500 rounded-full px-4 py-2 flex-row items-center`}>
              <Ionicons name="calendar-outline" size={16} color="white" />
              <Text style={tw`text-white text-xs ml-2`}>Kalender</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={tw`mt-6`}>
          <Text style={tw`text-black text-lg font-medium`}>{namaKegiatan}</Text>
          <Text style={tw`text-gray-500 text-sm mt-1`}>
            Topic: {topic}, Event: {jenisKegiatan}
          </Text>
        </View>
        <View style={tw`h-0.5 bg-gray-200 mt-5 mb-2`} />
        <ScrollView
          style={tw`mb-20`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={tw`pb-20`}
          refreshControl={
            <RefreshControl
              refreshing={loadingApplyDetailKegiatan}
              onRefresh={() => {}}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }>
          <View style={tw`mt-3 flex-row justify-between items-center`}>
            <Text style={tw`text-gray-700 font-sm`}>
              Mulai: {formatDate(startDate)} - Selesai: {formatDate(endDate)}
            </Text>
          </View>
          <Text style={tw`text-black font-sm mt-4`}>
            {provinsi}, {kabupaten}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-2`}>{location}</Text>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Total Jam Kerja:{" "}
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              -+ {applyDetailKegiatan?.kegiatan?.total_jam_kerja} Jam
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Kriteria Relawan:{" "}
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {applyDetailKegiatan?.kegiatan?.kriteria_relawan}
            </Text>
          </View>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            Deskripsi {applyDetailKegiatan?.kegiatan?.deskripsi_kegiatan}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            Tugas {applyDetailKegiatan?.kegiatan?.tugas_relawan}
          </Text>
          <View style={tw`h-0.5 bg-gray-200 mt-3 mb-2`} />
          {applyDetailKegiatan?.kegiatan?.perlu_pertanyaan === "Y" && (
            <>
              <Text style={tw`text-gray-600 font-sm mt-3`}>Mengapa Memilih Saya: </Text>
              <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
                {applyDetailKegiatan?.about_me}
              </Text>
              <View style={tw`flex-row items-center justify-start mt-5`}>
                <Text style={tw`text-gray-600 font-sm mt-3`}>CV: </Text>
                <Text style={tw`text-blue-800 font-sm mt-3 italic`}>
                  {applyDetailKegiatan?.user_cv}
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
