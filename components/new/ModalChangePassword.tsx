import { useChangePassword } from "@/src/hooks/Auth/useChangePassword";
import { Ionicons } from "@expo/vector-icons";
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

interface ModalChangePasswordProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  user_id: number;
}

export default function ModalChangePassword({
  modalVisible,
  setModalVisible,
  user_id
}: ModalChangePasswordProps) {
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    changePassword,
    loading: loadingChangePassword,
    error: errorChangePassword
  } = useChangePassword();

  const handleChangePassword = async () => {
    try {
      const response = await changePassword(
        newPassword || "",
        newConfirmPassword || ""
      );
      if (response.success === true) {
        Alert.alert("Berhasil", "Password Berhasil diubah");
        setNewPassword("");
        setNewConfirmPassword("");
        setShowPassword(false);
        setShowPasswordConfirm(false);
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setNewConfirmPassword("");
        setNewPassword("");
        setShowPassword(false);
        setShowPasswordConfirm(false);
        setModalVisible(false);
      }}>
      <View style={tw`flex-1 justify-end rounded-t-3xl bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6 w-[100%] max-w-[400px]`}>
          <View style={tw`flex-row items-center justify-between`}>
            <Text style={tw`text-xl font-bold mb-4 mt-2 text-center`}>
              Change Password
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Ionicons name="close-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>
          <View style={tw`mt-4 mb-1`}>
            <View
              style={tw`border border-gray-200 rounded-full px-4 py-4 mb-1 bg-white flex-row items-center`}>
              <TextInput
                style={tw`flex-1 text-black`}
                placeholder="Password"
                secureTextEntry={!showPassword}
                onChangeText={(text) => setNewPassword(text)}
                value={newPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={tw`mt-2 mb-5`}>
            <View
              style={tw`border border-gray-200 rounded-full px-4 py-4 mb-1 bg-white flex-row items-center`}>
              <TextInput
                style={tw`flex-1 text-black`}
                placeholder="Password"
                secureTextEntry={!showPasswordConfirm}
                onChangeText={(text) => setNewConfirmPassword(text)}
                value={newConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPasswordConfirm(!showPasswordConfirm)}>
                <Ionicons
                  name={showPasswordConfirm ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="gray"
                />
              </TouchableOpacity>
            </View>
          </View>
          {errorChangePassword && (
            <Text
              style={tw`text-sm font-bold italic text-red-500 mb-2 mt-2 text-center`}>
              {errorChangePassword}
            </Text>
          )}
          {/* <View style={tw`h-0.4 bg-gray-200 mt-5 mb-5`} /> */}
          <View style={tw`flex-row justify-end gap-3 mt-5 mb-10`}>
            <Pressable
              style={tw`bg-gray-300 px-4 py-2 rounded-lg`}
              onPress={() => {
                setNewConfirmPassword("");
                setNewPassword("");
                setShowPassword(false);
                setShowPasswordConfirm(false);
                setModalVisible(false);
              }}>
              <Text style={tw`text-gray-700`}>Batal</Text>
            </Pressable>
            <Pressable
              style={tw`bg-blue-500 px-4 py-3 rounded-lg`}
              disabled={loadingChangePassword}
              onPress={handleChangePassword}>
              <Text style={tw`text-white font-bold`}>Change Password</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
