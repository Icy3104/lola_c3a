import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // General Container
  container: {
    flex: 1,
    backgroundColor: "#ff5252",
    alignItems: "center",
    padding: 20,
  },

  // Headers & Titles
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#D32F2F",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#B71C1C",
    marginBottom: 10,
    textAlign: "center",
  },

  // Medication List Box
  medicationItem: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  medicationText: {
    flex: 1,
  },
  medTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  noMedsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
  checkbox: {
    marginRight: 10,
  },

  // Buttons
  deleteButton: {
    backgroundColor: "#D32F2F",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  addButton: {
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 10,
  },

  // Input Fields
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
  },
  dateTimeInput: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    width: "85%",
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalHeader: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#777",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
  },
  saveButton: {
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },

  // Emergency Countdown Timer
  countdownTimer: {
    fontSize: 80,
    fontWeight: "bold",
    color: "#FF0000",
    textAlign: "center",
    alignSelf: "center",
    marginVertical: 30,
  },

  // Logo and Centered Text
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 20,
  },
  callingText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
  },
  ellipsisText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
  },
  centeredText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D32F2F",
    textAlign: "center",
    alignSelf: "center",
    width: "100%",
  },

  // Latest Medication Styles
  latestMedContainer: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  latestMedHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  latestMedText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  latestMedDateTime: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});

export default styles;