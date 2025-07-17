import DropdownComponent from "@/components/new/Dropdown";
import { useRegisOrganisasi } from "@/src/hooks/Auth/useRegisOrganisasi";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
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
  const [deskripsi, setDeskripsi] = useState("");
  const [phone, setPhone] = useState("");

  // Validation state
  const [namaOrganisasiError, setNamaOrganisasiError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [provinsiError, setProvinsiError] = useState("");
  const [kabupatenError, setKabupatenError] = useState("");
  const [alamatError, setAlamatError] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [deskripsiError, setDeskripsiError] = useState("");
  const [dokumenPendukung, setDokumenPendukung] = useState("");
  const [dokumenPendukungError, setDokumenPendukungError] = useState("");
  // Hooks
  const { provinsi, loading: loadingProvinsi } = useHooksProvinsi();
  const { kabupaten, loading: loadingKabupaten } =
    useHooksKabupaten(selectedProvinsi);
  const {
    registerOrganisasi,
    loading: loadingRegister,
    error: errorRegister
  } = useRegisOrganisasi();

  // Validation functions
  const validateNamaOrganisasi = (text: string) => {
    if (!text) {
      setNamaOrganisasiError("Nama organisasi wajib diisi");
    } else if (text.length < 5) {
      setNamaOrganisasiError("Nama organisasi minimal 5 karakter");
    } else {
      setNamaOrganisasiError("");
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

  const validateAlamat = (text: string) => {
    if (!text) {
      setAlamatError("Alamat wajib diisi");
    } else {
      setAlamatError("");
    }
  };

  const validateWebsite = (text: string) => {
    if (!text) {
      setWebsiteError("Website/Social media wajib diisi");
    } else {
      setWebsiteError("");
    }
  };

  const validateDeskripsi = (text: string) => {
    if (!text) {
      setDeskripsiError("Deskripsi wajib diisi");
    } else {
      setDeskripsiError("");
    }
  };

  const validateDokumenPendukung = (text: string) => {
    if (!text) {
      setDokumenPendukungError("Dokumen pendukung wajib diisi");
    } else {
      setDokumenPendukungError("");
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
        setDokumenPendukung(selectedFile.uri);
        
        // Convert to base64
        const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
          encoding: FileSystem.EncodingType.Base64
        });
        setDokumenPendukung(base64);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      Alert.alert("Error", "Failed to pick file. Please try again.");
    }
  };

  // Function
  const handleSubmit = async () => {
    // Validate all fields before submission
    validateNamaOrganisasi(namaOrganisasi);
    validateEmail(email);
    validatePassword(password);
    validatePhone(phone);
    validateProvinsi(selectedProvinsi);
    validateKabupaten(selectedKabupaten);
    validateAlamat(alamat);
    validateWebsite(websiteOrganisasi);
    validateDeskripsi(deskripsi);
    validateDokumenPendukung(dokumenPendukung);
    // Check if there are any errors
    if (
      namaOrganisasiError ||
      emailError ||
      passwordError ||
      phoneError ||
      provinsiError ||
      kabupatenError ||
      alamatError ||
      websiteError ||
      deskripsiError ||
      dokumenPendukungError
    ) {
      Alert.alert("Error", "Mohon perbaiki kesalahan pada form");
      return;
    }

    if (
      !namaOrganisasi ||
      !email ||
      !password ||
      !selectedProvinsi ||
      !selectedKabupaten ||
      !alamat ||
      !websiteOrganisasi ||
      !deskripsi ||
      !phone ||
      !dokumenPendukung
    ) {
      Alert.alert("Error", "Mohon lengkapi semua data");
      return;
    }

    await registerOrganisasi({
      nama: namaOrganisasi,
      email,
      password,
      kabupaten_id: selectedKabupaten,
      provinsi_id: selectedProvinsi,
      website_organisasi: websiteOrganisasi,
      description: deskripsi,
      alamat: alamat,
      phone: phone,
      dokumen_pendukung: dokumenPendukung
    });
    if (errorRegister) {
      Alert.alert("Error", errorRegister);
    } else {
      Alert.alert(
        "Success",
        "Berhasil membuat akun organisasi, silahkan login"
      );
      router.push("/login");
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={tw`flex-1`}
            contentContainerStyle={tw`p-6 pb-0 mb-0`}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={tw`mt-10`}>
              <View style={tw`mb-5`}>
                <Text style={tw`text-xl font-bold text-black ml-3 mb-2 text-left `}>
                  Create Organisasi Account
                </Text>
                <Text style={tw`text-sm text-gray-700 ml-3 text-left italic mr-3`}>
                  Create an account to get started. Please fill in the form below.
                </Text>
              </View>

              <View style={tw`pl-1 pr-1 mt-0`}>
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
                    onChangeText={(text) => {
                      setNamaOrganisasi(text);
                      validateNamaOrganisasi(text);
                    }}
                    value={namaOrganisasi}
                  />
                  {namaOrganisasiError ? (
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {namaOrganisasiError}
                    </Text>
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
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {emailError}
                    </Text>
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
                  <Text style={tw`text-red-500 text-xs ml-4 mt-1 mb-3`}>
                    {passwordError}
                  </Text>
                ) : null}
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
                  <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                    {provinsiError}
                  </Text>
                ) : null}
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
                  <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                    {kabupatenError}
                  </Text>
                ) : null}
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
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {alamatError}
                    </Text>
                  ) : null}
                </View>
                <View style={tw`mb-3`}>
                  <TextInput
                    style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
                    placeholder="Nomor Telepon"
                    keyboardType="phone-pad"
                    maxLength={16}
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      const numericText = text.replace(/[^0-9]/g, "");
                      if (numericText !== phone) {
                        setPhone(numericText);
                        validatePhone(numericText);
                      }
                    }}
                    value={phone}
                  />
                  {phoneError ? (
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {phoneError}
                    </Text>
                  ) : null}
                </View>
                <View style={tw`mb-3`}>
                  <TextInput
                    style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
                    placeholder="Website Organisasi / Social Media"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      setWebsiteOrganisasi(text);
                      validateWebsite(text);
                    }}
                    value={websiteOrganisasi}
                  />
                  {websiteError ? (
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {websiteError}
                    </Text>
                  ) : null}
                </View>
                <View style={tw`mb-3`}>
                  <TextInput
                    style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white text-black`}
                    placeholder="Deskripsi"
                    keyboardType="default"
                    autoCapitalize="none"
                    onChangeText={(text) => {
                      setDeskripsi(text);
                      validateDeskripsi(text);
                    }}
                    value={deskripsi}
                  />
                  {deskripsiError ? (
                    <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>
                      {deskripsiError}
                    </Text>
                  ) : null}
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
                    {dokumenPendukung ? "Change Dokumen Pendukung" : "Select Dokumen Pendukung"}
                  </Text>
                </TouchableOpacity>
                {dokumenPendukung && (
                  <View style={tw`mt-2 p-3 bg-gray-100 rounded-lg`}>
                    <Text style={tw`text-gray-700 text-sm`}>
                      File selected successfully
                    </Text>
                  </View>
                )}
                </View>
              </View>
            </View>
            <View style={tw`justify-center items-center mt-5`}>
              <TouchableOpacity
                style={tw`bg-blue-700 w-75 rounded-full py-3 mb-5  justify-center items-center`}
                onPress={handleSubmit}
                disabled={loadingRegister}>
                <Text style={tw`text-white font-bold`}>
                  {loadingRegister ? "Loading..." : "Sign Up"}
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signuporg;
