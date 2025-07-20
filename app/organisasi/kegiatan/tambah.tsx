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
import * as DocumentPicker from "expo-document-picker";
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
  const [dokumenPendukung, setDokumenPendukung] = useState<string>("");
  const [dokumenPendukungError, setDokumenPendukungError] = useState<string>("");
  
  // Validation state
  const [namaKegiatanError, setNamaKegiatanError] = useState("");
  const [selectedTopicError, setSelectedTopicError] = useState("");
  const [selectedJenisKegiatanError, setSelectedJenisKegiatanError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [jumlahRelawanError, setJumlahRelawanError] = useState("");
  const [totalJamKerjaError, setTotalJamKerjaError] = useState("");
  const [kriteriaRelawanError, setKriteriaRelawanError] = useState("");
  const [tugasRelawanError, setTugasRelawanError] = useState("");
  const [deskripsiKegiatanError, setDeskripsiKegiatanError] = useState("");
  
  const { submitKegiatan, loading: submitting } = useSubmitKegiatan();
  const { updateKegiatan, loading: updating } = useUpdateKegiatan();
  const { refetch: refetchKegiatan } = useFetchKegiatanSelf();

  // Validation functions
  const validateNamaKegiatan = (text: string) => {
    if (!text) {
      setNamaKegiatanError("Nama kegiatan wajib diisi");
    } else if (text.length < 5) {
      setNamaKegiatanError("Nama kegiatan minimal 5 karakter");
    } else {
      setNamaKegiatanError("");
    }
  };

  const validateSelectedTopic = (value: number | null) => {
    if (!value) {
      setSelectedTopicError("Topik wajib dipilih");
    } else {
      setSelectedTopicError("");
    }
  };

  const validateSelectedJenisKegiatan = (value: number | null) => {
    if (!value) {
      setSelectedJenisKegiatanError("Jenis kegiatan wajib dipilih");
    } else {
      setSelectedJenisKegiatanError("");
    }
  };

  const validateLocation = (text: string) => {
    if (!text) {
      setLocationError("Lokasi kegiatan wajib diisi");
    } else if (text.length < 5) {
      setLocationError("Lokasi kegiatan minimal 5 karakter");
    } else {
      setLocationError("");
    }
  };

  const validateJumlahRelawan = (text: string) => {
    if (!text) {
      setJumlahRelawanError("Jumlah relawan wajib diisi");
    } else if (!/^\d+$/.test(text)) {
      setJumlahRelawanError("Jumlah relawan harus berupa angka");
    } else {
      setJumlahRelawanError("");
    }
  };

  const validateTotalJamKerja = (text: string) => {
    if (!text) {
      setTotalJamKerjaError("Total jam kerja wajib diisi");
    } else if (!/^\d+$/.test(text)) {
      setTotalJamKerjaError("Total jam kerja harus berupa angka");
    } else {
      setTotalJamKerjaError("");
    }
  };

  const validateKriteriaRelawan = (text: string) => {
    if (!text) {
      setKriteriaRelawanError("Kriteria relawan wajib diisi");
    } else if (text.length < 5) {
      setKriteriaRelawanError("Kriteria relawan minimal 5 karakter");
    } else {
      setKriteriaRelawanError("");
    }
  };

  const validateTugasRelawan = (text: string) => {
    if (!text) {
      setTugasRelawanError("Tugas relawan wajib diisi");
    } else {
      setTugasRelawanError("");
    }
  };

  const validateDeskripsiKegiatan = (text: string) => {
    if (!text) {
      setDeskripsiKegiatanError("Deskripsi kegiatan wajib diisi");
    } else {
      setDeskripsiKegiatanError("");
    }
  };

  const validateDokumenPendukung = (text: string) => {
    if (!text) {
      setDokumenPendukungError("Dokumen pendukung wajib diisi");
    } else {
      setDokumenPendukungError("");
    }
  };

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
      setDokumenPendukung(editData.dokumen_pendukung || "");
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
      // If end date exists and is before start date, clear it
      if (endDate && new Date(endDate) < date) {
        setEndDate("");
        setEndDateError("Tanggal berakhir tidak boleh sebelum tanggal mulai");
      }
      // If deadline exists and is after new start date, clear it
      if (deadline && new Date(deadline) > date) {
        setDeadline("");
        setDeadlineError("Deadline tidak boleh setelah tanggal mulai");
      }
    }
    setShowStartDatePicker(false);
  };

  const handleEndDateConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setEndDateError("Tanggal tidak boleh di masa lalu");
      setEndDate("");
    } else if (startDate && date < new Date(startDate)) {
      setEndDateError("Tanggal berakhir tidak boleh sebelum tanggal mulai");
      setEndDate("");
    } else {
      setEndDateError("");
      setEndDate(date.toISOString());
    }
    setShowEndDatePicker(false);
  };

  const handleDeadlineConfirm = (date: Date) => {
    // const today = new Date();
    // today.setHours(0, 0, 0, 0);
    // Remove validation for deadline in the past
    if (startDate && date > new Date(startDate)) {
      setDeadlineError("Deadline tidak boleh setelah tanggal mulai");
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

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/*'
        ],
        copyToCacheDirectory: true
      });

      if (!result.canceled) {
        const selectedFile = result.assets[0];
        
        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        setDokumenPendukung(base64);
        validateDokumenPendukung(base64);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file. Please try again.");
    }
  };

  const handleSubmit = async () => {
    // Validate all fields before submission
    validateNamaKegiatan(namaKegiatan);
    validateSelectedTopic(selectedTopic);
    validateSelectedJenisKegiatan(selectedJenisKegiatan);
    validateLocation(location);
    validateJumlahRelawan(jumlahRelawan);
    validateTotalJamKerja(totalJamKerja);
    validateKriteriaRelawan(kriteriaRelawan);
    validateTugasRelawan(tugasRelawan);
    validateDeskripsiKegiatan(deskripsiKegiatan);
    validateDokumenPendukung(dokumenPendukung);

    // Check if there are any errors
    if (namaKegiatanError || selectedTopicError || selectedJenisKegiatanError || 
        locationError || jumlahRelawanError || totalJamKerjaError || 
        kriteriaRelawanError || tugasRelawanError || deskripsiKegiatanError ||
        startDateError || endDateError || deadlineError || dokumenPendukungError) {
      Alert.alert('Error', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    if (
      !namaKegiatan ||
      !selectedTopic ||
      !selectedJenisKegiatan ||
      !startDate ||
      !endDate ||
      !location ||
      !jumlahRelawan ||
      !totalJamKerja ||
      !kriteriaRelawan ||
      !tugasRelawan ||
      !deskripsiKegiatan ||
      !deadline ||
      !dokumenPendukung
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
      dokumen_pendukung: dokumenPendukung,
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
        <View style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
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
              onChangeText={(text) => {
                setNamaKegiatan(text);
                validateNamaKegiatan(text);
              }}
            />
            {namaKegiatanError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{namaKegiatanError}</Text>
            ) : null}
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
                const topicValue = value ? parseInt(value) : null;
                setSelectedTopic(topicValue);
                validateSelectedTopic(topicValue);
              }}
              hasError={errorTopic ? true : false}
              loading={loadingTopic}
            />
            {selectedTopicError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{selectedTopicError}</Text>
            ) : null}
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
                const jenisValue = value ? parseInt(value) : null;
                setSelectedJenisKegiatan(jenisValue);
                validateSelectedJenisKegiatan(jenisValue);
              }}
              hasError={errorJenisKegiatan ? true : false}
              loading={loadingJenisKegiatan}
            />
            {selectedJenisKegiatanError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{selectedJenisKegiatanError}</Text>
            ) : null}
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
                <Text style={tw`text-red-500 text-xs mt-1`}>
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
                <Text style={tw`text-red-500 text-xs mt-1`}>
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
                <Text style={tw`text-red-500 text-xs mt-1`}>
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
              onChangeText={(text) => {
                setLocation(text);
                validateLocation(text);
              }}
            />
            {locationError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{locationError}</Text>
            ) : null}
          </View>
          <View style={tw`w-full mb-3 flex-row items-center justify-between`}>
            <View style={tw`w-[48%]`}>
              <TextInput
                style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
                placeholder="Relawan Dibutuhkan (*)"
                placeholderTextColor="gray"
                autoCapitalize="none"
                keyboardType="numeric"
                value={jumlahRelawan}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setJumlahRelawan(numericText);
                  validateJumlahRelawan(numericText);
                }}
              />
              {jumlahRelawanError ? (
                <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{jumlahRelawanError}</Text>
              ) : null}
            </View>
            <View style={tw`w-[48%]`}>
              <TextInput
                style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
                placeholder="Total Jam Kerja (*)"
                placeholderTextColor="gray"
                autoCapitalize="none"
                keyboardType="numeric"
                value={totalJamKerja}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setTotalJamKerja(numericText);
                  validateTotalJamKerja(numericText);
                }}
              />
              {totalJamKerjaError ? (
                <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{totalJamKerjaError}</Text>
              ) : null}
            </View>
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Kriteria Relawan (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={kriteriaRelawan}
              onChangeText={(text) => {
                setKriteriaRelawan(text);
                validateKriteriaRelawan(text);
              }}
            />
            {kriteriaRelawanError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{kriteriaRelawanError}</Text>
            ) : null}
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-lg w-full border border-gray-200 min-h-[80px]`}
              placeholder="Tugas Relawan (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={tugasRelawan}
              onChangeText={(text) => {
                setTugasRelawan(text);
                validateTugasRelawan(text);
              }}
              multiline={true}
              numberOfLines={2}
              textAlignVertical="top"
            />
            {tugasRelawanError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{tugasRelawanError}</Text>
            ) : null}
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-lg w-full border border-gray-200 min-h-[100px]`}
              placeholder="Deskripsi Kegiatan (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={deskripsiKegiatan}
              onChangeText={(text) => {
                setDeskripsiKegiatan(text);
                validateDeskripsiKegiatan(text);
              }}
              multiline={true}
              numberOfLines={3}
              textAlignVertical="top"
            />
            {deskripsiKegiatanError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{deskripsiKegiatanError}</Text>
            ) : null}
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
          <View style={tw`w-full mb-3`}>
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
                {dokumenPendukung ? "Change Dokumen Pendukung" : "Select Dokumen Pendukung (*)"}
              </Text>
            </TouchableOpacity>
            {dokumenPendukung && (
              <View style={tw`mt-2 p-3 bg-gray-100 rounded-lg`}>
                <Text style={tw`text-gray-700 text-sm`}>
                  File selected successfully
                </Text>
              </View>
            )}
            {dokumenPendukungError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                {dokumenPendukungError}
              </Text>
            ) : null}
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
