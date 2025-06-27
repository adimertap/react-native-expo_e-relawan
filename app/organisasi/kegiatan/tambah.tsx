import DateTimePickerModal from "@/components/new/DateTimePickerModal";
import DropdownComponent from "@/components/new/Dropdown";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchJenisKegiatan } from "@/src/hooks/Master/useFetchJenisKegiatan";
import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
import { useFetchKegiatanSelf } from "@/src/hooks/Organisasi/useFetchKegiatanSelf";
import { useSubmitKegiatan } from "@/src/hooks/Organisasi/useSubmitKegiatan";
import { useUpdateKegiatan } from "@/src/hooks/Organisasi/useUpdateKegiatan";
import { JenisKegiatanType, TopicType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

export default function AddKegiatanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const isEdit = params.isEdit === "true";
  const editData = params.data ? JSON.parse(params.data as string) : null;
  const { authState, logout } = useAuthContext();
  const scrollViewRef = useRef<ScrollView>(null);
  // topic
  const [topicList, setTopicList] = useState<TopicType[]>([]);
  const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  // jenis kegiatan
  const [jenisKegiatanList, setJenisKegiatanList] = useState<
    JenisKegiatanType[]
  >([]);
  const {
    jenisKegiatan,
    loading: loadingJenisKegiatan,
    error: errorJenisKegiatan
  } = useFetchJenisKegiatan();
  const [selectedJenisKegiatan, setSelectedJenisKegiatan] = useState<
    number | null
  >(null);

  // date
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [startDateError, setStartDateError] = useState<string>("");
  const [endDateError, setEndDateError] = useState<string>("");
  const [deadline, setDeadline] = useState<string>("");
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [location, setLocation] = useState<string>("");
  const [jumlahRelawan, setJumlahRelawan] = useState<string>("");
  const [totalJamKerja, setTotalJamKerja] = useState<string>("");
  const [tugasRelawan, setTugasRelawan] = useState<string>("");
  const [namaKegiatan, setNamaKegiatan] = useState<string>("");
  const [kriteriaRelawan, setKriteriaRelawan] = useState<string>("");
  const [deskripsiKegiatan, setDeskripsiKegiatan] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [base64Image, setBase64Image] = useState<string>("");
  const [perluPertanyaan, setPerluPertanyaan] = useState<boolean>(false);
  const [deadlineError, setDeadlineError] = useState<string>("");
  const { submitKegiatan, loading: submitting } = useSubmitKegiatan();
  const { updateKegiatan, loading: updating } = useUpdateKegiatan();
  const { refetch: refetchKegiatan } = useFetchKegiatanSelf();

  useEffect(() => {
    if (topic) {
      setTopicList(topic);
    }
    if (jenisKegiatan) {
      setJenisKegiatanList(jenisKegiatan);
    }
  }, [topic, jenisKegiatan]);

  // Set initial edit data only once
  useEffect(() => {
    if (isEdit && editData) {
      setNamaKegiatan(editData.nama_kegiatan || "");
      setSelectedTopic(editData.topic_id || null);
      setSelectedJenisKegiatan(editData.jenis_kegiatan_id || null);
      setStartDate(editData.start_date || "");
      setEndDate(editData.end_date || "");
      setLocation(editData.location || "");
      setJumlahRelawan(editData.relawan_dibutuhkan || "");
      setTotalJamKerja(editData.total_jam_kerja || "");
      setTugasRelawan(editData.tugas_relawan || "");
      setKriteriaRelawan(editData.kriteria_relawan || "");
      setDeskripsiKegiatan(editData.deskripsi_kegiatan || "");
      setImage(editData.photo || "");
      setBase64Image(editData.photo || "");
      setPerluPertanyaan(editData.perlu_pertanyaan || false);
      setDeadline(editData.deadline || "");
    }
  }, []); // Empty dependency array to run only once

  const handleStartDateConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setStartDateError("Tanggal tidak boleh di masa lalu");
      setStartDate("");
    } else {
      setStartDateError("");
      setStartDate(date.toISOString());
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setEndDateError("Tanggal tidak boleh di masa lalu");
      setEndDate("");
    } else {
      setEndDateError("");
      setEndDate(date.toISOString());
    }
    setShowEndDatePicker(false);
  };

  const handleDeadlineConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      setDeadlineError("Tanggal tidak boleh di masa lalu");
      setDeadline("");
    } else {
      setDeadlineError("");
      setDeadline(date.toISOString());
    }
    setShowDeadlinePicker(false);
  };

  const pickImage = async () => {
    try {
      // Request permissions
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!"
          );
          return;
        }
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true
      });

      if (!result.canceled) {
        const selectedAsset = result.assets[0];
        setImage(selectedAsset.uri);

        // Convert to base64 if not already in base64
        if (selectedAsset.base64) {
          setBase64Image(selectedAsset.base64);
        } else {
          const base64 = await FileSystem.readAsStringAsync(selectedAsset.uri, {
            encoding: FileSystem.EncodingType.Base64
          });
          setBase64Image(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (
      !namaKegiatan ||
      !selectedTopic ||
      !selectedJenisKegiatan ||
      !startDate ||
      !endDate ||
      !location
    ) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    const kegiatanData = {
      nama_kegiatan: namaKegiatan,
      topic_id: selectedTopic,
      jenis_kegiatan_id: selectedJenisKegiatan,
      start_date: startDate,
      end_date: endDate,
      location: location,
      relawan_dibutuhkan: jumlahRelawan,
      total_jam_kerja: totalJamKerja,
      tugas_relawan: tugasRelawan,
      kriteria_relawan: kriteriaRelawan,
      deskripsi_kegiatan: deskripsiKegiatan,
      photo: base64Image,
      perlu_pertanyaan: perluPertanyaan,
      deadline: deadline
    };

    let result;
    if (isEdit && editData) {
      result = await updateKegiatan({
        ...kegiatanData,
        id: editData.kegiatan_id
      });
    } else {
      result = await submitKegiatan(kegiatanData);
    }

    if (result.success) {
      Alert.alert("Sukses", result.message, [
        {
          text: "OK",
          onPress: async () => {
            await refetchKegiatan();
            router.replace("/organisasi");
          }
        }
      ]);
    } else {
      Alert.alert("Error", result.message);
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
              {isEdit ? "Edit Kegiatan" : "Tambah Kegiatan"}
            </Text>
            <Text style={tw`text-white text-sm italic`}>
              {isEdit
                ? "Edit Formulir Kegiatan dibawah"
                : "Isi Formulir Kegiatan dibawah"}
            </Text>
          </View>

          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`px-5`}>
        <View style={tw`w-full mb-1 mt-3`}>
          <Text style={tw`font-medium text-red-500 text-sm italic`}>
            * Wajib diisi
          </Text>
        </View>
        <ScrollView
          ref={scrollViewRef}
          style={tw`mt-4 py-1 mb-30`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={true}
          bounces={false}
          contentContainerStyle={tw`pb-20`}>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Nama Kegiatan (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={namaKegiatan}
              onChangeText={setNamaKegiatan}
            />
          </View>
          <View style={tw`w-full`}>
            <DropdownComponent
              data={topicList.map((item) => ({
                label: item.topic_nama || "",
                value: item.topic_id?.toString() || ""
              }))}
              placeholder="Pilih Topik (*)"
              value={selectedTopic?.toString() || ""}
              onChange={(value) => {
                setSelectedTopic(value ? parseInt(value) : null);
              }}
              hasError={errorTopic ? true : false}
              loading={loadingTopic}
            />
            {errorTopic && (
              <Text style={tw`text-red-500 text-sm`}>{errorTopic}</Text>
            )}
          </View>
          <View style={tw`w-full`}>
            <DropdownComponent
              data={jenisKegiatanList.map((item) => ({
                label: item.jenis_kegiatan || "",
                value: item.jenis_kegiatan_id?.toString() || ""
              }))}
              placeholder="Pilih Jenis Kegiatan (*)"
              value={selectedJenisKegiatan?.toString() || ""}
              onChange={(value) => {
                setSelectedJenisKegiatan(value ? parseInt(value) : null);
              }}
              hasError={errorJenisKegiatan ? true : false}
              loading={loadingJenisKegiatan}
            />
            {errorJenisKegiatan && (
              <Text style={tw`text-red-500 text-sm`}>{errorJenisKegiatan}</Text>
            )}
          </View>
          <View style={tw`w-full mb-0 flex-row items-center justify-between`}>
            <View style={tw`w-[48%] mb-3`}>
              <Pressable
                style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
                onPress={() => setShowStartDatePicker(true)}>
                <Text style={tw`text-gray-500`}>
                  {startDate
                    ? new Date(startDate).toLocaleDateString()
                    : "Mulai  (*)"}
                </Text>
              </Pressable>
              {startDateError ? (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {startDateError}
                </Text>
              ) : null}
              <DateTimePickerModal
                isVisible={showStartDatePicker}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={() => setShowStartDatePicker(false)}
              />
            </View>
            <View style={tw`w-[48%] mb-3`}>
              <Pressable
                style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
                onPress={() => setShowEndDatePicker(true)}>
                <Text style={tw`text-gray-500`}>
                  {endDate
                    ? new Date(endDate).toLocaleDateString()
                    : "Berakhir (*)"}
                </Text>
              </Pressable>
              {endDateError ? (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {endDateError}
                </Text>
              ) : null}
              <DateTimePickerModal
                isVisible={showEndDatePicker}
                mode="date"
                onConfirm={handleEndDateConfirm}
                onCancel={() => setShowEndDatePicker(false)}
              />
            </View>
          </View>
          <View style={tw`w-full mb-3`}>
              <Pressable
                style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
                onPress={() => setShowDeadlinePicker(true)}>
                <Text style={tw`text-gray-500`}>
                  {deadline
                    ? new Date(deadline).toLocaleDateString()
                    : "Deadline  (*)"}
                </Text>
              </Pressable>
              {deadlineError ? (
                <Text style={tw`text-red-500 text-sm mt-1`}>
                  {deadlineError}
                </Text>
              ) : null}
              <DateTimePickerModal
                isVisible={showDeadlinePicker}
                mode="date"
                onConfirm={handleDeadlineConfirm}
                onCancel={() => setShowDeadlinePicker(false)}
              />
            </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Lokasi Kegiatan (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={location}
              onChangeText={setLocation}
            />
          </View>
          <View style={tw`w-full mb-3 flex-row items-center justify-between`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-[48%] border border-gray-200`}
              placeholder="Relawan Dibutuhkan"
              placeholderTextColor="gray"
              autoCapitalize="none"
              keyboardType="numeric"
              value={jumlahRelawan}
              onChangeText={setJumlahRelawan}
            />
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-[48%] border border-gray-200`}
              placeholder="Total Jam Kerja"
              placeholderTextColor="gray"
              autoCapitalize="none"
              keyboardType="numeric"
              value={totalJamKerja}
              onChangeText={setTotalJamKerja}
            />
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Kriteria Relawan"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={kriteriaRelawan}
              onChangeText={setKriteriaRelawan}
            />
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-lg w-full border border-gray-200 min-h-[80px]`}
              placeholder="Tugas Relawan"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={tugasRelawan}
              onChangeText={setTugasRelawan}
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-lg w-full border border-gray-200 min-h-[100px]`}
              placeholder="Deskripsi Kegiatan"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={deskripsiKegiatan}
              onChangeText={setDeskripsiKegiatan}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
          <View style={tw`w-full mb-3`}>
            <TouchableOpacity
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200 flex-row items-center justify-center`}
              onPress={pickImage}>
              <Ionicons
                name="image-outline"
                size={24}
                color="gray"
                style={tw`mr-2`}
              />
              <Text style={tw`text-gray-500`}>
                {image ? "Change Image" : "Select Image"}
              </Text>
            </TouchableOpacity>
            {image && (
              <View style={tw`mt-2`}>
                <Image
                  source={{ uri: image }}
                  style={tw`w-full h-40 rounded-lg`}
                  resizeMode="cover"
                />
              </View>
            )}
          </View>
          {/* Radio Button */}
          <View style={tw`w-full mb-3 mt-3`}>
            <Text style={tw`text-gray-600 text-sm italic mb-2 ml-1`}>
              Perlu Upload CV dan Pertanyaan?
            </Text>
            <View style={tw`flex-row items-center mt-2`}>
              <TouchableOpacity
                style={tw`flex-row items-center mr-4`}
                onPress={() => setPerluPertanyaan(true)}>
                <View
                  style={tw`w-5 h-5 rounded-full border-2 border-gray-400 mr-2 items-center justify-center`}>
                  {perluPertanyaan && (
                    <View style={tw`w-3 h-3 rounded-full bg-blue-600`} />
                  )}
                </View>
                <Text style={tw`text-gray-700`}>Ya</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={tw`flex-row items-center`}
                onPress={() => setPerluPertanyaan(false)}>
                <View
                  style={tw`w-5 h-5 rounded-full border-2 border-gray-400 mr-2 items-center justify-center`}>
                  {!perluPertanyaan && (
                    <View style={tw`w-3 h-3 rounded-full bg-blue-600`} />
                  )}
                </View>
                <Text style={tw`text-gray-700`}>Tidak</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`w-full mb-15 mt-5`}>
            <TouchableOpacity
              style={tw`bg-blue-600 py-4 px-4 rounded-full w-full ${
                submitting || updating ? "opacity-50" : ""
              }`}
              onPress={handleSubmit}
              disabled={submitting || updating}>
              <Text style={tw`text-white text-center`}>
                {submitting || updating
                  ? "Mengirim..."
                  : isEdit
                  ? "Update Kegiatan"
                  : "Tambah Kegiatan"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
