import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
import { useSubscribeTopic } from "@/src/hooks/Master/useSubscribeTopic";
import { TopicType } from "@/src/types/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import tw from "twrnc";

const SubcribeTopic = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
  const { submitSubscribeTopic, loading: loadingSubmit, error: errorSubmit } = useSubscribeTopic();
  const router = useRouter();

  const toggleTopic = (topic: string) => {
    setSelected((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : prev.length < 3
        ? [...prev, topic]
        : prev
    );
  };

  const handleSubmit = async () => {
    if (selected.length !== 3) return;
    // Find topic_id for each selected topic_nama
    const selectedIds = topic
      .filter((t) => selected.includes(t.topic_nama || ""))
      .map((t) => t.topic_id!);
    try {
      await submitSubscribeTopic(selectedIds);
      router.replace("/(tabs)");
    } catch (e) {
      // error handled by hook
    }
  };

  return (
    <View style={tw`flex-1 bg-white p-6 pt-12`}>
      <TouchableOpacity style={tw`absolute top-6 right-6 mt-12 mr-3`}>
        <Text style={tw`text-gray-500 font-bold text-base`}>Skip</Text>
      </TouchableOpacity>
      <Text style={tw`text-2xl font-bold mb-10 mt-25`}>
        Pilih 3 topik yang kamu sukai, <Text style={tw`text-blue-600`}>kamu bisa ganti pilihan nya nanti</Text>
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
            disabled={
              selected.length === 3 &&
              !selected.includes(topic.topic_nama || "")
            }>
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
      <TouchableOpacity
        style={tw`bg-blue-600 rounded-full py-4 mt-4 mb-17 justify-center items-center ${
          selected.length === 3 && !loadingSubmit ? "" : "opacity-50"
        } ${loadingTopic ? "opacity-50" : ""}`}
        disabled={selected.length !== 3 || loadingTopic || loadingSubmit}
        onPress={handleSubmit}
      >
        <Text style={tw`text-white font-bold`}>{loadingSubmit ? "Loading..." : "Next"}</Text>
      </TouchableOpacity>
      {errorSubmit && (
        <Text style={tw`text-red-500 text-center mt-2`}>{errorSubmit}</Text>
      )}
      <TouchableOpacity style={tw`mt-2`}>
        <Text style={tw`text-blue-600 text-center`}>Select all</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SubcribeTopic;
