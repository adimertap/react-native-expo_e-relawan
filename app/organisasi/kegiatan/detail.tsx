import { useAuthContext } from "@/src/contexts/AuthContext";
import { useDeleteKegiatan } from "@/src/hooks/Organisasi/useDeleteKegiatan";
import { useFetchDetailKegiatan } from "@/src/hooks/Organisasi/useFetchDetailKegiatan";
import { useVerifikasiKegiatan } from "@/src/hooks/Organisasi/useVerifikasiKegiatan";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";
import ModalApply from "./modal/modalApply";

export default function DetailKegiatanScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { authState, logout } = useAuthContext();
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    detailKegiatan,
    refetch: refetchKegiatan,
    loading: loadingDetailKegiatan,
    error: errorDetailKegiatan
  } = useFetchDetailKegiatan(Number(id));
  const {
    deleteKegiatan,
    loading: loadingDeleteKegiatan,
    error: errorDeleteKegiatan
  } = useDeleteKegiatan();
  const {
    verifikasiKegiatan,
    loading: loadingVerifikasiKegiatan,
    error: errorVerifikasiKegiatan
  } = useVerifikasiKegiatan();
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
  const [isPertanyaan, setIsPertanyaan] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [kabupaten, setKabupaten] = useState<string>("");
  const [provinsi, setProvinsi] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubs, setSelectedSubs] = useState<any>(null);

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
      setIsPertanyaan(detailKegiatan.perlu_pertanyaan || "");
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

  const handleDeleteKegiatan = async () => {
    try {
      Alert.alert(
        "Hapus Kegiatan",
        "Apakah anda yakin ingin menghapus kegiatan ini?",
        [
          { text: "Batal", style: "cancel" },
          {
            text: "Hapus",
            onPress: async () => {
              await deleteKegiatan(Number(id));
              await refetchKegiatan(Number(id));
              router.replace("/organisasi");
            }
          }
        ]
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifikasi = async (subs_kegiatan_id: number) => {
    try {
      const subs = detailKegiatan?.subs_kegiatan?.find(
        (s) => s.subs_kegiatan_id === subs_kegiatan_id
      );
      if (isPertanyaan === "Y") {
        setSelectedSubs(subs);
        setModalVisible(true);
      } else {
        await verifikasiKegiatan(Number(id), subs?.user_id || 0);
        Alert.alert("Berhasil", "Relawan berhasil diverifikasi");
        await refetchKegiatan(Number(id));
        setModalVisible(false);
        setSelectedSubs(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmVerifikasi = async () => {
    try {
      await verifikasiKegiatan(Number(id), selectedSubs?.user_id || 0);
      Alert.alert("Berhasil", "Relawan berhasil diverifikasi");
      await refetchKegiatan(Number(id));
      setModalVisible(false);
      setSelectedSubs(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-gray-600 rounded-b-3xl mb-3 py-1`}>
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
          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={tw`p-6 pt-3 mt-4`}>
        <View style={tw`flex-row items-center justify-between`}>
          <Text
            style={tw`text-white text-xs px-2 py-1 rounded-2xl ${
              status === "Draft" ? "bg-red-500" : ""
            } ${status === "Verified" ? "bg-green-500" : ""} ${
              status === "Run" ? "bg-blue-500" : ""
            } ${status === "Completed" ? "bg-green-500" : ""} ${
              status === "Cancelled" ? "bg-red-500" : ""
            }`}>
            {status === "Draft" && "Menunggu Persetujuan"}
            {status === "Verified" && "Terverifikasi"}
            {status === "Run" && "Sedang Berjalan"}
            {status === "Completed" && "Selesai"}
            {status === "Cancelled" && "Dibatalkan oleh Admin"}
          </Text>
          <View style={tw`flex-row items-center justify-end `}>
            {status === "Draft" && (
              <>
                <TouchableOpacity
                  style={tw`bg-blue-500 py-2 px-5 rounded-full flex-row items-center justify-center ${
                    loadingDetailKegiatan ? "opacity-50" : ""
                  }`}
                  onPress={() =>
                    router.push({
                      pathname: "/organisasi/kegiatan/tambah",
                      params: {
                        isEdit: "true",
                        data: JSON.stringify(detailKegiatan)
                      }
                    })
                  }
                  disabled={loadingDetailKegiatan}>
                  <Ionicons name="pencil-outline" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`bg-red-500 py-2 px-5 ml-5 rounded-full flex-row items-center justify-center ${
                    loadingDetailKegiatan ? "opacity-50" : ""
                  }`}
                  onPress={handleDeleteKegiatan}
                  disabled={loadingDetailKegiatan}>
                  <Ionicons name="trash-outline" size={18} color="white" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        <View style={tw`mt-7`}>
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
              refreshing={loadingDetailKegiatan}
              onRefresh={() => {}}
              colors={["#2563eb"]}
              tintColor="#2563eb"
            />
          }>
          <View style={tw`mt-3 flex-row justify-between items-center`}>
            <Text style={tw`text-gray-700 font-sm`}>
              {formatDate(startDate)} - {formatDate(endDate)}
            </Text>
            <Text style={tw`text-red-500 text-sm italic`}>
              Deadline: {formatDate(deadline)}
            </Text>
          </View>
          <Text style={tw`text-black font-sm mt-4`}>
            {provinsi}, {kabupaten}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-2`}>{location}</Text>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Jumlah Relawan Dibutuhkan:{" "}
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {jumlahRelawan} Orang
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Total Jam Kerja:{" "}
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              -+ {totalJamKerja} Jam
            </Text>
          </View>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-gray-600 font-sm mt-3`}>
              Kriteria Relawan:{" "}
            </Text>
            <Text style={tw`text-gray-800 font-sm mt-3 italic`}>
              {kriteriaRelawan}
            </Text>
          </View>
          <View style={tw`h-0.5 bg-gray-200 mt-4 mb-2`} />
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            Deskripsi {deskripsiKegiatan}
          </Text>
          <Text style={tw`text-gray-600 font-sm mt-3`}>
            Tugas {tugasRelawan}
          </Text>
          <View style={tw`h-0.5 bg-gray-200 mt-3 mb-2`} />
          <>
            <View style={tw`mt-3 justify-between flex-row items-center`}>
              <Text style={tw`text-black text-sm italic mt-3`}>
                List Relawan
              </Text>
              <Text style={tw`text-gray-500 text-sm italic`}>
                Total: {detailKegiatan?.subs_kegiatan?.length} Relawan
              </Text>
            </View>
            {detailKegiatan?.subs_kegiatan?.map((subs) => (
              <View
                key={subs.subs_kegiatan_id}
                style={tw`flex-row items-center justify-between bg-gray-200 p-2 py-2 rounded-md mt-3`}>
                <Text style={tw`text-gray-600 text-sm`}>{subs.user?.nama}</Text>
                {subs.is_verified === "Y" ? (
                  <Text style={tw`text-blue-500 italic text-sm`}>Diterima</Text>
                ) : (
                  <>
                    {status === "Verified" && (
                      <TouchableOpacity
                        style={tw`bg-blue-500 px-3 py-1 rounded-md`}
                        onPress={() =>
                          handleVerifikasi(subs.subs_kegiatan_id || 0)
                        }>
                        <Text style={tw`text-white text-xs`}>Verifikasi</Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>
            ))}
          </>
        </ScrollView>
      </View>

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
