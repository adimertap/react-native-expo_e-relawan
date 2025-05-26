import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';
import tw from 'twrnc';

interface DateTimePickerModalProps {
  isVisible: boolean;
  mode: 'date' | 'time';
  onConfirm: (date: Date) => void;
  onCancel: () => void;
}

const DateTimePickerModal: React.FC<DateTimePickerModalProps> = ({
  isVisible,
  mode,
  onConfirm,
  onCancel,
}) => {
  const [date, setDate] = React.useState(new Date());

  const handleConfirm = () => {
    onConfirm(date);
  };

  const handleChange = (event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
      if (Platform.OS === 'ios') {
        onConfirm(selectedDate);
      }
    }
  };

  if (Platform.OS === 'android') {
    return isVisible ? (
      <DateTimePicker
        value={date}
        mode={mode}
        onChange={(event, selectedDate) => {
          onCancel();
          if (selectedDate) {
            onConfirm(selectedDate);
          }
        }}
      />
    ) : null;
  }

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.modalContainer}>
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={date}
            mode={mode}
            display="spinner"
            onChange={handleChange}
            style={styles.picker}
          />
          <View style={styles.buttonContainer}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={onCancel}
            >
              <View style={tw`bg-gray-200 rounded-lg px-4 py-2`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-gray-300 rounded-full w-2 h-2 mr-2`} />
                  <View style={tw`bg-gray-300 rounded-full w-2 h-2`} />
                </View>
              </View>
            </Pressable>
            <Pressable
              style={[styles.button, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <View style={tw`bg-blue-500 rounded-lg px-4 py-2`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`bg-white rounded-full w-2 h-2 mr-2`} />
                  <View style={tw`bg-white rounded-full w-2 h-2`} />
                </View>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  picker: {
    height: 200,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    marginRight: 4,
  },
  confirmButton: {
    marginLeft: 4,
  },
});

export default DateTimePickerModal; 