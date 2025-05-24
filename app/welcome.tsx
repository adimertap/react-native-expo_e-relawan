import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const slides = [
  {
    title: "Bergabung Menjadi Relawan",
    description:
     "Dukung kegiatan sosial di sekitarmu dengan bergabung sebagai relawan. Mudah, cepat, dan bermakna.",
    image: require("@/assets/welcome2.png")
  },
  {
    title: "Pantau Kegiatan Sosial",
    description:
    "Lihat dan ikuti berbagai program kemanusiaan, lingkungan, dan edukasi langsung dari genggamanmu.",
    image: require("@/assets/welcome5.png")
  },
  {
    title: "Kontribusimu Lebih Terarah",
    description:
      "Catat dan kelola aktivitas relawanmu dengan mudah. Setiap kontribusi, sekecil apa pun, sangat berarti.",
    image: require("@/assets/welcome4.png")
  }
];

const WelcomePage = () => {
  const router = useRouter();
  const [slide, setSlide] = useState(0);

  const handleContinue = () => {
    if (slide < slides.length - 1) {
      setSlide(slide + 1);
    }
  };

  const handleBack = () => {
    if (slide > 0) {
      setSlide(slide - 1);
    }
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <View style={tw`bg-blue-600 items-center h-full justify-center px-6`}>
      <View
        style={tw`w-full flex-row justify-between items-center mt-15 mb-2 ml-6 absolute top-0 left-0 right-0`}>
        {slide > 0 ? (
          <View style={tw`flex-row items-center`}>
            <Ionicons name="arrow-back" size={16} color="white" />
            <TouchableOpacity onPress={handleBack} style={tw`py-2 px-4`}>
              <Text style={tw`text-white text-sm font-bold`}>Back</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={tw`py-2 px-4`} />
        )}
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity onPress={handleSkip} style={tw`py-2 px-4`}>
            <Text style={tw`text-white text-sm font-bold`}>Skip</Text>
          </TouchableOpacity>
          <Ionicons name="chevron-forward-outline" size={16}  color="white" />
        </View>
      </View>
      {/* Slide content */}
     
      <Image
        source={slides[slide].image}
        style={{ width: 280, height: 280, marginBottom: 20, marginTop: 70 }}
        resizeMode="contain"
      />
       <View style={tw`mt-10 mb-4`}>
        <Text style={tw`text-white text-base font-bold text-center`}>
          {slides[slide].title}
        </Text>
      </View>
      <Text style={tw`text-white text-sm font-medium text-center mb-5 mt-5`}>
        {slides[slide].description}
      </Text>
      <View style={tw`w-full items-center mt-18`}>
        {slide < slides.length - 1 ? (
          <TouchableOpacity
            style={tw`bg-white w-75 rounded-full py-3 mb-5 justify-center items-center`}
            onPress={handleContinue}>
            <Text style={tw`text-black font-bold`}>Continue</Text>
          </TouchableOpacity>
        ) : (
          <>
           <TouchableOpacity
              style={tw`bg-blue-800 w-75 rounded-full py-4 justify-center items-center mb-4`}
              onPress={() => router.push("/login")}>
              <Text style={tw`text-white font-bold`}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={tw`bg-white w-75 rounded-full py-4 mb-3 justify-center items-center`}
              onPress={() => router.push("/signup")}>
              <Text style={tw`text-black font-bold`}>Sign Up</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default WelcomePage;
