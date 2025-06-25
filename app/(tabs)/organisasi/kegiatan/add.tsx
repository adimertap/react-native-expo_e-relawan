// import { useAuthContext } from "@/src/contexts/AuthContext";
// import { useFetchTopic } from "@/src/hooks/Master/useFetchTopic";
// import { useFetchKegiatanSelf } from "@/src/hooks/Organisasi/useFetchKegiatanSelf";
// import { KegiatanType, TopicType } from "@/src/types/types";
// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import {
//     Image,
//     ScrollView,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View
// } from "react-native";
// import tw from "twrnc";
// export default function AddKegiatanScreen() {
//   const [search, setSearch] = useState("");
//   const { authState, logout } = useAuthContext();
//   const [topicList, setTopicList] = useState<TopicType[]>([]);
//   const { topic, loading: loadingTopic, error: errorTopic } = useFetchTopic();
//   const {
//     kegiatan,
//     loading: loadingKegiatan,
//     error: errorKegiatan
//   } = useFetchKegiatanSelf();
//   const [kegiatanList, setKegiatanList] = useState<KegiatanType[]>([]);
//   console.log(kegiatanList);
//   useEffect(() => {
//     if (topic) {
//       setTopicList(topic);
//     }
//     if (kegiatan) {
//       setKegiatanList(kegiatan);
//     }
//   }, [topic, kegiatan]);

//   const formatDate = (date: string) => {
//     const dateObj = new Date(date);
//     return dateObj.toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric"
//     });
//   };

//   return (
//     <View style={tw`flex-1 bg-gray-50`}>
//       <View style={tw`bg-blue-600 rounded-b-3xl mb-3 py-1`}>
//         <View
//           style={tw`flex-row items-center justify-between px-6 mr-1 py-8 mt-12`}>
//           <View style={tw`flex-row items-center`}>
//             <Image
//               source={require("@/assets/hipo.png")}
//               style={tw`w-10 h-10`}
//             />
//             <View style={tw`flex-col`}>
//               <Text style={tw`text-white text-sm font-bold ml-2`}>
//                 Hello, {authState?.nama}
//               </Text>
//               <Text style={tw`text-white text-sm ml-2 italic`}>
//                 Add Kegiatan
//               </Text>
//             </View>
//           </View>
//           <View style={tw`flex-row items-center`}>
//             {/* logout button */}
//             <TouchableOpacity onPress={() => logout()}>
//               <Ionicons name="log-out-outline" size={25} color="white" />
//             </TouchableOpacity>
//             {/* <Ionicons name="search-outline" size={25} color="black" /> */}
//           </View>
//         </View>
//       </View>

//       <View style={tw`px-5`}>
//         <View style={tw`flex-row items-center justify-between`}>
//           <TextInput
//             style={tw`text-black bg-white py-3 px-4 rounded-full w-3/4 border border-gray-100`}
//             placeholder="Cari Kegiatan yang pernah Anda Buat"
//             placeholderTextColor="gray"
//             autoCapitalize="none"
//             value={search}
//             onChangeText={setSearch}
//           />
//           <View style={tw`flex-row items-center w-1/4 justify-center`}>
//             <Ionicons name="filter-outline" size={25} color="black" />
//             <Text style={tw`text-black text-xs font-medium ml-2`}>Filter</Text>
//           </View>
//         </View>
//         <ScrollView horizontal style={tw`mt-4 py-1`}>
//           <View
//             key="all"
//             style={tw`bg-blue-500 rounded-full px-4 py-2 mr-2 border border-blue-500`}>
//             <Text style={tw`text-white text-xs`}>Semua</Text>
//           </View>
//           {topicList.map((topic) => (
//             <View
//               key={topic.topic_id}
//               style={tw`bg-gray-100 rounded-full px-4 py-2 mr-2 border border-gray-100`}>
//               <Text style={tw`text-black text-xs`}>{topic.topic_nama}</Text>
//             </View>
//           ))}
//         </ScrollView>
//       </View>
//       <View style={tw`flex-row items-center justify-between px-5 mt-5`}>
//         <Text style={tw`text-black text-sm font-medium ml-1`}>
//           {kegiatanList.length} Kegiatan
//         </Text>
//         <View style={tw`flex-row items-center ml-4 mr-6`}>
//           <View style={tw`w-1/2 h-0.5 bg-gray-200`} />
//           <View style={tw`w-1/4 h-0.5 bg-gray-200 mr-5`} />
//           <Ionicons
//             name="checkmark-circle-outline"
//             size={22}
//             color="gray"
//             style={tw`mr-2`}
//           />
//         </View>
//       </View>
//       <View style={tw`px-5 mt-5`}>
//         {kegiatanList.map((kegiatan) => (
//           <TouchableOpacity
//             key={kegiatan.kegiatan_id}
//             style={tw`bg-gray-100 border border-gray-200 shadow-md rounded-3xl px-3 py-3  border border-gray-100`}>
//             <View
//               key={kegiatan.kegiatan_id}
//               style={tw`bg-gray-100  px-2 py-2 mr-2 `}>
//               <View style={tw`flex-row items-center mb-3`}>
//                 <View style={tw`bg-blue-400 rounded-md px-2 py-1 `}>
//                   <Text style={tw`text-white text-xs `}>
//                     {kegiatan.topic?.topic_nama}
//                   </Text>
//                 </View>
//                 <View style={tw`bg-blue-400 rounded-md px-2 py-1 ml-3`}>
//                   <Text style={tw`text-white text-xs `}>
//                     {kegiatan.jenis_kegiatan?.jenis_kegiatan}
//                   </Text>
//                 </View>
//               </View>
//               <View style={tw`flex-row items-center justify-between w-full`}>
//                 <View style={tw`flex-col`}>
//                   <Text style={tw`text-black text-sm font-medium`}>
//                     {kegiatan.nama_kegiatan}
//                   </Text>
//                   <Text style={tw`text-gray-500 text-xs`}>
//                     Tanggal: {formatDate(kegiatan.start_date || "")}
//                   </Text>
//                 </View>
//                 <View style={tw`ml-2`}>
//                   {kegiatan.status === "Draft" && (
//                     <Text
//                       style={tw`bg-red-500 text-white text-xs px-2 py-1 rounded-2xl`}>
//                       Draft
//                     </Text>
//                   )}
//                   {kegiatan.status === "Verified" && (
//                     <Text
//                       style={tw`bg-green-500 text-white text-xs px-2 py-1 rounded-2xl`}>
//                       Verified
//                     </Text>
//                   )}
//                   {kegiatan.status === "Run" && (
//                     <Text
//                       style={tw`bg-blue-500 text-white text-xs px-2 py-1 rounded-2xl`}>
//                       Run
//                     </Text>
//                   )}
//                   {kegiatan.status === "Completed" && (
//                     <Text
//                       style={tw`bg-green-500 text-white text-xs px-2 py-1 rounded-2xl`}>
//                       Completed
//                     </Text>
//                   )}
//                   {kegiatan.status === "Cancelled" && (
//                     <Text
//                       style={tw`bg-red-500 text-white text-xs px-2 py-1 rounded-2xl`}>
//                       Cancelled
//                     </Text>
//                   )}
//                 </View>
//               </View>
//               <View style={tw`h-0.5 bg-white mt-2 mb-2`} />
//               <Text style={tw`text-gray-500 text-xs`}>
//                 Lokasi: {kegiatan.location}
//               </Text>
//               <View style={tw`flex-row items-center mt-2`}>
//                 <Text style={tw`text-red-500 text-xs italic`}>
//                   {kegiatan.status === "Draft" &&
//                     "Menunggu persetujuan dari Admin"}
//                   {kegiatan.status === "Verified" && "Terverifikasi"}
//                   {kegiatan.status === "Run" && "Sedang Berjalan"}
//                   {kegiatan.status === "Completed" && "Selesai"}
//                   {kegiatan.status === "Cancelled" && "Dibatalkan oleh Admin"}
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <TouchableOpacity
//         style={tw`absolute bottom-30 right-7 w-13 h-13 bg-blue-600 rounded-full items-center justify-center shadow-lg`}>
//         <Ionicons name="add" size={28} color="white" />
//       </TouchableOpacity>
//     </View>
//   );
// }
