import DropdownComponent from "@/components/new/Dropdown";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useUpdateProfileRelawan } from "@/src/hooks/Auth/useUpdateProfileRelawan";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import { useFetchProfileRelawan } from "@/src/hooks/Relawan/useFetchProfile";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";

export default function UpdateProfileRelawanScreen() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const scrollViewRef = useRef<ScrollView>(null);

  // Profile data
  const { profile, loading: loadingProfile, refetch: refetchProfile } = useFetchProfileRelawan();
  const { updateProfileRelawan, loading: updating } = useUpdateProfileRelawan();

  // Form state
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");

  // Province and district
  const { provinsi, loading: loadingProvinsi } = useHooksProvinsi();
  const [selectedProvinsi, setSelectedProvinsi] = useState<number | null>(null);
  const { kabupaten, loading: loadingKabupaten } = useHooksKabupaten(selectedProvinsi || 0);
  const [selectedKabupaten, setSelectedKabupaten] = useState<number | null>(null);

  // Validation state
  const [namaError, setNamaError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [alamatError, setAlamatError] = useState("");
  const [provinsiError, setProvinsiError] = useState("");
  const [kabupatenError, setKabupatenError] = useState("");

  // Validation functions
  const validateNama = (text: string) => {
    if (!text) {
      setNamaError("Nama wajib diisi");
    } else if (text.length < 5) {
      setNamaError("Nama minimal 5 karakter");
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

  const validatePhone = (text: string) => {
    if (text && !/^\d+$/.test(text)) {
      setPhoneError("Nomor telepon harus berupa angka");
    } else {
      setPhoneError("");
    }
  };

  const validateAlamat = (text: string) => {
    if (text && text.length < 5) {
      setAlamatError("Alamat minimal 5 karakter");
    } else {
      setAlamatError("");
    }
  };

  const validateProvinsi = (value: number | null) => {
    if (!value) {
      setProvinsiError("Provinsi wajib dipilih");
    } else {
      setProvinsiError("");
    }
  };

  const validateKabupaten = (value: number | null) => {
    if (!value) {
      setKabupatenError("Kabupaten wajib dipilih");
    } else {
      setKabupatenError("");
    }
  };

  // Set initial data from profile
  useEffect(() => {
    if (profile) {
      setNama(profile?.nama || "");
      setEmail(profile?.email || "");
      setPhone(profile?.phone || "");
      setAlamat(profile?.alamat || "");
      setSelectedProvinsi(profile?.provinsi_id || null);
      setSelectedKabupaten(profile?.kabupaten_id || null);
    }
  }, [profile]);

  const handleSubmit = async () => {
    // Validate all fields before submission
    validateNama(nama);
    validateEmail(email);
    validatePhone(phone);
    validateAlamat(alamat);
    validateProvinsi(selectedProvinsi);
    validateKabupaten(selectedKabupaten);

    // Check if there are any errors
    if (namaError || emailError || phoneError || alamatError || provinsiError || kabupatenError) {
      Alert.alert('Error', 'Mohon perbaiki kesalahan pada form');
      return;
    }

    if (!nama || !email || !selectedProvinsi || !selectedKabupaten) {
      Alert.alert('Error', 'Nama, Email, Provinsi, dan Kabupaten wajib diisi');
      return;
    }

    const result = await updateProfileRelawan(
      nama,
      email,
      phone || "",
      alamat || "",
      selectedKabupaten || undefined,
      selectedProvinsi || undefined,
    );

    if (result.success) {
      Alert.alert('Sukses', result.message, [
        {
          text: 'OK',
          onPress: async () => {
            await refetchProfile();
            router.replace("/relawan/profile");
          }
        }
      ]);
    } else {
      Alert.alert('Error', result.message);
    }
  };

  if (loadingProfile) {
    return (
      <View style={tw`flex-1 bg-gray-50 justify-center items-center`}>
        <Text style={tw`text-gray-600`}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <View style={tw`bg-blue-600 rounded-b-3xl mb-3 py-1`}>
        <View
          style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back-outline" size={25} color="white" />
          </TouchableOpacity>

          <View style={tw`flex-col items-center absolute left-0 right-0`}>
            <Text style={tw`text-white text-sm font-bold`}>
              Update Profile
            </Text>
            <Text style={tw`text-white text-sm italic`}>
              Update Profile dibawah
            </Text>
          </View>

          <TouchableOpacity onPress={() => logout()}>
            <Ionicons name="log-out-outline" size={25} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={tw`px-5`}>
        <ScrollView 
          ref={scrollViewRef}
          style={tw`mt-4 py-1 mb-30`}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={true}
          bounces={false}
          contentContainerStyle={tw`pb-20`}
        >
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Nama (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={nama}
              onChangeText={(text) => {
                setNama(text);
                validateNama(text);
              }}
            />
            {namaError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{namaError}</Text>
            ) : null}
          </View>

          <View style={tw`w-full mb-3`}>
            <DropdownComponent
              data={provinsi.map((item) => ({
                label: item.provinsi,
                value: item.provinsi_id.toString()
              }))}
              placeholder="Pilih Provinsi (*)"
              value={selectedProvinsi?.toString() || ""}
              onChange={(value) => {
                const provinsiValue = value ? parseInt(value) : null;
                setSelectedProvinsi(provinsiValue);
                validateProvinsi(provinsiValue);
                setSelectedKabupaten(null); // Reset kabupaten when provinsi changes
              }}
              loading={loadingProvinsi}
            />
            {provinsiError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{provinsiError}</Text>
            ) : null}
          </View>

          <View style={tw`w-full mb-3`}>
            <DropdownComponent
              data={kabupaten.map((item) => ({
                label: item.kabupaten,
                value: item.kabupaten_id.toString()
              }))}
              placeholder="Pilih Kabupaten (*)"
              value={selectedKabupaten?.toString() || ""}
              onChange={(value) => {
                const kabupatenValue = value ? parseInt(value) : null;
                setSelectedKabupaten(kabupatenValue);
                validateKabupaten(kabupatenValue);
              }}
              loading={loadingKabupaten}
              disabled={!selectedProvinsi}
            />
            {kabupatenError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{kabupatenError}</Text>
            ) : null}
          </View>

          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Email (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                validateEmail(text);
              }}
            />
            {emailError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{emailError}</Text>
            ) : null}
          </View>

          <View style={tw`w-full mb-3`}>  
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="No. HP"
              placeholderTextColor="gray"
              autoCapitalize="none"
              keyboardType="phone-pad"
              maxLength={16}
              value={phone}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                setPhone(numericText);
                validatePhone(numericText);
              }}
            />
            {phoneError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{phoneError}</Text>
            ) : null}
          </View>

          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Alamat"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={alamat}
              onChangeText={(text) => {
                setAlamat(text);
                validateAlamat(text);
              }}
            />
            {alamatError ? (
              <Text style={tw`text-red-500 text-xs ml-4 mt-1`}>{alamatError}</Text>
            ) : null}
          </View>
          <View style={tw`w-full mb-15 mt-5`}>
            <TouchableOpacity 
              style={tw`bg-blue-600 py-4 px-4 rounded-full w-full ${updating ? 'opacity-50' : ''}`}
              onPress={handleSubmit}
              disabled={updating}
            >
              <Text style={tw`text-white text-center`}>
                {updating ? 'Mengirim...' : 'Update Profile'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
