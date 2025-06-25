import { useUpdateProfile } from "@/src/hooks/Auth/useUpdateProfile";
import { useHooksKabupaten } from "@/src/hooks/Master/useHooksKabupaten";
import { useHooksProvinsi } from "@/src/hooks/Master/useHooksProvinsi";
import { OrganisasiType, UserType } from "@/src/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import tw from "twrnc";
import DropdownComponent from "./Dropdown";

interface ModalUpdateProfileProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  user_id: number;
  profile: OrganisasiType | UserType | null;
  refetchProfile: () => void;
}

export default function ModalUpdateProfile({
  modalVisible,
  setModalVisible,
  user_id,
  profile,
  refetchProfile,
}: ModalUpdateProfileProps) {
  // Initialize form state with empty values
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    alamat: "",
    provinsiId: null as number | null,
    kabupatenId: null as number | null,
    description: "",
    tanggalBerdiri: "",
    websiteOrganisasi: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    updateProfile,
    loading: loadingUpdateProfile,
    error: errorUpdateProfile
  } = useUpdateProfile();

  const { provinsi, loading: loadingProvinsi } = useHooksProvinsi();
  const { kabupaten, loading: loadingKabupaten } = useHooksKabupaten(
    formData.provinsiId || 0
  );

  // Populate form with existing profile data when modal opens
  useEffect(() => {
    if (modalVisible && profile) {
      setIsLoading(true);
      try {
        // Check if it's an organization profile
        if ("user" in profile) {
          setFormData({
            name: profile.user?.nama || "",
            email: profile.user?.email || "",
            phone: profile.user?.phone || "",
            alamat: profile.user?.alamat || "",
            provinsiId: profile.user?.provinsi_id || null,
            kabupatenId: profile.user?.kabupaten_id || null,
            description: profile.description || "",
            tanggalBerdiri: profile.tanggal_berdiri || "",
            websiteOrganisasi: profile.website_organisasi || ""
          });
        } else {
          // Regular user profile - cast as UserType
          const userProfile = profile as UserType;
          setFormData({
            name: userProfile.nama || "",
            email: userProfile.email || "",
            phone: userProfile.phone || "",
            alamat: userProfile.alamat || "",
            provinsiId: userProfile.provinsi_id || null,
            kabupatenId: userProfile.kabupaten_id || null,
            description: "",
            tanggalBerdiri: "",
            websiteOrganisasi: ""
          });
        }
      } catch (error) {
        console.error("Error populating form:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [modalVisible, profile]);

  const handleUpdateProfile = async () => {
    try {
      setIsSubmitting(true);
      const response = await updateProfile(
        formData.name,
        formData.email,
        formData.phone,
        formData.alamat,
        formData.kabupatenId || undefined,
        formData.provinsiId || undefined,
        formData.description,
        formData.tanggalBerdiri,
        formData.websiteOrganisasi
      );
      
      if (response.success === true) {
        Alert.alert("Berhasil", "Profile Berhasil diubah");
        refetchProfile();
        setModalVisible(false);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Gagal mengupdate profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      alamat: "",
      provinsiId: null,
      kabupatenId: null,
      description: "",
      tanggalBerdiri: "",
      websiteOrganisasi: ""
    });
  };

  const handleInputChange = (field: keyof typeof formData, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        resetForm();
        setModalVisible(false);
      }}
    >
      <View style={tw`flex-1 justify-end rounded-t-3xl bg-black/50`}>
        <View style={tw`bg-white rounded-t-3xl p-6 w-[100%] max-h-[90%]`}>
          <View style={tw`flex-row items-center justify-between mb-4`}>
            <Text style={tw`text-xl font-bold text-center`}>Update Profile</Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setModalVisible(false);
              }}
            >
              <Ionicons name="close-outline" size={25} color="black" />
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <View style={tw`flex-1 justify-center items-center py-10`}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={tw`text-gray-600 mt-2`}>Loading profile data...</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* User Fields */}
              <View style={tw`mb-4`}>
                <View style={tw`mb-3`}>
                  <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                    <TextInput
                      style={tw`flex-1 text-black`}
                      placeholder="Nama Organisasi"
                      onChangeText={(text) => handleInputChange('name', text)}
                      value={formData.name}
                    />
                  </View>
                </View>

                <View style={tw`mb-3`}>
                  <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                    <TextInput
                      style={tw`flex-1 text-black`}
                      placeholder="Email Organisasi"
                      value={formData.email}
                      keyboardType="email-address"
                      editable={false}
                    />
                  </View>
                </View>

                <View style={tw`mb-3`}>
                  <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                    <TextInput
                      style={tw`flex-1 text-black`}
                      placeholder="No. HP Organisasi"
                      onChangeText={(text) => handleInputChange('phone', text)}
                      value={formData.phone}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View style={tw`mb-3`}>
                  <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                    <TextInput
                      style={tw`flex-1 text-black`}
                      placeholder="Alamat Organisasi"
                      onChangeText={(text) => handleInputChange('alamat', text)}
                      value={formData.alamat}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </View>

                <View style={tw`mb-3`}>
                  <DropdownComponent
                    data={provinsi.map((p) => ({
                      label: p.provinsi,
                      value: p.provinsi_id
                    }))}
                    placeholder="Pilih Provinsi Organisasi"
                    value={formData.provinsiId || ""}
                    onChange={(value) => {
                      handleInputChange('provinsiId', Number(value));
                      handleInputChange('kabupatenId', null);
                    }}
                    loading={loadingProvinsi}
                  />
                </View>

                <View style={tw`mb-2`}>
                  <DropdownComponent
                    data={kabupaten.map((k) => ({
                      label: k.kabupaten,
                      value: k.kabupaten_id
                    }))}
                    placeholder="Pilih Kabupaten Organisasi"
                    value={formData.kabupatenId || ""}
                    onChange={(value) => handleInputChange('kabupatenId', Number(value))}
                    loading={loadingKabupaten}
                    disabled={!formData.provinsiId}
                  />
                </View>
              </View>

              {profile && "user" in profile && (
                <View>
                  <View style={tw`mb-3`}>
                    <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                      <TextInput
                        style={tw`flex-1 text-black`}
                        placeholder="Deskripsi Organisasi"
                        onChangeText={(text) => handleInputChange('description', text)}
                        value={formData.description}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </View>

                  <View style={tw`mb-3`}>
                    <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                      <TextInput
                        style={tw`flex-1 text-black`}
                        placeholder="Tanggal Berdiri (YYYY-MM-DD)"
                        onChangeText={(text) => handleInputChange('tanggalBerdiri', text)}
                        value={formData.tanggalBerdiri}
                      />
                    </View>
                  </View>

                  <View style={tw`mb-3`}>
                    <View style={tw`border border-gray-200 rounded-full px-4 py-4 bg-white`}>
                      <TextInput
                        style={tw`flex-1 text-black`}
                        placeholder="Website Organisasi"
                        onChangeText={(text) => handleInputChange('websiteOrganisasi', text)}
                        value={formData.websiteOrganisasi}
                        keyboardType="url"
                      />
                    </View>
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          <View style={tw`flex-row justify-end gap-3 mt-5`}>
            <Pressable
              style={tw`bg-gray-300 px-4 py-2 rounded-lg`}
              onPress={() => {
                resetForm();
                setModalVisible(false);
              }}
              disabled={isSubmitting || isLoading}
            >
              <Text style={tw`text-gray-700`}>Batal</Text>
            </Pressable>
            <Pressable
              style={tw`bg-blue-500 px-4 py-3 rounded-lg ${isSubmitting || isLoading ? 'opacity-50' : ''}`}
              onPress={handleUpdateProfile}
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={tw`text-white font-bold`}>Update Profile</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}