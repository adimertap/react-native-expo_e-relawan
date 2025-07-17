import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchDetailKegiatan } from "@/src/hooks/Organisasi/useFetchDetailKegiatan";
import { useFetchKegiatanSelf } from "@/src/hooks/Organisasi/useFetchKegiatanSelf";
import { useApplyKegiatan } from "@/src/hooks/Relawan/useApplyKegiatan";
import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from 'expo-document-picker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function DaftarKegiatanRelawanScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { authState, logout } = useAuthContext();

  const {
    detailKegiatan,
    loading: loadingDetailKegiatan,
    error: errorDetailKegiatan
  } = useFetchDetailKegiatan(Number(id));
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [topic, setTopic] = useState<string>("");
  const [jenisKegiatan, setJenisKegiatan] = useState<string>("");
  const { refetch: refetchKegiatan } = useFetchKegiatanSelf();
  const [mengapaKamiHarusMemilihAnda, setMengapaKamiHarusMemilihAnda] =
    useState<string>("");
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerResult | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const { applyKegiatan, loading: loadingApplyKegiatan, error: errorApplyKegiatan } = useApplyKegiatan();

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        setSelectedFile(result);
        setFileName(result.assets[0].name || 'user_cv.pdf');
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!mengapaKamiHarusMemilihAnda.trim()) {
      Alert.alert("Error", "Mohon isi alasan mengapa kami harus memilih Anda");
      return;
    }

    try {
      const result = await applyKegiatan({
        kegiatan_id: Number(id),
        about_me: mengapaKamiHarusMemilihAnda,
        user_cv: selectedFile || undefined,
        status: 'pending'
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
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan saat mendaftar");
    }
  };

  useEffect(() => {
    if (detailKegiatan) {
      setNamaKegiatan(detailKegiatan.nama_kegiatan || "");
      setTopic(detailKegiatan.topic?.topic_nama || "");
      setJenisKegiatan(detailKegiatan.jenis_kegiatan?.jenis_kegiatan || "");
    }
  }, [detailKegiatan]);

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
              Daftar Kegiatan
            </Text>
            <Text style={tw`text-white text-sm italic`}>
              Formulir Pendaftaran Kegiatan
            </Text>
          </View>
          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={tw`flex-1`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tw`p-6 pt-1 mt-5 pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={loadingDetailKegiatan}
            onRefresh={() => {}}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }>
        <View style={tw`mt-2`}>
          <Text style={tw`text-black text-lg font-medium`}>{namaKegiatan}</Text>
          <Text style={tw`text-gray-500 text-sm mt-1`}>
            Topic: {topic}, Event: {jenisKegiatan}
          </Text>
        </View>
        <View style={tw`h-0.5 bg-gray-200 mt-5 mb-2`} />
        <View>
          <Text style={tw`text-red-500 italic font-sm mt-3 mb-6`}>
            Silahkan isi formulir pendaftaran
          </Text>
          <View style={tw`w-full mb-5`}>
            <Text style={tw`text-gray-600 font-sm mb-2 italic`}>
              Mengapa Kami Harus Memilih Anda? (Maksimal 300 kata)
            </Text>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-lg w-full border border-gray-200 min-h-[200px]`}
              placeholder="Isi disini..."
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={mengapaKamiHarusMemilihAnda}
              onChangeText={setMengapaKamiHarusMemilihAnda}
              multiline={true}
              numberOfLines={5}
              textAlignVertical="top"
              maxLength={300}
              keyboardType="default"
            />
          </View>
          <View style={tw`w-full mb-3 mt-3`}>
            <Text style={tw`text-gray-600 text-sm italic mb-2 ml-1`}>
              Upload CV (PDF/DOC/DOCX)
            </Text>
            <TouchableOpacity
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200 flex-row items-center justify-center`}
              onPress={pickFile}>
              <Ionicons
                name="document-outline"
                size={24}
                color="gray"
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-500`}>
                {fileName ? fileName : "Select File"}
              </Text>
            </TouchableOpacity>
            {fileName && (
              <Text style={tw`text-gray-500 text-sm mt-2`}>
                Selected file: {fileName}
              </Text>
            )}
          </View>
        </View>
        <View style={tw`h-0.5 bg-gray-200 mt-5 mb-2`} />
        {errorApplyKegiatan && (
          <Text style={tw`text-red-500 text-sm mt-2 mb-2`}>
            {errorApplyKegiatan}
          </Text>
        )}
        <TouchableOpacity 
          style={tw`bg-blue-600 rounded-full px-5 py-3 mt-5`}
          onPress={handleSubmit}
          disabled={loadingApplyKegiatan}>
          {loadingApplyKegiatan ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={tw`text-white text-sm text-center font-bold`}>
              Daftar!
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
