import React from "react";
import { Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import tw from "twrnc";

interface DropdownProps {
  data: { label: string; value: string | number }[];
  placeholder: string;
  searchPlaceholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  loading?: boolean;
  disabled?: boolean;
  hasError?: boolean;
}

const DropdownComponent: React.FC<DropdownProps> = ({
  data,
  placeholder,
  searchPlaceholder = "Search...",
  value,
  onChange,
  loading = false,
  disabled = false,
  hasError = false,
}) => {
  return (
    <View style={tw`w-full`}>
      {loading ? (
        <Text style={{ ...tw`text-gray-500`, fontSize: 14.8 }}>Loading...</Text>
      ) : (
        <>
          <Dropdown
            style={tw`p-4 mb-3 rounded-full ${
              hasError
                ? "bg-red-50 border-2 border-red-400"
                : "bg-white border border-gray-200"
            } ${disabled ? "opacity-50" : ""}`}
            placeholderStyle={{ ...tw`text-gray-400`, fontSize: 13.8 }}
            selectedTextStyle={{ ...tw`text-gray-800`, fontSize: 13.8 }}
            data={data}
            search
            searchPlaceholder={searchPlaceholder}
            labelField="label"
            valueField="value"
            placeholder={placeholder}
            value={value}
            onChange={(item) => onChange(item.value)}
            disable={disabled}
          />
        </>
      )}
    </View>
  );
};

export default DropdownComponent;
