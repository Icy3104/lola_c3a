import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import registrationStyles from "../styles/registrationStyles";

type RootStackParamList = {
  OTP: { phone: string };
};

const RegistrationScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(true);
  const [isPressed, setIsPressed] = useState(false);

  // Validate Phone Number
  const validatePhoneNumber = (text: string) => {
    setPhoneNumber(text);

    if (text.length === 0) {
      setError("");
    } else if (!/^(9\d{9})$/.test(text)) {
      setError("Phone number must be 10 digits and start with 9.");
    } else {
      setError("");
    }
  };

  // Handle Send Code
  const handleSendCode = () => {
    setIsPressed(true);

    setTimeout(() => {
      if (!phoneNumber || !/^(9\d{9})$/.test(phoneNumber)) {
        setError("Phone number must be 10 digits and start with 9.");
      } else {
        navigation.navigate("OTP", { phone: phoneNumber });
      }
      setIsPressed(false);
    }, 200);
  };

  return (
    <View style={registrationStyles.container}>
      
      {/* White Box Container */}
      <View style={registrationStyles.whiteBox}>
        <Image source={require("../assets/Logo.png")} style={registrationStyles.Logo} />

        {/* Progress Indicator */}
        <View style={registrationStyles.progressContainer}>
          <View style={registrationStyles.progressDotActive} />
          <View style={registrationStyles.progressLine} />
          <View style={registrationStyles.progressDot} />
          <View style={registrationStyles.progressLine} />
          <View style={registrationStyles.progressDot} />
        </View>

        {/* Title */}
        <Text style={registrationStyles.title}>Registration</Text>
        <Text style={registrationStyles.subtitle}>
          Fill in the registration data. It will take a couple of minutes. All you need is a phone number.
        </Text>

        {/* Privacy Notice */}
        {showPrivacy && (
          <View style={registrationStyles.privacyContainer}>
            <FontAwesome name="lock" size={16} color="#666" />
            <Text style={registrationStyles.privacyText}>
              We take privacy issues seriously. Your personal data is securely protected.
            </Text>
            <TouchableOpacity onPress={() => setShowPrivacy(false)}>
              <MaterialIcons name="close" size={18} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        {/* Phone Input */}
        <Text style={registrationStyles.label}>Enter your phone number</Text>
        <View style={registrationStyles.phoneInputContainer}>
          <Text style={registrationStyles.prefix}>+63</Text>
          <TextInput
            style={[registrationStyles.phoneInput, error ? registrationStyles.inputError : null]}
            keyboardType="number-pad"
            maxLength={10}
            placeholder="9XXXXXXXXX"
            value={phoneNumber}
            onChangeText={validatePhoneNumber}
          />
        </View>

        {error && <Text style={registrationStyles.errorText}>{error}</Text>}

        {/* Send Code Button */}
        <TouchableOpacity
          style={[registrationStyles.sendButton, isPressed ? registrationStyles.sendButtonPressed : null]}
          onPress={handleSendCode}
        >
          <Text style={registrationStyles.sendButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegistrationScreen;