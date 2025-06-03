import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE0E0',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: 'red',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'black',
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalHeaderContainer: {
    width: '100%',
    marginBottom: 10,
  },

  // Input Styles
  input: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
    width: '100%',
  },
  dropdown: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    width: '100%',
  },

  // Button Styles
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    backgroundColor: 'red',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: 'lightgray',
    padding: 12,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  addTabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    alignSelf: 'center',
    width: '60%',
  },
  addTabText: {
    color: 'red',
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '500',
  },

  // Medication Item Styles
  medicationItem: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  medicationItemContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  // Time Picker Styles
  timeContainer: {
    marginBottom: 15,
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    height: 50,
    overflow: 'hidden',
  },
  timePicker: {
    flex: 1.5,
    height: 50,
  },
  amPmPicker: {
    flex: 1,
    height: 50,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#444',
  },

  // Frequency Options
  dateOptionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  dateOptionButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFCCCC',
    margin: 5,
  },
  selectedDateOption: {
    backgroundColor: 'red',
  },
  dateOptionText: {
    color: 'red',
    fontWeight: 'bold',
  },
  selectedDateOptionText: {
    color: 'white',
  },

  // Custom Days Selector
  weekdayToggleContainer: {
    flexDirection: 'column',
    marginBottom: 10,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  weekdayButton: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 50,
    padding: 8,
    marginHorizontal: 3,
    minWidth: 35,
    alignItems: 'center',
  },
  weekdaySelected: {
    backgroundColor: 'red',
  },
  weekdayText: {
    color: 'black',
    fontWeight: 'bold',
  },
  weekdaySelectedText: {
    color: 'white',
  },

  // Checkbox Styles
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  checkboxLabel: {
    fontSize: 16,
    fontWeight: '500',
  },

  // Remove Button
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ffebee',
    borderRadius: 5,
  },
  removeButtonText: {
    color: 'red',
    marginLeft: 5,
    fontSize: 14,
  },

  // Calendar Styles
  calendarContainer: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  calendarMonthYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  calendarNavButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  calendarWeekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  calendarWeekDay: {
    width: 32,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#555',
  },
  calendarDays: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarDay: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 16,
  },
  calendarSelectedDay: {
    backgroundColor: 'red',
  },
  calendarDayText: {
    textAlign: 'center',
    color: '#333',
  },
  calendarSelectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  calendarEmptyDay: {
    width: 32,
    height: 32,
    margin: 2,
  },
  dateDisplay: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },

  // ScrollView Styles
  medicationScrollView: {
    width: '100%',
    maxHeight: '80%',
  },
  medicationScrollContent: {
    paddingBottom: 100,
  },
});

export default styles;