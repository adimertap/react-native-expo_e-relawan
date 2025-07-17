import { API_URL } from "@/src/constants/env";
import { useRatingRelawan } from "@/src/hooks/Organisasi/useRatingRelawan";
import { Ionicons } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import tw from "twrnc";

interface ModalApplyProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedSubs: any;
  setSelectedSubs: (subs: any) => void;
  isPertanyaan: string;
  handleConfirmVerifikasi: () => void;
  handleConfirmTolak: () => void;
  refetch: () => void;
}

export default function ModalApply({
  modalVisible,
  setModalVisible,
  selectedSubs,
  setSelectedSubs,
  isPertanyaan,
  handleConfirmVerifikasi,
  handleConfirmTolak,
  refetch
}: ModalApplyProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { ratingRelawan, loading } = useRatingRelawan();
  // const formatDate = (date: string) => {
  //   if (!date) return "-";
  //   const dateObj = new Date(date);
  //   const day = dateObj.getDate().toString().padStart(2, "0");
  //   const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  //   const year = dateObj.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  // Helper to remove 'public/' or 'public\\' prefix if present and normalize slashes
  const getCVUrl = (cvPath: string) => {
    if (!cvPath) return "";
    // Remove 'public/' or 'public\\' at the start
    let cleanPath = cvPath.replace(/^public[\\\/]/, "");
    // Replace all backslashes with forward slashes
    cleanPath = cleanPath.replace(/\\/g, "/");
    return cleanPath;
  };

  const handleKirimReview = async () => {
    try {
      await ratingRelawan(selectedSubs?.subs_kegiatan_id, rating, review);
      Alert.alert("Success", "Review berhasil dikirim");
      setModalVisible(false);
      setSelectedSubs(null);
      setRating(0);
      setReview("");
      if (refetch) {
        refetch();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Terjadi kesalahan saat mengirim review");
    }
  };

  const handleDownloadCV = async () => {
    if (!selectedSubs?.user_cv) {
      Alert.alert("CV tidak tersedia");
      return;
    }
    try {
      // Construct the full URL to the CV file
      const fileUrl = `${API_URL}/${getCVUrl(selectedSubs.user_cv)}`;
      console.log(fileUrl);
      // Get file extension
      const fileName = getCVUrl(selectedSubs.user_cv).split('/').pop() || 'cv_downloaded.pdf';
      console.log(fileName);
      // Set download path
      const downloadDir = FileSystem.documentDirectory; // For Expo
      const localPath = `${downloadDir}${fileName}`;
      console.log(localPath);
      // For Android, request permission if needed (not required for app sandbox)
      // Download the file
      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        localPath
      );
      console.log(downloadResumable);
      const result = await downloadResumable.downloadAsync();
      console.log(result);
      if (result && result.uri) {
        // Offer to share or move the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(result.uri);
        } else {
          Alert.alert('Success', `CV berhasil diunduh ke folder aplikasi: ${result.uri}`);
        }
      } else {
        Alert.alert('Error', 'Gagal mengunduh CV');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Gagal mengunduh CV');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setSelectedSubs(null);
      }}>
      <View style={tw`flex-1 justify-end rounded-t-3xl bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6 w-[100%] max-w-[400px]`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xl font-bold mb-2 mt-1 text-center`}>
              {selectedSubs?.is_verified === "N"
                ? "Verifikasi Relawan"
                : "Detail Relawan"}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={tw`h-0.5 bg-gray-200 mt-1 mb-2`} />
          {selectedSubs && (
            <View style={tw`mb-5`}>
              <Text style={tw`text-gray-700 mb-2 font-bold text-base`}>
                Nama: {selectedSubs.user?.nama}
              </Text>
              <Text style={tw`text-gray-700 mb-2`}>
                Jenis Kelamin: {selectedSubs.user?.jenis_kelamin || ""}
              </Text>
              {/* <Text style={tw`text-gray-700 mb-2`}>
                Tanggal Lahir:{" "}
                {formatDate(selectedSubs.user?.tanggal_lahir || "")}
              </Text> */}
              {/* <Text style={tw`text-gray-700 mb-2`}>
                Alamat: {selectedSubs.user?.alamat || ""}
              </Text> */}
              <Text style={tw`text-gray-700 mb-2`}>
                Email: {selectedSubs.user?.email || ""}
              </Text>
              <Text style={tw`text-gray-700 mb-2`}>
                No. HP: {selectedSubs.user?.phone || ""}
              </Text>
              <View style={tw`h-0.4 bg-gray-200 mt-3 mb-1`} />
              {isPertanyaan === "Y" && (
                <>
                  <View>
                    <Text style={tw`text-blue-600 mb-2 italic mt-3`}>
                      {selectedSubs.about_me || "Tidak ada keterangan"}
                    </Text>
                  </View>
                  <View>
                    {selectedSubs.user_cv ? (
                      <TouchableOpacity onPress={handleDownloadCV} style={tw`flex-row items-center`}>
                        <Ionicons name="download-outline" size={20} color="#2563eb" />
                        <Text style={tw`text-blue-600 italic mb-2 mt-2 ml-2 underline`}>
                          Download CV
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <Text style={tw`text-blue-600 italic mb-2 mt-2`}>
                        Tidak ada CV
                      </Text>
                    )}
                  </View>
                </>
              )}
              {(selectedSubs?.rating !== null ||
                selectedSubs?.review !== null) && (
                <>
                  <View style={tw`h-0.4 bg-gray-200 mt-1 mb-2`} />
                  <View style={tw`flex-row items-center justify-start mt-1`}>
                    <Text style={tw`text-gray-600 font-sm mt-3`}>
                      Rating dari Relawan:{" "}
                    </Text>
                    <View style={tw`flex-row items-center`}>
                      {[...Array(selectedSubs?.rating)].map((_, index) => (
                        <Ionicons
                          key={index}
                          name="star"
                          size={16}
                          color="#FFD700"
                          style={tw`ml-1 mt-3`}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={tw`flex-row items-center justify-start mt-1`}>
                    <Text style={tw`text-gray-600 font-sm mt-3`}>Review: </Text>
                    <Text style={tw`text-blue-800 font-sm mt-3 italic`}>
                      {selectedSubs?.review || "Tidak ada review"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          )}
          {(selectedSubs?.rating_for_user === null && selectedSubs?.is_verified === "Y") && (
            <>
              <View style={tw`h-0.4 bg-gray-200 mt-1 mb-2`} />
              <Text style={tw`text-sm mb-3`}>
                Bagaimana Pengalaman Anda dengan Relawan Ini?
              </Text>
              <View style={tw`flex-row mb-3`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <Ionicons
                      name={star <= rating ? "star" : "star-outline"}
                      size={30}
                      style={tw`mr-2`}
                      color={star <= rating ? "#FFD700" : "#ccc"}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={tw`text-sm mb-3`}>Berikan Review Relawan</Text>
              <TextInput
                style={tw`border border-gray-300 rounded-lg p-2 mb-4 h-20`}
                multiline
                value={review}
                onChangeText={setReview}
                placeholder="Berikan Review Jujur Anda disini ..."
              />
              <Pressable
                style={tw`bg-blue-500 px-2 py-2 rounded-xl w-50 items-center justify-center`}
                onPress={handleKirimReview}>
                <Text style={tw`text-white font-bold text-sm text-center`}>
                  Submit Review
                </Text>
              </Pressable>
            </>
          )}
          {(selectedSubs?.rating_for_user !== null || selectedSubs?.review_for_user !== null) && (
            <>
              <View style={tw`h-0.4 bg-gray-200 mt-1 mb-2`} />
              <View style={tw`flex-row items-center justify-start mt-1`}>
                <Text style={tw`text-gray-600 font-sm mt-3`}>
                  Rating Anda ke Relawan:{" "}
                </Text>
                <View style={tw`flex-row items-center`}>
                  {[...Array(selectedSubs?.rating_for_user)].map((_, index) => (
                    <Ionicons
                      key={index}
                      name="star"
                      size={16}
                      color="#FFD700"
                      style={tw`ml-1 mt-3`}
                    />
                  ))}
                </View>
              </View>
              <View style={tw`flex-row items-center justify-start mt-1`}>
                <Text style={tw`text-gray-600 font-sm mt-3`}>Review: </Text>
                <Text style={tw`text-blue-800 font-sm mt-3 italic`}>
                  {selectedSubs?.review_for_user || "Tidak ada review"}
                </Text>
              </View>
            </>
          )}

          <View style={tw`h-0.4 bg-gray-200 mt-3 mb-3`} />

          {selectedSubs?.is_verified === "N" && (
            <View style={tw`flex-row justify-end gap-3 mt-2 mb-5`}>
              <Pressable
                style={tw`bg-gray-300 px-4 py-2 rounded-lg`}
                onPress={() => {
                  setModalVisible(false);
                  setSelectedSubs(null);
                }}>
                <Text style={tw`text-gray-700`}>Batal</Text>
              </Pressable>
              <Pressable
                style={tw`bg-red-500 px-4 py-3 rounded-lg`}
                onPress={handleConfirmTolak}>
                <Text style={tw`text-white font-bold`}>Tolak</Text>
              </Pressable>
              <Pressable
                style={tw`bg-blue-500 px-4 py-3 rounded-lg`}
                onPress={handleConfirmVerifikasi}>
                <Text style={tw`text-white font-bold`}>Verifikasi Relawan</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}
