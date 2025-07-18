import { useAuthContext } from "@/src/contexts/AuthContext";
import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
import { useSubscribeTopic } from "@/src/hooks/Master/useSubscribeTopic";
import { useFetchSubscribeTopic } from "@/src/hooks/Relawan/useFetchSubscribeTopic";
import { TopicType } from "@/src/types/types";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const SubcribeTopic = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
  const {
    submitSubscribeTopic,
    loading: loadingSubmit,
    error: errorSubmit
  } = useSubscribeTopic();
  const { fetchSubscribeTopic, loading: loadingSubscribeTopic, error: errorSubscribeTopic, subscribeTopic } = useFetchSubscribeTopic();
  const router = useRouter();
  const { logout } = useAuthContext();

  useEffect(() => {
    fetchSubscribeTopic();
  }, [fetchSubscribeTopic]);

  // Pre-select topics when subscribeTopic data is available
  useEffect(() => {
    if (subscribeTopic && subscribeTopic.rows && subscribeTopic.rows.length > 0) {
      const subscribedTopicNames = subscribeTopic.rows.map((sub: any) => sub.topic?.topic_nama).filter(Boolean);
      setSelected(subscribedTopicNames);
    }
  }, [subscribeTopic]);

  const toggleTopic = (topic: string) => {
    setSelected((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const handleSubmit = async () => {
    if (selected.length < 3) return;
    const selectedIds = topic
      .filter((t) => selected.includes(t.topic_nama || ""))
      .map((t) => t.topic_id!);
    try {
      await submitSubscribeTopic(selectedIds);
      router.replace("/(tabs)/relawan");
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to subscribe topic");
    }
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  // Check if user has existing subscriptions
  const hasExistingSubscriptions = subscribeTopic && subscribeTopic.rows && subscribeTopic.rows.length > 0;

  if (loadingSubscribeTopic) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={tw`flex-1 bg-white p-8 pt-12`}>
      <View style={tw`flex-row justify-between items-center mx-1 mt-4 ml-1`}>
        <TouchableOpacity
          style={tw`absolute top-4 cursor-pointer`}
          onPress={() => handleLogout()}>
          <Text style={tw`text-red-500 font-medium text-sm`}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`absolute top-4 right-6 cursor-pointer`}
          onPress={() => router.replace("/(tabs)/relawan")}>
          <Text style={tw`text-gray-500 font-medium text-sm`}>Skip</Text>
        </TouchableOpacity>
      </View>

      <Text style={tw`text-2xl font-bold mb-10 mt-25`}>
        {hasExistingSubscriptions 
          ? "Update topik yang kamu sukai, " 
          : "Pilih 3 topik yang kamu sukai, "}
        <Text style={tw`text-blue-600`}>kamu bisa ganti pilihan nya nanti</Text>
      </Text>
      <ScrollView
        contentContainerStyle={tw`flex-row flex-wrap gap-2 mb-6`}
        showsVerticalScrollIndicator={false}>
        {topic.map((topic: TopicType) => (
          <TouchableOpacity
            key={topic.topic_id}
            style={tw`${
              selected.includes(topic.topic_nama || "")
                ? "bg-blue-600"
                : "bg-white"
            } border border-gray-300 rounded-full px-4 py-2 m-1 ${
              selected.includes(topic.topic_nama || "") ? "" : ""
            }`}
            onPress={() => toggleTopic(topic.topic_nama || "")}
            disabled={false}>
            <Text
              style={tw`${
                selected.includes(topic.topic_nama || "")
                  ? "text-white"
                  : "text-black"
              } font-semibold`}>
              {topic.topic_nama || ""}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {errorTopic && (
        <Text style={tw`text-red-500 text-center`}>{errorTopic}</Text>
      )}
      {errorSubmit && (
        <Text style={tw`text-red-500 text-center mt-2`}>{errorSubmit}</Text>
      )}
      <TouchableOpacity
        style={tw`bg-blue-600 rounded-full py-4 mt-4 mb-17 justify-center items-center ${
          selected.length >= 3 && !loadingSubmit ? "" : "opacity-50"
        } ${loadingTopic ? "opacity-50" : ""}`}
        disabled={selected.length < 3 || loadingTopic || loadingSubmit}
        onPress={handleSubmit}>
        <Text style={tw`text-white font-bold`}>
          {loadingSubmit ? "Loading..." : hasExistingSubscriptions ? "Update" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubcribeTopic;
