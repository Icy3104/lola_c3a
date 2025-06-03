//MedicationScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import CheckBox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";

interface Medication {
  id: number;
  name: string;
  dosage: string;
  date: string;
  time: string;
  checked: boolean;
}

const MedicationScreen = ({ navigation }: any) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [medName, setMedName] = useState("");
  const [medDosage, setMedDosage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);

  useEffect(() => {
    const loadMedications = async () => {
      const storedMeds = await AsyncStorage.getItem("medications");
      if (storedMeds) setMedications(JSON.parse(storedMeds));
    };
    loadMedications();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("medications", JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    const requestPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Enable notifications for medication reminders.");
      }
    };
    requestPermissions();
  }, []);

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(date);
  };

  const onTimeChange = (event: any, time?: Date) => {
    setShowTimePicker(false);
    if (time) setSelectedTime(time);
  };

  const scheduleNotification = async (med: Medication) => {
    const notificationTime = new Date(`${med.date} ${med.time}`);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `Time to take ${med.name}, ${med.dosage}.`,
      },
      trigger: { date: notificationTime },
    });
  };

  const handleAddMedication = () => {
    if (!medName || !medDosage || !selectedDate || !selectedTime) {
      Alert.alert("Error", "Enter all medication details.");
      return;
    }

    const formattedDate = selectedDate.toISOString().split("T")[0];
    const formattedTime = selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const newMedication: Medication = {
      id: Date.now(),
      name: medName,
      dosage: medDosage,
      date: formattedDate,
      time: formattedTime,
      checked: false,
    };

    setMedications([...medications, newMedication]);
    setModalVisible(false);
    setMedName("");
    setMedDosage("");
    setSelectedDate(null);
    setSelectedTime(null);
    scheduleNotification(newMedication);
  };

  const handleCheck = (id: number) => {
    const med = medications.find((med) => med.id === id);
    if (med) {
      // Toggle the checked state in the medications list
      const updatedMedications = medications.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
      setMedications(updatedMedications);
      
      // If checking (not unchecking), show the confirmation alert
      if (!med.checked) {
        setSelectedMedication(med);
        Alert.alert(
          "Did you take your medicine?",
          "",
          [
            {
              text: "Yes",
              onPress: () => {
                Alert.alert(
                  "Pick a New Reminder Time",
                  "Set a new reminder time for this medication.",
                  [
                    {
                      text: "Set Time",
                      onPress: () => {
                        setShowTimePicker(true);
                      },
                    },
                    {
                      text: "Cancel",
                      style: "cancel",
                    },
                  ]
                );
              },
            },
            {
              text: "No",
              onPress: () => {
                Alert.alert("Don't forget to take your medicine!");
              },
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  const updateMedicationTime = () => {
    if (selectedMedication && selectedTime) {
      const updatedMedications = medications.map((med) =>
        med.id === selectedMedication.id
          ? { ...med, time: selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }) }
          : med
      );
      setMedications(updatedMedications);
      scheduleNotification({
        ...selectedMedication,
        time: selectedTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }),
      });
      setSelectedMedication(null);
      setSelectedTime(null);
      Alert.alert("Reminder updated!");
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this medication?",
      [
        {
          text: "Yes",
          onPress: () => {
            setMedications(medications.filter((med) => med.id !== id));
            Alert.alert("Medication reminder deleted successfully");
          },
        },
        { text: "No", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  return (
    <LinearGradient colors={["#f5f7fa", "#e4eaf1"]} style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-left" size={30} color="#3498db" />
      </TouchableOpacity>

      <Text style={styles.headerText}>My Medications</Text>

      {medications.length === 0 ? (
        <Text style={styles.noMedsText}>No medications scheduled.</Text>
      ) : (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={[styles.medItem, item.checked && styles.medItemChecked]}>
              <CheckBox
                value={item.checked}
                onValueChange={() => handleCheck(item.id)}
                style={styles.checkbox}
                color="#3498db"
              />
              <View style={{ flex: 1 }}>
                <Text style={[styles.medName, item.checked && styles.textChecked]}>{item.name}</Text>
                <Text style={[styles.medDosage, item.checked && styles.textChecked]}>{item.dosage}</Text>
                <Text style={[styles.medTimeDate, item.checked && styles.textCheckedLight]}>{`${item.date} at ${item.time}`}</Text>
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Icon name="trash-can" size={24} color="#e74c3c" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity style={styles.buttonWrapper} onPress={() => setModalVisible(true)}>
        <LinearGradient colors={["#3498db", "#2980b9"]} style={styles.gradientButton}>
          <Icon name="plus-circle" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add Medication</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Add Medication Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Add Medication</Text>

            <TextInput
              style={styles.input}
              placeholder="Medication Name"
              value={medName}
              onChangeText={setMedName}
            />
            <TextInput
              style={styles.input}
              placeholder="Dosage (mg/tablets)"
              value={medDosage}
              onChangeText={setMedDosage}
              keyboardType="numeric"
            />

            {/* Date Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.pickerText}>
                {selectedDate ? selectedDate.toDateString() : "Select Date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}

            {/* Time Picker */}
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.pickerText}>
                {selectedTime
                  ? selectedTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "Select Time"}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                display="default"
                onChange={onTimeChange}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButtonWrapper} onPress={() => setModalVisible(false)}>
                <LinearGradient colors={["#95a5a6", "#7f8c8d"]} style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.saveButtonWrapper} onPress={handleAddMedication}>
                <LinearGradient colors={["#2ecc71", "#27ae60"]} style={styles.gradientButton}>
                  <Text style={styles.buttonText}>Save</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Reminder Button */}
      {selectedMedication && selectedTime && (
        <TouchableOpacity style={styles.updateButtonWrapper} onPress={updateMedicationTime}>
          <LinearGradient colors={["#f39c12", "#e67e22"]} style={styles.gradientButton}>
            <Icon name="clock" size={24} color="white" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Update Reminder Time</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#34495e",
    alignSelf: "center",
    marginTop: 60,
    marginBottom: 30,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  medItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: "#3498db",
  },
  medItemChecked: {
    backgroundColor: "#f8f9fa",
    borderLeftColor: "#2ecc71",
  },
  checkbox: {
    marginRight: 16,
    height: 24,
    width: 24,
    borderRadius: 6,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34495e",
  },
  medDosage: {
    fontSize: 14,
    color: "#7f8c8d",
  },
  medTimeDate: {
    fontSize: 12,
    color: "#95a5a6",
    marginTop: 4,
  },
  textChecked: {
    color: "#7f8c8d",
    textDecorationLine: "line-through",
  },
  textCheckedLight: {
    color: "#bdc3c7",
    textDecorationLine: "line-through",
  },
  noMedsText: {
    fontSize: 18,
    color: "#7f8c8d",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#34495e",
    alignSelf: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    backgroundColor: "#f5f7fa",
    borderRadius: 10,
    padding: 14,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#e4eaf1",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pickerText: {
    color: "#7f8c8d",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  cancelButtonWrapper: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  saveButtonWrapper: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  updateButtonWrapper: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginTop: 20,
  },
});

export default MedicationScreen;