import DropdownComponent from "@/components/new/Dropdown";
import { useAuthContext } from "@/src/contexts/AuthContext";
import { useUpdateProfile } from "@/src/hooks/Auth/useUpdateProfile";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import { useFetchProfile } from "@/src/hooks/Organisasi/useFetchProfile";
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

export default function UpdateProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthContext();
  const scrollViewRef = useRef<ScrollView>(null);

  // Profile data
  const { profile, loading: loadingProfile, refetch: refetchProfile } = useFetchProfile();
  const { updateProfile, loading: updating } = useUpdateProfile();

  // Form state
  const [nama, setNama] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [alamat, setAlamat] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [website, setWebsite] = useState<string>("");

  // Province and district
  const { provinsi, loading: loadingProvinsi } = useHooksProvinsi();
  const [selectedProvinsi, setSelectedProvinsi] = useState<number | null>(null);
  const { kabupaten, loading: loadingKabupaten } = useHooksKabupaten(selectedProvinsi || 0);
  const [selectedKabupaten, setSelectedKabupaten] = useState<number | null>(null);

  // Set initial data from profile
  useEffect(() => {
    if (profile) {
      setNama(profile.user?.nama || "");
      setEmail(profile.user?.email || "");
      setPhone(profile.user?.phone || "");
      setAlamat(profile.user?.alamat || "");
      setDeskripsi(profile.description || "");
      setWebsite(profile.website_organisasi || "");
      setSelectedProvinsi(profile.user?.provinsi_id || null);
      setSelectedKabupaten(profile.user?.kabupaten_id || null);
    }
  }, [profile]);

  const handleSubmit = async () => {
    if (!nama || !email) {
      Alert.alert('Error', 'Nama dan Email wajib diisi');
      return;
    }

    const result = await updateProfile(
      nama,
      email,
      phone || "",
      alamat || "",
      selectedKabupaten || undefined,
      selectedProvinsi || undefined,
      deskripsi || "",
      website || ""
    );

    if (result.success) {
      Alert.alert('Sukses', result.message, [
        {
          text: 'OK',
          onPress: async () => {
            await refetchProfile();
            router.replace("/organisasi/profile");
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
      <View style={tw`bg-gray-600 rounded-b-3xl mb-3 py-1`}>
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
              placeholder="Nama Organisasi (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={nama}
              onChangeText={setNama}
            />
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
                setSelectedProvinsi(value ? parseInt(value) : null);
                setSelectedKabupaten(null); // Reset kabupaten when provinsi changes
              }}
              loading={loadingProvinsi}
            />
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
                setSelectedKabupaten(value ? parseInt(value) : null);
              }}
              loading={loadingKabupaten}
              disabled={!selectedProvinsi}
            />
          </View>

          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Email Organisasi (*)"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={tw`w-full mb-3`}>  
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="No. HP Organisasi"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Alamat Organisasi"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={alamat}
              onChangeText={setAlamat}
            />
          </View>

          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Deskripsi Organisasi"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={deskripsi}
              onChangeText={setDeskripsi}
            />
          </View>
          <View style={tw`w-full mb-3`}>
            <TextInput
              style={tw`text-black bg-white py-4 px-4 rounded-full w-full border border-gray-200`}
              placeholder="Website Organisasi"
              placeholderTextColor="gray"
              autoCapitalize="none"
              value={website}
              onChangeText={setWebsite}
            />
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
