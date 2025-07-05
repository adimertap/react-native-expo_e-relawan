import DropdownComponent from "@/components/new/Dropdown";
import { useRegisRelawan } from "@/src/hooks/Auth/useRegisRelawan";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const Signup = () => {
  const router = useRouter();
  // State
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [selectedProvinsi, setSelectedProvinsi] = useState(0);
  const [selectedKabupaten, setSelectedKabupaten] = useState(0);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedJenisKelamin, setSelectedJenisKelamin] = useState("");
  const [alamat, setAlamat] = useState("");
  
  // Validation state
  const [namaError, setNamaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [provinsiError, setProvinsiError] = useState("");
  const [kabupatenError, setKabupatenError] = useState("");
  const [jenisKelaminError, setJenisKelaminError] = useState("");
  const [alamatError, setAlamatError] = useState("");

  // Hooks
  const { provinsi, loading: loadingProvinsi, error: errorProvinsi } = useHooksProvinsi();
  const { kabupaten, loading: loadingKabupaten, error: errorKabupaten } = useHooksKabupaten(selectedProvinsi);
  const { registerRelawan, loading: loadingRegister, error: errorRegister } = useRegisRelawan();
  
  // Validation functions
  const validateNama = (text: string) => {
    if (!text) {
      setNamaError("Nama lengkap wajib diisi");
    } else if (text.length < 5) {
      setNamaError("Nama lengkap minimal 5 karakter");
    } else {
      setNamaError("");
    }
  };

  const validateEmail = (text: string) => {
    if (!text) {
      setEmailError("Email wajib diisi");
    } else if (!text.includes("@")) {
      setEmailError("Email harus mengandung @");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = (text: string) => {
    if (!text) {
      setPasswordError("Password wajib diisi");
    } else if (!/(?=.*[A-Z])/.test(text)) {
      setPasswordError("Password harus mengandung minimal 1 huruf kapital");
    } else if (!/(?=.*[0-9])/.test(text)) {
      setPasswordError("Password harus mengandung minimal 1 angka");
    } else {
      setPasswordError("");
    }
  };

  const validatePhone = (text: string) => {
    if (!text) {
      setPhoneError("Nomor telepon wajib diisi");
    } else if (!/^\d+$/.test(text)) {
      setPhoneError("Nomor telepon harus berupa angka");
    } else {
      setPhoneError("");
    }
  };

  const validateProvinsi = (value: number) => {
    if (!value) {
      setProvinsiError("Provinsi wajib dipilih");
    } else {
      setProvinsiError("");
    }
  };

  const validateKabupaten = (value: number) => {
    if (!value) {
      setKabupatenError("Kabupaten wajib dipilih");
    } else {
      setKabupatenError("");
    }
  };

  const validateJenisKelamin = (value: string) => {
    if (!value) {
      setJenisKelaminError("Jenis kelamin wajib dipilih");
    } else {
      setJenisKelaminError("");
    }
  };

  const validateAlamat = (text: string) => {
    if (!text) {
      setAlamatError("Alamat wajib diisi");
    } else {
      setAlamatError("");
    }
  };

  // Function
  const handleSubmit = async () => {
    // Validate all fields before submission
    validateNama(namaLengkap);
    validateEmail(email);
    validatePassword(password);
    validatePhone(phone);
    validateProvinsi(selectedProvinsi);
    validateKabupaten(selectedKabupaten);
    validateJenisKelamin(selectedJenisKelamin);
    validateAlamat(alamat);

    // Check if there are any errors
    if (namaError || emailError || passwordError || phoneError || 
        provinsiError || kabupatenError || jenisKelaminError || alamatError) {
      Alert.alert('Error', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    if (!namaLengkap || !email || !password || !selectedProvinsi || !selectedKabupaten || !selectedJenisKelamin || !alamat) {
      Alert.alert('Error', 'Mohon lengkapi semua data');
      return;
    }
    
    await registerRelawan({
      nama: namaLengkap,
      email, password,
      phone, jenis_kelamin: selectedJenisKelamin,
      kabupaten_id: selectedKabupaten,
      provinsi_id: selectedProvinsi,
      alamat
    });
    if (errorRegister) {
      Alert.alert('Error', errorRegister);
    }
  };

  return (
    <View style={tw`p-6 pb-0 mb-0 justify-end mt-8`}>
      <View style={tw`mt-8`}>
        <View style={tw`mb-5`}>
          <Text style={tw`text-xl font-bold text-black ml-3 mb-2 text-left `}>
            Create Relawan Account
          </Text>
          <Text
            style={tw`text-sm text-gray-700 ml-3 text-left italic mr-3`}>
            Create an account to get started. Please select your user type.
          </Text>
        </View>
        <View style={tw`pl-1 pr-1 mt-3`}>
          <View style={tw`flex-row items-center mb-3`}>
            <TouchableOpacity
              style={tw`mr-4 bg-blue-700 rounded-full px-4 py-2`}
              onPress={() => router.push("/signup")}>
              <Text style={tw`text-white`}>Relawan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-white rounded-full px-4 py-2`}
              onPress={() => router.push("/signuporg")}>
              <Text>Organisasi</Text>
            </TouchableOpacity>
          </View>
          <View style={tw`mt-2 mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Nama Lengkap"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => {
                setNamaLengkap(text);
                validateNama(text);
              }}
              value={namaLengkap}
            />
            {namaError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{namaError}</Text>
            ) : null}
          </View>
          <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
              value={email}
            />
            {emailError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{emailError}</Text>
            ) : null}
          </View>
          <View
            style={tw`border border-gray-200 rounded-full px-4 py-4 mb-3 bg-white flex-row items-center`}>
            <TextInput
              style={tw`flex-1 text-black`}
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => {
                setPassword(text);
                validatePassword(text);
              }}
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
          {passwordError ? (
            <Text style={tw`text-red-500 text-xs ml-4 mt-1 mb-3`}>{passwordError}</Text>
          ) : null}
          <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              maxLength={16}
              autoCapitalize="none"
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                if (numericText !== phone) {
                  setPhone(numericText);
                  validatePhone(numericText);
                }
              }}
              value={phone}
            />
            {phoneError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{phoneError}</Text>
            ) : null}
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
              validateProvinsi(parseInt(value));
            }}
            hasError={false}
            loading={loadingProvinsi}
          />
          {provinsiError ? (
            <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{provinsiError}</Text>
          ) : null}
          {errorProvinsi && (
            <Text style={tw`text-red-500 text-sm`}>{errorProvinsi}</Text>
          )}
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
              validateKabupaten(parseInt(value));
            }}
            hasError={false}
            loading={loadingKabupaten}
          />
          {kabupatenError ? (
            <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{kabupatenError}</Text>
          ) : null}
          {errorKabupaten && (
            <Text style={tw`text-red-500 text-sm`}>{errorKabupaten}</Text>
          )}
          <DropdownComponent
            data={[
              ...['Laki-laki', 'Perempuan'].map((item) => ({
                label: item,
                value: item
              }))
            ]}
            placeholder="Jenis Kelamin"
            value={selectedJenisKelamin}
            onChange={(value) => {
              setSelectedJenisKelamin(value);
              validateJenisKelamin(value);
            }}
            hasError={false}
            loading={loadingProvinsi}
          />
          {jenisKelaminError ? (
            <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{jenisKelaminError}</Text>
          ) : null}
        </View>
        <View style={tw`mb-3`}>
            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
              placeholder="Alamat"
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => {
                setAlamat(text);
                validateAlamat(text);
              }}
              value={alamat}
            />
            {alamatError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{alamatError}</Text>
            ) : null}
          </View>
      </View>
      <View style={tw`justify-center items-center mt-5`}>
        <TouchableOpacity
          style={tw`bg-blue-700 w-75 rounded-full py-3 mb-5 justify-center items-center`}
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

export default Signup;
