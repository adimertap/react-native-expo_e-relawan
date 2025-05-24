import DropdownComponent from "@/components/new/Dropdown";
import { useRegisOrganisasi } from "@/src/hooks/Auth/useRegisOrganisasi";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const Signuporg = () => {
  const router = useRouter();
  // State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState(0);
  const [selectedKabupaten, setSelectedKabupaten] = useState(0);
  const [namaOrganisasi, setNamaOrganisasi] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alamat, setAlamat] = useState("");
  const [websiteOrganisasi, setWebsiteOrganisasi] = useState("");
  // Hooks
  const { provinsi, loading: loadingProvinsi } = useHooksProvinsi();
  const { kabupaten, loading: loadingKabupaten } = useHooksKabupaten(selectedProvinsi);
  const { registerOrganisasi, loading: loadingRegister, error: errorRegister } = useRegisOrganisasi();
  // Function
  const handleSubmit = async () => {
    if (!namaOrganisasi || !email || !password || !selectedProvinsi || !selectedKabupaten) {
      Alert.alert('Error', 'Mohon lengkapi semua data');
      return;
    }
    await registerOrganisasi({
      nama: namaOrganisasi,
      email, password,
      kabupaten_id: selectedKabupaten,
      provinsi_id: selectedProvinsi,
      website_organisasi: websiteOrganisasi,
    });
    if (errorRegister) {
      Alert.alert('Error', errorRegister);
    } else {
      router.push('/login');
    }
  };
  
  return (
    <View style={tw`p-6 pb-0 mb-0 justify-end mt-8`}>
      <View style={tw`mt-8`}>
        <View style={tw`mb-5`}>
          <Text style={tw`text-xl font-bold text-black ml-3 mb-2 text-left `}>
            Create Organisasi Account
          </Text>
          <Text
            style={tw`text-sm text-gray-700 ml-3 text-left italic mr-3`}>
            Create an account to get started. Please fill in the form below.
          </Text>
        </View>

        <View style={tw`pl-1 pr-1`}>
          <View style={tw`flex-row items-center mb-3`}>
            <TouchableOpacity
              style={tw`mr-4 bg-white rounded-full px-4 py-2`}
              onPress={() => router.push("/signup")}>
              <Text style={tw`text-black`}>Relawan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-blue-700 rounded-full px-4 py-2`}
              onPress={() => router.push("/signuporg")}>
              <Text style={tw`text-white`}>Organisasi</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`mt-2 mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Nama Organisasi"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => setNamaOrganisasi(text)}
              value={namaOrganisasi}
            />
          </View>
          <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>
          <View
            style={tw`border border-gray-200 rounded-full px-4 py-4 mb-3 bg-white flex-row items-center`}>
            <TextInput
              style={tw`flex-1 text-black`}
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="black"
                style={tw`mr-2`}
              />
            </TouchableOpacity>
          </View>
          <DropdownComponent
            data={[
              ...provinsi.map((item) => ({
                label: item.provinsi,
                value: item.provinsi_id
              }))
            ]}
            placeholder="Pilih Provinsi"
            value={selectedProvinsi}
            onChange={(value) => {
              setSelectedProvinsi(parseInt(value));
            }}
            hasError={false}
            loading={loadingProvinsi}
          />
          <DropdownComponent
            data={[
              ...kabupaten.map((item) => ({
                label: item.kabupaten,
                value: item.kabupaten_id
              }))
            ]}
            placeholder="Pilih Provinsi Terlebih Dahulu"
            value={selectedKabupaten}
            onChange={(value) => {
              setSelectedKabupaten(parseInt(value));
            }}
            hasError={false}
            loading={loadingKabupaten}
          />
          <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Alamat"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => setAlamat(text)}
              value={alamat}
            />
          </View>
          <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Website Organisasi"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => setWebsiteOrganisasi(text)}
              value={websiteOrganisasi}
            />
          </View>
        </View>
      </View>
      <View style={tw`justify-center items-center mt-5`}>
        <TouchableOpacity
          style={tw`bg-blue-700 w-75 rounded-full py-3 mb-5  justify-center items-center`}
          onPress={handleSubmit}
          disabled={loadingRegister}>
          <Text style={tw`text-white font-bold`}>
            {loadingRegister ? 'Loading...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={tw`text-center text-gray-700 italic mt-2 mb-3`}>
          Already have an account?{" "}
          <Text
            onPress={() => router.push("/login")}
            style={tw`text-blue-700 font-bold`}>
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Signuporg;
