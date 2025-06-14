import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 30, 
  },
  screenContainer: {
    flex: 1,
    backgroundColor: "#FFF9E6",
    paddingTop: 30,
    paddingBottom: 20,
    alignItems: "center",
    width: "100%",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
    marginTop: 10,
  },  
  whiteBox: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  progressDotActive: {
    width: 10,
    height: 10,
    backgroundColor: "#007AFF",
    borderRadius: 5,
  },
  progressDot: {
    width: 10,
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 5,
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: "#E0E0E0",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    marginVertical: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginTop: 15,
    marginBottom: 5,
    alignSelf: "flex-start",
  },
  required: {
    color: "red",
  },
  inputContainer: {
    width: "100%",
    position: "relative",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    paddingHorizontal: 40,
    backgroundColor: "#FFF",
  },
  inputError: {
    borderColor: "red",
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
    width: 20,
    height: 20,
    tintColor: "#666",
  },
  inputLabel: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
    marginTop: -5,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  addMoreText: {
    color: "#007AFF",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#CCC",
  },
  saveButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  privacyContainer: {
    flexDirection: "row",
    backgroundColor: "#F0F0F0",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  privacyText: {
    flex: 1,
    fontSize: 12,
    color: "#444",
    marginLeft: 8,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    width: "100%",
    paddingHorizontal: 10,
  },
  phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
  },
  prefix: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
    alignSelf: "flex-start",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 10,
  },
  sendButtonPressed: {
    backgroundColor: "#005BBB",
  },
  sendButton: {
    marginTop: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  sendButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  sendButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  phoneConfirmContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  otpInput: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 10,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 8,
    backgroundColor: "#FFF",
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  resendText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 4,
  },
  buttonPressed: {
    backgroundColor: "#007AFF",
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
  },
  confirmButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  phoneConfirmBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F0F7FF",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
  },
  phoneText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
  },
  phoneStatus: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
  editButton: {
    padding: 8,
  },
  whiteBoxLarge: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 60,
    marginBottom: 20,
  },
  saveButtonOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 20,
    backgroundColor: "#FFF",
  },
  saveButtonPressed: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  saveButtonTextOutline: {
    fontSize: 16,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 5,
  },
  saveButtonTextPressed: {
    color: "#FFF",
  },
  successMessageContainer: {
    backgroundColor: "#D4EDDA",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 15,
  },
  successMessage: {
    color: "#155724",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalSubText: {
    marginTop: 5,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
});