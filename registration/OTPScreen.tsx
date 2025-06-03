import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import styles from "../styles/registrationStyles";
import { RootStackParamList } from "../navigation/RegistrationNavigator";

type OTPScreenNavigationProp = StackNavigationProp<RootStackParamList, "OTP">;

const OTPScreen: React.FC = () => {
  const navigation = useNavigation<OTPScreenNavigationProp>();
  const route = useRoute();
  const { phone } = route.params as { phone: string };

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // OTP Validation
  const handleOTPChange = (text: string) => {
    setOtp(text);
    setIsPressed(false);

    if (text.length === 0) {
      setError("Please enter the confirmation code.");
    } else if (!/^\d{6}$/.test(text)) {
      setError("The confirmation code must be exactly 6 digits.");
    } else {
      setError("");
    }
  };

  // OTP Confirmation
  const handleConfirm = () => {
    setIsPressed(true);

    setTimeout(() => {
      if (otp === "123456") {
        setIsConfirmed(true);
        setError("");
        navigation.navigate("Profile", { phone });
      } else {
        setError("Invalid confirmation code.");
      }
      setIsPressed(false);
    }, 200);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              
              {/* Navigation */}
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  position: "absolute",
                  top: Platform.OS === "android" ? 50 : 50,
                  left: 25,
                  zIndex: 10,
                  padding: 20,
                  backgroundColor: "transparent",
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#000" />
              </TouchableOpacity>

              {/* Registration Form */}
              <View style={styles.container}>
                <View style={styles.whiteBox}>
                  <Image source={require("../assets/Logo.png")} style={styles.Logo} />

                  {/* Progress Indicator */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressDotActive} />
                    <View style={styles.progressLine} />
                    <View style={styles.progressDot} />
                    <View style={styles.progressLine} />
                    <View style={styles.progressDot} />
                  </View>

                  {/* Title */}
                  <Text style={styles.title}>Registration</Text>
                  <Text style={styles.subtitle}>
                    Fill in the registration data. It will take a couple of minutes. All you need is a phone number.
                  </Text>

                  {/* Phone Number */}
                  <View style={styles.phoneConfirmBox}>
                    <View>
                      <Text style={styles.phoneText}>+63 {phone}</Text>
                      <Text style={styles.phoneStatus}>
                        {isConfirmed ? "✔ Number confirmed" : "Number not confirmed yet"}
                      </Text>
                    </View>

                    {isConfirmed ? (
                      <MaterialIcons name="check" size={18} color="#6D6D6D" />
                    ) : (
                      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.editButton}>
                        <MaterialIcons name="edit" size={18} color="#007AFF" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* OTP Input */}
                  <Text style={styles.label}>Confirmation code</Text>
                  <TextInput
                    style={styles.otpInput}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="------"
                    value={otp}
                    onChangeText={handleOTPChange}
                  />
                  {error ? <Text style={styles.errorText}>{error}</Text> : null}

                  {/* Resend OTP */}
                  <TouchableOpacity style={styles.resendButton}>
                    <Ionicons name="refresh" size={16} color="#007AFF" />
                    <Text style={styles.resendText}>Send again</Text>
                  </TouchableOpacity>

                  {/* Confirm Button */}
                  <TouchableOpacity
                    style={[styles.confirmButton, isPressed ? styles.buttonPressed : null]}
                    onPress={handleConfirm}
                  >
                    <Text style={styles.confirmButtonText}>{isConfirmed ? "Register" : "Confirm"}</Text>
                  </TouchableOpacity>

                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;