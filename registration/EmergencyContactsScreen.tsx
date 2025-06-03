import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import styles from "../styles/registrationStyles";

type NavigationProps = StackNavigationProp<RootStackParamList, "Home">;

const EmergencyContactsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();
  const [contacts, setContacts] = useState([
    { name: "", phone: "", errors: { name: "", phone: "" } },
  ]);
  const [isClicked, setIsClicked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => { };
    }, [])
  );

  // Validation
  const validatePhoneNumber = (text: string) => {
    if (text.length === 0) return "";
    return /^(9\d{9})$/.test(text) ? "" : "Phone number must be 10 digits and start with 9.";
  };

  // Input Handling
  const handleInputChange = (index: number, field: "name" | "phone", value: string) => {
    setContacts((prevContacts) => {
      const newContacts = [...prevContacts];
      newContacts[index][field] = value;

      if (field === "phone") {
        newContacts[index].errors.phone = validatePhoneNumber(value);
      } else {
        newContacts[index].errors.name = value.trim() === "" ? "Name is required." : "";
      }

      return newContacts;
    });
  };

  // Adding Contact
  const handleAddContact = () => {
    setContacts((prevContacts) => [
      ...prevContacts,
      { name: "", phone: "", errors: { name: "", phone: "" } },
    ]);
  };

  // Saving
  const handleSave = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 300);

    const newContacts = contacts.map((contact) => ({
      ...contact,
      errors: {
        name: contact.name.trim() === "" ? "Name is required." : "",
        phone: validatePhoneNumber(contact.phone),
      },
    }));

    setContacts(newContacts);

    const hasErrors = newContacts.some((contact) => contact.errors.name || contact.errors.phone);
    if (hasErrors) return;

    // Show success modal
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      navigation.navigate("Home");
    }, 2000); 
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView keyboardShouldPersistTaps="handled">
          {/* Navigation */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Layout */}
          <View style={[styles.whiteBoxLarge, { alignItems: "center" }]}>
            <Image source={require("../assets/Logo.png")} style={styles.Logo} />

            {/* Progress */}
            <View style={styles.progressContainer}>
              <View style={styles.progressDotActive} />
              <View style={styles.progressLine} />
              <View style={styles.progressDotActive} />
              <View style={styles.progressLine} />
              <View style={styles.progressDotActive} />
            </View>

            {/* Header */}
            <Text style={styles.title}>Emergency Contacts</Text>
            <Text style={styles.subtitle}>
              Fill in the data for profile. It will take a couple of minutes.
            </Text>

            {/* Contacts */}
            <View style={{ alignItems: "flex-start", width: "100%" }}>
              <Text style={styles.header}>Contacts</Text>
            </View>
            <Text style={styles.infoText}>These contacts are used for emergency calling.</Text>

            {contacts.map((contact, index) => (
              <View key={index} style={{ width: "100%", marginBottom: 15 }}>
                {/* Name */}
                <Text style={styles.inputLabel}>
                  Contact Name<Text style={styles.required}>*</Text>
                </Text>
                <View style={[styles.inputContainer, contact.errors.name && styles.inputError]}>
                  <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter contact name"
                    placeholderTextColor="#999"
                    value={contact.name}
                    onChangeText={(text) => handleInputChange(index, "name", text)}
                  />
                </View>
                {contact.errors.name !== "" && <Text style={styles.errorText}>{contact.errors.name}</Text>}

                {/* Phone */}
                <Text style={styles.inputLabel}>
                  Contact Number<Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.phoneInputContainer}>
                  <Text style={styles.prefix}>+63</Text>
                  <TextInput
                    style={styles.phoneInput}
                    keyboardType="number-pad"
                    maxLength={10}
                    placeholder="9XXXXXXXXX"
                    placeholderTextColor="#999"
                    value={contact.phone}
                    onChangeText={(text) => handleInputChange(index, "phone", text)}
                  />
                </View>
                {contact.errors.phone !== "" && <Text style={styles.errorText}>{contact.errors.phone}</Text>}
              </View>
            ))}

            {/* Add Contact */}
            <TouchableOpacity style={styles.resendButton} onPress={handleAddContact}>
              <Text style={styles.resendText}>+ Add More</Text>
            </TouchableOpacity>

            {/* Save */}
            <TouchableOpacity
              style={[styles.saveButtonOutline, isClicked && styles.saveButtonPressed]}
              onPress={handleSave}
            >
              <MaterialIcons name="check" size={18} color={isClicked ? "#FFF" : "#000"} />
              <Text style={[styles.saveButtonTextOutline, isClicked && styles.saveButtonTextPressed]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Success Modal */}
      <Modal transparent={true} visible={modalVisible} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Ionicons name="checkmark-circle-outline" size={50} color="#28a745" />
            <Text style={styles.modalText}>You have successfully registered!</Text>
            <Text style={styles.modalSubText}>Proceeding to the app...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default EmergencyContactsScreen;