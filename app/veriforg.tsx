import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const Veriforg = () => {
  const router = useRouter();
  return (
    <View
      style={tw`justify-end mt-8 justify-center items-center h-full text-center`}>
        <LottieView
            // source={require("../../../android/app/src/main/assets/success.json")}
            source={require("@/assets/success.json")}
            autoPlay
            loop
            style={{ width: 250, height: 250 }}
          />
      <View style={tw`mb-5 `}>
        <Text style={tw`text-xl text-center font-bold text-black mb-2 `}>
          Berhasil Mendaftar
        </Text>
        <Text style={tw`text-sm text-gray-700 italic text-center`}>
          Silahkan tunggu verifikasi dari admin.
        </Text>
      </View>
      <View style={tw`justify-center items-center mb-10 mt-10 w-full `}>
        <TouchableOpacity
          style={tw`bg-blue-700 w-75 rounded-full py-3 mb-5  justify-center items-center`}
          onPress={() => router.push("/login")}>
          <Text style={tw`text-white font-bold`}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Veriforg;
