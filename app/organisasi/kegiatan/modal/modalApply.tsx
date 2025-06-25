import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface ModalApplyProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedSubs: any;
  setSelectedSubs: (subs: any) => void;
  isPertanyaan: string;
  handleConfirmVerifikasi: () => void;
  handleConfirmTolak: () => void;
}

export default function ModalApply({
  modalVisible,
  setModalVisible,
  selectedSubs,
  setSelectedSubs,
  isPertanyaan,
  handleConfirmVerifikasi,
  handleConfirmTolak
}: ModalApplyProps) {
  const formatDate = (date: string) => {
    if (!date) return "-";
    const dateObj = new Date(date);
    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}/${month}/${year}`;
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
            <Text style={tw`text-xl font-bold mb-4 mt-2 text-center`}>
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
            <View style={tw`mb-20`}>
              <Text style={tw`text-gray-700 mb-2 font-bold text-base`}>
                Nama: {selectedSubs.user?.nama}
              </Text>
              <Text style={tw`text-gray-700 mb-2`}>
                Jenis Kelamin: {selectedSubs.user?.jenis_kelamin || ""}
              </Text>
              <Text style={tw`text-gray-700 mb-2`}>
                Tanggal Lahir:{" "}
                {formatDate(selectedSubs.user?.tanggal_lahir || "")}
              </Text>
              <Text style={tw`text-gray-700 mb-2`}>
                Alamat: {selectedSubs.user?.alamat || ""}
              </Text>
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
                    <Text style={tw`text-blue-600 italic mb-2 mt-2`}>
                      {selectedSubs.user_cv || "Tidak ada CV"}
                    </Text>
                  </View>
                </>
              )}
              {selectedSubs?.rating !== 0 && (
                <>
                  <View style={tw`flex-row items-center justify-start mt-4`}>
                    <Text style={tw`text-gray-600 font-sm mt-3`}>Rating: </Text>
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
