import { useAuthContext } from "@/src/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

interface LoginResponse {
  success: boolean;
  message: string;
  token: string;
}

const slides = [
  {
    title: "Bergabung Menjadi Relawan",
    description:
      "Dukung kegiatan sosial di sekitarmu dengan bergabung sebagai relawan. Mudah, cepat, dan bermakna.",
    button: "Get Started"
  },
  {
    title: "Pantau Kegiatan",
    description:
      "Lihat dan ikuti berbagai program kemanusiaan, lingkungan, dan edukasi langsung dari genggamanmu.",
    button: "Join Now"
  },
  {
    title: "Kontribusimu Terarah",
    description:
      "Catat dan kelola aktivitas relawanmu dengan mudah. Setiap kontribusi, sekecil apa pun, sangat berarti.",
    button: "Explore"
  }
];

const Login = () => {
  const router = useRouter();
  const { login, loading, error: authError, authState } = useAuthContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loginSuccess && authState?.role) {
      const role = authState.role;
      const is_subcribed = authState.choose_topic;
      
      if (role === 'relawan' && !is_subcribed) {
        router.replace("/subcribeTopic");
      } else if(role === 'relawan' && is_subcribed) {
        router.replace("/(tabs)/relawan");
      } else if(role === 'organisasi') {
        router.replace("/(tabs)/organisasi");
      }
      setLoginSuccess(false);
    }
  }, [loginSuccess, authState, router]);

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Email dan password harus diisi");
        return;
      }
      const success = await login(email, password);
      if (success) {
        setLoginSuccess(true);
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Top Header - 25% Height - White Background */}
      <View style={tw`flex-1 bg-black`}>
        {/* Logo in top left corner */}
        {/* <View style={[tw`absolute top-0 left-0 flex-row items-center p-5 z-10 mt-10 ml-5`]}>
          <Ionicons name="globe-outline" size={20} color="white" />
          <Text style={tw`text-white text-xl font-bold ml-2`}>CA-WAN Apps</Text>
        </View> */}
        <View
          style={tw`flex-1 bg-blue-900 justify-center p-10 mb-20 rounded-b-[35px]`}>
          <Ionicons name="globe-outline" size={25} color="white" />
          <Text style={tw`text-white text-xl font-bold mt-7`}>
            {slides[currentSlide].title}
          </Text>
          <Text style={tw`text-white text-xs mt-2 mb-4`}>
            {slides[currentSlide].description}
          </Text>
          {/* Button below the slide text */}
          {/* <TouchableOpacity style={tw`bg-white rounded-full px-6 py-3 self-start mt-2`}>
            <Text style={tw`text-blue-900 font-bold`}>{slides[currentSlide].button}</Text>
          </TouchableOpacity> */}
          {/* Dots indicator */}
          <View style={tw`flex-row justify-center items-center mt-6`}>
            {slides.map((_, idx) => (
              <View
                key={idx}
                style={tw`${
                  idx === currentSlide ? "bg-white" : "bg-gray-500"
                } w-4 h-1.5 mx-1 rounded-full`}
              />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Section - 75% Height - Blue Background */}
      <View style={tw`flex-1 bg-white pt-0 mt-0 pb-0 mb-0 justify-end`}>
        <View style={[tw`p-5 rounded-t-[35px] bg-gray-50`]}>
          <View style={tw`mt-8`}>
            <View>
              <Text
                style={tw`text-xl font-bold text-black ml-3 mb-3 text-left `}>
                CA-WAN  
              </Text>
              <Text style={tw`text-sm text-gray-700 mb-8 ml-3 text-left italic`}>
                Please enter your email and password to login to your account or create an account.
              </Text>
            </View>

            <TextInput
              style={tw`border border-gray-200 rounded-full px-4 py-4 mb-4 bg-white text-black`}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(text) => setEmail(text)}
              value={email}
            />
          </View>

          <View
            style={tw`border border-gray-200 rounded-full px-4 py-4 mb-1 bg-white flex-row items-center`}>
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
                size={22}
                color="blue"
              />
            </TouchableOpacity>
          </View>
          <Text style={tw`text-center text-red-500 text-sm italic mt-3`}>{authError || error}</Text>
          <View>
            <Text style={tw`text-center text-gray-700 italic mt-6 mb-5`}>
              Don&apos;t have an account?{" "}
              <Text 
                onPress={() => router.push("/signup")} 
                style={tw`text-blue-700 font-bold`}>
                Sign up
              </Text>
            </Text>
          </View>
          <View style={tw`justify-center items-center mt-3`}>
            <TouchableOpacity
              disabled={loading}
              onPress={handleLogin}
              style={tw`bg-blue-700 w-75 rounded-full py-4 mb-5  justify-center items-center ${loading ? 'opacity-50' : ''}`}>
              <Text style={tw`text-white font-bold`}>{loading ? 'Loading...' : 'Login'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              onPress={() => console.log(`Test`)}
              style={tw`bg-white border border-gray-300 w-75 rounded-full py-2 mb-10 justify-center items-center flex-row`}>
              <Ionicons name="logo-google" size={24} color="blue" style={tw`mr-2`} />
              <Text style={tw`text-black ml-2`}>Continue with Google</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Login;
