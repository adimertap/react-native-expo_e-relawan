import { useRatingKegiatan } from "@/src/hooks/Relawan/useRatingKegiatan";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface ModalApplyProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  subs_kegiatan_id: number;
  nama_kegiatan: string;
  setSelectedSubs: (subs: any) => void;
  refetch?: () => void;
}

export default function ModalReview({
  modalVisible,
  setModalVisible,
  subs_kegiatan_id,
  nama_kegiatan,
  setSelectedSubs,
  refetch,
}: ModalApplyProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const { ratingKegiatan, loading } = useRatingKegiatan();

  const handleKirimReview = async () => {
    try {
        await ratingKegiatan(subs_kegiatan_id, rating, review);
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
        setSelectedSubs(null);
        setRating(0);
        setReview("");
      }}>
      <View style={tw`flex-1 justify-end rounded-t-3xl bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6 w-[100%] max-w-[400px]`}>
          <View style={tw`flex-row justify-between`}>
            <Text style={tw`text-xl font-bold mb-4 mt-2 `}>
              Review
            </Text>
            <TouchableOpacity onPress={() => {
              setModalVisible(false);
              setSelectedSubs(null);
              setRating(0);
              setReview("");
            }}>
              <Ionicons name="close-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={tw`h-0.5 bg-gray-200 mt-1 mb-2`} />
          <Text style={tw`text-base mb-3 mt-3`}>Kegiatan: <Text style={tw`text-blue-500 italic`}>{nama_kegiatan}</Text></Text>

          <Text style={tw`text-base mb-3`}>Bagaimana Pengalaman Anda?</Text>
          <View style={tw`flex-row mb-8`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={32}
                  color={star <= rating ? "#FFD700" : "#ccc"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text style={tw`mb-3`}>Berikan Review Anda</Text>
          <TextInput
            style={tw`border border-gray-300 rounded-lg p-2 mb-4 h-40`}
            multiline
            value={review}
            onChangeText={setReview}
            placeholder="Berikan Review Jujur Anda disini ..."
          />

          <View style={tw`flex-row justify-end gap-3 mt-5 mb-5`}>
            <Pressable
              style={tw`bg-gray-300 px-4 py-2 rounded-lg`}
              onPress={() => {
                setModalVisible(false);
                setSelectedSubs(null);
                setRating(0);
                setReview("");
              }}>
              <Text style={tw`text-gray-700`}>Batal</Text>
            </Pressable>
            <Pressable
              style={tw`bg-blue-500 px-4 py-3 rounded-lg ${rating === 0 ? 'opacity-50' : ''}`}
              onPress={handleKirimReview}
              disabled={loading || rating === 0}
            >
              <Text style={tw`text-white font-bold`}>
                {loading ? "Mengirim..." : "Kirim Review"}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
