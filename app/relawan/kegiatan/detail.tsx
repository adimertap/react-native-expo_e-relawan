import { API_URL } from "@/src/constants/env";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useDeleteKegiatan } from "@/src/hooks/Organisasi/useDeleteKegiatan";
import { useFetchKegiatanSelf } from "@/src/hooks/Organisasi/useFetchKegiatanSelf";
import { useApplyKegiatan } from "@/src/hooks/Relawan/useApplyKegiatan";
import { useFetchDetailKegiatanRelawan } from "@/src/hooks/Relawan/useFetchDetailKegiatanRelawan";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function DetailKegiatanRelawanScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { authState, logout } = useAuthContext();

  const {
    detailKegiatan,
    loading: loadingDetailKegiatan,
    error: errorDetailKegiatan
  } = useFetchDetailKegiatanRelawan(Number(id));
  const {
    deleteKegiatan,
    loading: loadingDeleteKegiatan,
    error: errorDeleteKegiatan
  } = useDeleteKegiatan();
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [jenisKegiatan, setJenisKegiatan] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [jumlahRelawan, setJumlahRelawan] = useState<string>("");
  const [totalJamKerja, setTotalJamKerja] = useState<string>("");
  const [tugasRelawan, setTugasRelawan] = useState<string>("");
  const [kriteriaRelawan, setKriteriaRelawan] = useState<string>("");
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [kabupaten, setKabupaten] = useState<string>("");
  const [provinsi, setProvinsi] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const { refetch: refetchKegiatan } = useFetchKegiatanSelf();
  const {
    applyKegiatan,
    loading: loadingApplyKegiatan,
    error: errorApplyKegiatan
  } = useApplyKegiatan();

  useEffect(() => {
    if (detailKegiatan) {
      setNamaKegiatan(detailKegiatan.nama_kegiatan || "");
      setTopic(detailKegiatan.topic?.topic_nama || "");
      setJenisKegiatan(detailKegiatan.jenis_kegiatan?.jenis_kegiatan || "");
      setStartDate(detailKegiatan.start_date || "");
      setEndDate(detailKegiatan.end_date || "");
      setDeadline(detailKegiatan.deadline || "");
      setLocation(detailKegiatan.location || "");
      setJumlahRelawan(detailKegiatan.relawan_dibutuhkan || "");
      setTotalJamKerja(detailKegiatan.total_jam_kerja || "");
      setTugasRelawan(detailKegiatan.tugas_relawan || "");
      setKriteriaRelawan(detailKegiatan.kriteria_relawan || "");
      setDeskripsiKegiatan(detailKegiatan.deskripsi_kegiatan || "");
      setImage(detailKegiatan.image || "");
      setKabupaten(detailKegiatan.kabupaten?.kabupaten || "");
      setProvinsi(detailKegiatan.provinsi?.provinsi || "");
      setStatus(detailKegiatan.status || "");
    }
  }, [detailKegiatan]);

  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleDaftar = async (kegiatan_id: number) => {
    try {
      const result = await applyKegiatan({
        kegiatan_id: kegiatan_id,
        status: status
      });
      if (result.success) {
        Alert.alert("Berhasil", result.message, [
          {
            text: "OK",
            onPress: () => {
              router.push("/(tabs)/relawan");
            }
          }
        ]);
      } else {
        Alert.alert("Gagal", result.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Calculate average rating
  const calculateAverageRating = () => {
    if (!detailKegiatan?.subs_kegiatan || detailKegiatan.subs_kegiatan.length === 0) {
      return 0;
    }
    const ratings = detailKegiatan.subs_kegiatan
      .map(subs => subs.rating)
      .filter(rating => rating !== null && rating !== undefined);
    if (ratings.length === 0) {
      return 0;
    }
    const sum = ratings.reduce((acc, rating) => acc + rating, 0);
    return Number((sum / ratings.length).toFixed(1));
  };
  const averageRating = calculateAverageRating();

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
              Detail Kegiatan
            </Text>
            <Text style={tw`text-white text-sm italic`}>
              Data Kegiatan yang telah diisi
            </Text>
          </View>
          {/* <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity> */}
        </View>
      </View>
      <View style={tw`flex-1 p-6 pt-2 mt-1`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={tw`text-white text-xs px-2 py-1 rounded-2xl ${
              status === "Verified" ? "bg-green-500" : ""
            } ${status === "Berjalan" ? "bg-blue-500" : ""} ${
              status === "Selesai" ? "bg-green-500" : ""
            }`}>
            {status === "Verified"
              ? "Daftar Sekarang Juga!"
              : status === "Berjalan"
              ? "Sedang Berjalan"
              : status === "Selesai"
              ? "Selesai"
              : ""}
          </Text>
        </View>
        
        {/* Image Display */}
        {image && (
          <View style={tw`mt-4 mb-4`}>
            <Image
              source={{ uri: `${API_URL}/${image}` }}
              style={tw`w-full h-48 rounded-lg`}
              resizeMode="cover"
            />
          </View>
        )}
        
        <View style={tw`mt-3`}>
          <Text style={tw`text-black text-lg font-medium`}>{namaKegiatan}</Text>
          <Text style={tw`text-gray-500 text-sm mt-1`}>
            {`Topic: ${topic}, Event: ${jenisKegiatan}`}
          </Text>
          <View style={tw`flex-row items-center mt-3`}>
            <Text style={tw`text-blue-500 text-sm mr-2`}>
              Average Rating: {averageRating.toFixed(1)}
            </Text>
            {averageRating > 0 && (
              <View style={tw`flex-row items-center`}>
                {[...Array(5)].map((_, index) => (
                  <Ionicons
                    key={index}
                    name={index < Math.floor(averageRating) ? "star" : "star-outline"}
                    size={16}
                    color={index < Math.floor(averageRating) ? "#FFD700" : "#D3D3D3"}
                    style={tw`ml-0.5`}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
        <View style={tw`h-0.5 bg-gray-200 mt-5 mb-2`} />
        <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-1 pt-2 mt-2 pb-32`}
        refreshControl={
          <RefreshControl
            refreshing={loadingDetailKegiatan}
            onRefresh={() => {}}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }>
          <View style={tw`mt-3 flex-row justify-between items-center`}>
            <Text style={tw`text-gray-700 font-sm`}>
              {`${formatDate(startDate)} - ${formatDate(endDate)}`}
            </Text>
            {(status === "Draft" || status === "Verified") && (
              <Text style={tw`text-red-500 text-sm italic`}>
                Deadline: {formatDate(deadline)}
              </Text>
            )}
          </View>
          <Text style={tw`text-black font-sm mt-4`}>
            {`${provinsi}, ${kabupaten}`}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-2`}>{location}</Text>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Jumlah Relawan Dibutuhkan:
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {`${jumlahRelawan} Orang`}
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Total Jam Kerja :
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {`${totalJamKerja} Jam`}
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Kriteria Relawan:
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {kriteriaRelawan}
            </Text>
          </View>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            {`Deskripsi: ${deskripsiKegiatan}`}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            {`Tugas: ${tugasRelawan}`}
          </Text>
          <View style={tw`h-0.5 bg-gray-200 mt-3 mb-2`} />
          <Text style={tw`text-blue-600 text-sm mt-2 italic`}>
            {`Total Pendaftar: ${
              detailKegiatan?.subs_kegiatan?.length || 0
            } Relawan`}
          </Text>
          {errorApplyKegiatan && (
            <Text style={tw`text-red-500 font-sm mt-3 italic`}>
              {errorApplyKegiatan}
            </Text>
          )}
          {status === "Verified" &&
            detailKegiatan?.subs_kegiatan?.length === 0 && (
              <>
                <TouchableOpacity
                  style={tw`bg-blue-600 rounded-full px-5 py-3 mt-10`}
                  disabled={loadingApplyKegiatan}
                  onPress={() => {
                    if (detailKegiatan?.perlu_pertanyaan === "Y") {
                      router.push({
                        pathname: "/relawan/kegiatan/daftar",
                        params: {
                          id: id
                        }
                      });
                    } else {
                      handleDaftar(Number(id));
                    }
                  }}>
                  <Text style={tw`text-white text-sm text-center font-bold`}>
                    Daftar Sekarang!
                  </Text>
                </TouchableOpacity>
              </>
            )}
          {status === "Verified" && detailKegiatan?.subs_kegiatan?.length !== 0 && (
              <>
                <Text
                  style={tw`text-blue-500 p-5 text-sm text-center italic mt-10`}>
                  {`Anda Sudah Mendaftar! Mohon tunggu konfirmasi dari pihak organisasi.`}
                </Text>
              </>
            )}
          {status === "Berjalan" && (
            <Text style={tw`text-red-500 text-sm text-center italic mt-10`}>
              Tidak dapat mendaftar karena event sudah berjalan
            </Text>
          )}
          {status === "Selesai" && (
            <Text style={tw`text-red-500 text-sm text-center italic mt-10`}>
              Tidak dapat mendaftar karena event sudah selesai
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
