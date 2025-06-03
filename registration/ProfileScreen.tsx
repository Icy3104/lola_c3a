import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { useNavigation, NavigationProp, useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import styles from "../styles/registrationStyles";

type RootStackParamList = {
  EmergencyContacts: undefined;
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthday, setBirthday] = useState<Date | null>(null);
  const [address, setAddress] = useState("");
  const [isClicked, setIsClicked] = useState(false);
  const isNavigating = useRef(false);

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    birthday: false,
    address: false,
  });

  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  // Date Picker Handling
  const handleDateConfirm = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date > today) {
      setErrors((prev) => ({ ...prev, birthday: true }));
    } else {
      setBirthday(date);
      setErrors((prev) => ({ ...prev, birthday: false }));
    }
    setDatePickerVisible(false);
  };

  // Validation Handling
  const handleValidation = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: value.trim() === "" }));
  };

  // Save and Navigate
  const handleSave = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);

    Keyboard.dismiss();

    const newErrors = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      birthday: birthday === null,
      address: address.trim() === "",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).includes(true)) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }

    navigation.navigate("EmergencyContacts");
  };

  // Reset State on Unmount
  useFocusEffect(
    useCallback(() => {
      return () => {
        setFirstName("");
        setLastName("");
        setBirthday(null);
        setAddress("");
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          
          {/* Navigation */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Profile Form */}
          <View style={[styles.whiteBoxLarge, { alignItems: "center" }]}>
            <Image source={require("../assets/Logo.png")} style={styles.Logo} />

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDotActive} />
              <View style={styles.progressLine} />
              <View style={styles.progressDotActive} />
              <View style={styles.progressLine} />
              <View style={styles.progressDot} />
            </View>

            {/* Title */}
            <Text style={styles.title}>Profile info</Text>
            <Text style={styles.subtitle}>
              Fill in the data for profile. It will take a couple of minutes.
            </Text>

            {/* Personal Data Section */}
            <View style={{ alignItems: "flex-start", width: "100%" }}>
              <Text style={styles.header}>Personal data</Text>
            </View>

            {/* First Name */}
            <Text style={styles.label}>
              First name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.firstName && styles.inputError]}
              placeholder="First name"
              value={firstName}
              onChangeText={(text) => {
                setFirstName(text);
                handleValidation("firstName", text);
              }}
            />
            {errors.firstName && <Text style={styles.errorText}>First name is required.</Text>}

            {/* Middle Name */}
            <Text style={styles.label}>Middle name</Text>
            <TextInput
              style={styles.input}
              placeholder="Middle name"
              value={middleName}
              onChangeText={setMiddleName}
            />

            {/* Last Name */}
            <Text style={styles.label}>
              Last name <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.lastName && styles.inputError]}
              placeholder="Last name"
              value={lastName}
              onChangeText={(text) => {
                setLastName(text);
                handleValidation("lastName", text);
              }}
            />
            {errors.lastName && <Text style={styles.errorText}>Last name is required.</Text>}

            {/* Date of Birth */}
            <Text style={styles.label}>
              Date of Birth <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              style={[styles.input, errors.birthday && styles.inputError, { justifyContent: "center" }]}
              onPress={() => setDatePickerVisible(true)}
            >
              <Text style={{ color: birthday ? "#000" : "#888"}}>
                {birthday ? birthday.toDateString() : "mm/dd/yyyy"}
              </Text>
            </TouchableOpacity>
            {errors.birthday && <Text style={styles.errorText}>Date cannot be in the future.</Text>}

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              date={birthday || new Date()}
              onConfirm={handleDateConfirm}
              onCancel={() => setDatePickerVisible(false)}
            />

            {/* Address */}
            <Text style={styles.label}>
              Address <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, errors.address && styles.inputError]}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
            />

            {/* Save Button */}
            <TouchableOpacity
              style={[styles.saveButtonOutline, isClicked && styles.saveButtonPressed]}
              onPress={handleSave}
            >
              <MaterialIcons name="check" size={18} color={isClicked ? "#FFF" : "#000"} />
              <Text
                style={[styles.saveButtonTextOutline, isClicked && styles.saveButtonTextPressed]}
              >
                Save
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ProfileScreen;