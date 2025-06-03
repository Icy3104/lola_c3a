import React, { useState, useRef, useCallback, useEffect, memo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, FontAwesome5 } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Checkbox from 'expo-checkbox';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import styles from '../styles/settingsStyles';

// Define types for better type safety
type DayAbbreviation = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
type FrequencyType = 'Everyday' | 'Weekdays' | 'Weekends' | 'Customize';

interface Contact {
  id: string;
  name: string;
  number: string;
}

interface CustomDays {
  SUN: boolean;
  MON: boolean;
  TUE: boolean;
  WED: boolean;
  THU: boolean;
  FRI: boolean;
  SAT: boolean;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  pillsGrams: string;
  hour: string;
  minute: string;
  amPm: string;
  frequency: FrequencyType;
  customDays: CustomDays;
  taken: boolean;
  takenDate?: Date;
  imageUri?: string;
}

// Constants
const DEFAULT_CUSTOM_DAYS: CustomDays = {
  SUN: true, MON: true, TUE: true, WED: true, THU: true, FRI: true, SAT: true
};

const DEFAULT_MEDICATION: Medication = {
  id: '',
  name: '',
  dosage: '',
  pillsGrams: '',
  hour: '12',
  minute: '00',
  amPm: 'AM',
  frequency: 'Everyday',
  customDays: { ...DEFAULT_CUSTOM_DAYS },
  taken: false,
};

const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const days = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const years = Array.from({ length: 126 }, (_, i) => String(2025 - i));

// Helper functions
const formatDate = (date?: Date): string => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

const generateId = (): string => Math.random().toString(36).substring(2, 11);

const getCustomDaysForFrequency = (frequency: FrequencyType): CustomDays => {
  switch (frequency) {
    case 'Weekdays':
      return { SUN: false, MON: true, TUE: true, WED: true, THU: true, FRI: true, SAT: false };
    case 'Weekends':
      return { SUN: true, MON: false, TUE: false, WED: false, THU: false, FRI: false, SAT: true };
    case 'Everyday':
      return { ...DEFAULT_CUSTOM_DAYS };
    default:
      return { ...DEFAULT_CUSTOM_DAYS };
  }
};

// Memoized OptionButton component
const OptionButton = memo(({ icon, text, onPress }: {
  icon: string;
  text: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity style={styles.optionButton} onPress={onPress}>
      <FontAwesome5 name={icon} size={20} color="red" />
      <Text style={styles.optionText}>{text}</Text>
      <AntDesign name="right" size={16} color="#aaa" />
    </TouchableOpacity>
  );
});

// Memoized Calendar component
const Calendar = memo(({ onDateSelect, selectedDate }: {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date;
}) => {
  const [currentMonth, setCurrentMonth] = useState((selectedDate || new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState((selectedDate || new Date()).getFullYear());

  const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);

    // Add empty days for alignment
    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={calendarStyles.emptyDay} />);
    }

    // Add actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const isSelected = selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();

      days.push(
        <TouchableOpacity
          key={`day-${day}`}
          style={[calendarStyles.day, isSelected && calendarStyles.selectedDay]}
          onPress={() => onDateSelect(date)}
        >
          <Text style={[calendarStyles.dayText, isSelected && calendarStyles.selectedDayText]}>
            {day}
          </Text>
        </TouchableOpacity>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const changeYear = (increment: number) => {
    setCurrentYear(currentYear + increment);
  };

  return (
    <View style={calendarStyles.container}>
      <View style={calendarStyles.header}>
        <TouchableOpacity onPress={() => changeYear(-1)}>
          <Text style={calendarStyles.navButton}>{'<<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text style={calendarStyles.navButton}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={calendarStyles.monthYearText}>
          {monthNames[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text style={calendarStyles.navButton}>{'>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeYear(1)}>
          <Text style={calendarStyles.navButton}>{'>>'}</Text>
        </TouchableOpacity>
      </View>

      <View style={calendarStyles.weekDays}>
        {weekDays.map((day) => (
          <Text key={day} style={calendarStyles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={calendarStyles.daysContainer}>{renderDays()}</View>
    </View>
  );
});

const calendarStyles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  monthYearText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButton: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingHorizontal: 10,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 5,
  },
  weekDayText: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 12,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 15,
  },
  selectedDay: {
    backgroundColor: 'red',
  },
  dayText: {
    textAlign: 'center',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyDay: {
    width: 30,
    height: 30,
    margin: 2,
  },
});

const additionalStyles = StyleSheet.create({
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 8,
  },
  modalHeaderContainer: {
    width: '100%',
    marginBottom: 10,
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
  medicationItemContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalContent: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
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
  dateDisplay: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  validationText: {
    color: 'red',
    fontSize: 12,
    marginTop: 2,
    marginBottom: 5,
  },
  errorInput: {
    borderColor: 'red',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    backgroundColor: '#ffebee',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: 'red',
    fontWeight: 'bold',
  },
  confirmationContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  confirmButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  cancelConfirmButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  medicationDose: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  medicationTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  medicationFrequency: {
    fontSize: 14,
    color: '#666',
  },
  updateMedicationButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 15,
  },
  updateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  takePhotoButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  takePhotoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
    alignSelf: 'center',
  },
  medicationImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'center',
  },
  loadingContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1000,
  },
  accountInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  accountInfoHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'red',
  },
  accountInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  accountInfoLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  accountInfoValue: {
    color: '#333',
  },
  contactItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactNumber: {
    color: '#666',
  },
});

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const medicationScrollViewRef = useRef<ScrollView>(null);

  // Modal visibility states
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [showCalendar, setShowCalendar] = useState<number | null>(null);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [medicationToDelete, setMedicationToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Tab state for medication modal
  const [activeTab, setActiveTab] = useState<'update' | 'add' | 'remove'>('update');

  // Camera states
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();

  // Profile states
  const [tempName, setTempName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [tempAge, setTempAge] = useState('');
  const [age, setAge] = useState('');
  const [tempAddress, setTempAddress] = useState('');
  const [address, setAddress] = useState('');
  const [tempGender, setTempGender] = useState('Male');
  const [gender, setGender] = useState('Male');
  const [tempContactNumber, setTempContactNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null);
  const [tempDateOfBirth, setTempDateOfBirth] = useState<Date | null>(null);
  const [tempBirthday, setTempBirthday] = useState('');

  // Medication states
  const [newMedication, setNewMedication] = useState<Medication>({
    ...DEFAULT_MEDICATION,
    id: generateId(),
  });
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([{ id: generateId(), name: '', number: '' }]);
  const [medications, setMedications] = useState<Medication[]>([
    { 
      ...DEFAULT_MEDICATION, 
      id: generateId(),
      name: 'Metformin',
      dosage: '500 mg',
      pillsGrams: '1 pill',
      hour: '08',
      minute: '30',
      amPm: 'AM'
    },
    { 
      ...DEFAULT_MEDICATION, 
      id: generateId(),
      name: 'Vitamin B12',
      dosage: '2.4 mg',
      pillsGrams: '1 pill',
      hour: '09',
      minute: '00',
      amPm: 'AM'
    }
  ]);

  // Validation states
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [birthdayError, setBirthdayError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [formValid, setFormValid] = useState(false);

  // Validation functions
  const validateName = useCallback((name: string) => {
    const lettersOnly = /^[A-Za-z\s]+$/;
    if (!lettersOnly.test(name)) {
      setNameError('ONLY LETTERS');
      return false;
    }
    setNameError('');
    return true;
  }, []);

  const validateAge = useCallback((age: string) => {
    const numbersOnly = /^[0-9]+$/;
    if (!numbersOnly.test(age)) {
      setAgeError('Please input your age in numbers');
      return false;
    }
    setAgeError('');
    return true;
  }, []);

  const validateAddress = useCallback((address: string) => {
    if (address.trim() === '') {
      setAddressError('Please input your current home address');
      return false;
    }
    setAddressError('');
    return true;
  }, []);

  const validateBirthday = useCallback((birthday: string) => {
    if (birthday.trim() === '') {
      setBirthdayError('Please follow the format Month Day Year');
      return false;
    }

    const dateParts = birthday.split('/');
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || 
        dateParts[1].length !== 2 || dateParts[2].length !== 4) {
      setBirthdayError('Please follow the format MM/DD/YYYY');
      return false;
    }

    const numbersOnly = /^[0-9\/]+$/;
    if (!numbersOnly.test(birthday)) {
      setBirthdayError('Please put only numbers');
      return false;
    }

    setBirthdayError('');
    return true;
  }, []);

  const validateContactNumber = useCallback((number: string) => {
    if (!number.startsWith('09')) {
      setContactNumberError('Please start with 09');
      return false;
    }

    if (number.length !== 11) {
      setContactNumberError('It should only consist of 11 characters in total');
      return false;
    }

    const numbersOnly = /^[0-9]+$/;
    if (!numbersOnly.test(number)) {
      setContactNumberError('Please enter numbers only');
      return false;
    }

    setContactNumberError('');
    return true;
  }, []);

  // Form validation
  const validateForm = useCallback(() => {
    const isNameValid = validateName(tempName);
    const isAgeValid = validateAge(tempAge);
    const isAddressValid = validateAddress(tempAddress);
    const isBirthdayValid = tempBirthday ? validateBirthday(tempBirthday) : true;
    const isContactNumberValid = validateContactNumber(tempContactNumber);

    setFormValid(
      isNameValid && isAgeValid && isAddressValid && 
      (tempBirthday ? isBirthdayValid : true) && isContactNumberValid
    );
  }, [
    tempName, tempAge, tempAddress, tempBirthday, tempContactNumber,
    validateName, validateAge, validateAddress, validateBirthday, validateContactNumber
  ]);

  // Run validation when profile modal is open or fields change
  useEffect(() => {
    if (profileModalVisible) {
      validateForm();
    }
  }, [tempName, tempAge, tempAddress, tempBirthday, tempContactNumber, profileModalVisible, validateForm]);

  // Camera functions
  const handleTakePhoto = async () => {
    try {
      setIsLoading(true);
      
      // Request camera permissions if not granted
      if (!cameraPermission?.granted) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission required', 'Camera access is needed to take photos');
          setIsLoading(false);
          return;
        }
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.7,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setImageUri(result.assets[0].uri);
        
        // Request media library permission to save
        if (!mediaPermission?.granted) {
          const { status } = await MediaLibrary.requestPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permission required', 'Need media library access to save photos');
            setIsLoading(false);
            return;
          }
        }
        
        // Save to media library
        await MediaLibrary.saveToLibraryAsync(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image');
    } finally {
      setIsLoading(false);
    }
  };

  // Profile modal handlers
  const openProfileModal = useCallback(() => {
    setProfileModalVisible(true);
    setContactModalVisible(false);
    setMedicationModalVisible(false);
    setAccountModalVisible(false);
    
    setTempName(displayName);
    setTempAge(age);
    setTempAddress(address);
    setTempGender(gender);
    setTempContactNumber(contactNumber);
    setTempDateOfBirth(dateOfBirth);
    setTempBirthday(formatDate(dateOfBirth));

    // Reset validation errors
    setNameError('');
    setAgeError('');
    setAddressError('');
    setBirthdayError('');
    setContactNumberError('');
  }, [displayName, age, address, gender, contactNumber, dateOfBirth]);

  const handleSaveProfile = useCallback(() => {
    if (!formValid) {
      Alert.alert('Validation Error', 'Please fix all validation errors before saving.');
      return;
    }

    if (tempDateOfBirth && isNaN(tempDateOfBirth.getTime())) {
      Alert.alert('Invalid Date', 'Please select a valid birthday.');
      return;
    }

    setDisplayName(tempName.trim());
    setAge(tempAge);
    setAddress(tempAddress);
    setGender(tempGender);
    setContactNumber(tempContactNumber);
    setDateOfBirth(tempDateOfBirth);

    setProfileModalVisible(false);
    Alert.alert('Success', 'Profile updated successfully!');
  }, [formValid, tempName, tempAge, tempAddress, tempGender, tempContactNumber, tempDateOfBirth]);

  // Contact handlers
  const handleAddContact = useCallback(() => {
    setContacts((prevContacts) => [...prevContacts, { id: generateId(), name: '', number: '' }]);
  }, []);

  const handleContactChange = useCallback((id: string, field: 'name' | 'number', value: string) => {
    setContacts((prevContacts) => 
      prevContacts.map(contact => 
        contact.id === id ? { ...contact, [field]: value } : contact
      )
    );
  }, []);

  const handleRemoveContact = useCallback((id: string) => {
    if (contacts.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one contact');
      return;
    }
    setContacts(prev => prev.filter(contact => contact.id !== id));
  }, [contacts.length]);

  const handleSaveContacts = useCallback(() => {
    const invalidContacts = contacts.filter(
      (contact) => (contact.name.trim() !== '' && contact.number.trim() === '') ||
                   (contact.name.trim() === '' && contact.number.trim() !== '')
    );

    if (invalidContacts.length > 0) {
      Alert.alert('Incomplete Contact', 'Please provide both name and number for all contacts or remove empty ones.');
      return;
    }

    const validContacts = contacts.filter(
      (contact) => contact.name.trim() !== '' && contact.number.trim() !== ''
    );
    
    if (validContacts.length === 0) {
      Alert.alert('No Valid Contacts', 'Please add at least one valid contact');
      return;
    }

    setContacts(validContacts);
    setContactModalVisible(false);
    Alert.alert('Success', 'Contacts updated successfully!');
  }, [contacts]);

  // Medication handlers
  const handleMedicationChange = useCallback(
    (field: keyof Medication, value: string, isNewMedication: boolean = false) => {
      if (isNewMedication) {
        setNewMedication(prev => ({ ...prev, [field]: value }));
      } else if (selectedMedication) {
        setSelectedMedication(prev => ({ ...prev, [field]: value }));
      }
    },
    [selectedMedication]
  );

  const handleTimeChange = useCallback(
    (field: 'hour' | 'minute' | 'amPm', value: string, isNewMedication: boolean = false) => {
      if (isNewMedication) {
        setNewMedication(prev => ({ ...prev, [field]: value }));
      } else if (selectedMedication) {
        setSelectedMedication(prev => ({ ...prev, [field]: value }));
      }
    },
    [selectedMedication]
  );

  const handleFrequencyChange = useCallback(
    (value: FrequencyType, isNewMedication: boolean = false) => {
      if (isNewMedication) {
        setNewMedication(prev => ({
          ...prev,
          frequency: value,
          customDays: getCustomDaysForFrequency(value)
        }));
      } else if (selectedMedication) {
        setSelectedMedication(prev => ({
          ...prev,
          frequency: value,
          customDays: getCustomDaysForFrequency(value)
        }));
      }
    },
    [selectedMedication]
  );

  const toggleCustomDay = useCallback(
    (day: DayAbbreviation, isNewMedication: boolean = false) => {
      if (isNewMedication) {
        setNewMedication(prev => ({
          ...prev,
          customDays: { ...prev.customDays, [day]: !prev.customDays[day] }
        }));
      } else if (selectedMedication) {
        setSelectedMedication(prev => ({
          ...prev,
          customDays: { ...prev.customDays, [day]: !prev.customDays[day] }
        }));
      }
    },
    [selectedMedication]
  );

  const toggleTaken = useCallback(
    (isNewMedication: boolean = false) => {
      if (isNewMedication) {
        setNewMedication(prev => ({
          ...prev,
          taken: !prev.taken,
          takenDate: prev.taken ? undefined : new Date()
        }));
        setShowCalendar(!newMedication.taken ? -1 : null);
      } else if (selectedMedication) {
        setSelectedMedication(prev => ({
          ...prev,
          taken: !prev.taken,
          takenDate: prev.taken ? undefined : new Date()
        }));
        setShowCalendar(selectedMedication && !selectedMedication.taken ? -2 : null);
      }
    },
    [newMedication.taken, selectedMedication]
  );

  const handleDateSelect = useCallback((date: Date) => {
    if (showCalendar === -1) {
      setNewMedication(prev => ({ ...prev, takenDate: date }));
    } else if (showCalendar === -2) {
      setSelectedMedication(prev => ({ ...prev, takenDate: date }));
    } else if (showCalendar !== null && showCalendar >= 0) {
      setMedications(prev => prev.map((med, idx) => 
        idx === showCalendar ? { ...med, takenDate: date } : med
      ));
    }
    setShowCalendar(null);
  }, [showCalendar]);

  const handleAddNewMedication = useCallback(() => {
    if (!newMedication.name.trim() || !newMedication.dosage.trim() || !newMedication.pillsGrams.trim()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields (name, dosage, and quantity)');
      return;
    }

    setMedications(prev => [...prev, { 
      ...newMedication, 
      id: generateId(),
      imageUri: imageUri || undefined
    }]);
    
    setNewMedication({
      ...DEFAULT_MEDICATION,
      id: generateId()
    });
    setImageUri(null);
    
    Alert.alert('Success', 'Medication added successfully!');
    setActiveTab('update');
  }, [newMedication, imageUri]);

  const handleUpdateMedication = useCallback(() => {
    if (!selectedMedication) return;
    
    if (!selectedMedication.name.trim() || !selectedMedication.dosage.trim() || !selectedMedication.pillsGrams.trim()) {
      Alert.alert('Incomplete Information', 'Please fill in all required fields (name, dosage, and quantity)');
      return;
    }

    setMedications(prev => prev.map(med => 
      med.id === selectedMedication.id ? { 
        ...selectedMedication,
        imageUri: imageUri || selectedMedication.imageUri 
      } : med
    ));
    
    setSelectedMedication(null);
    setImageUri(null);
    setActiveTab('update');
    Alert.alert('Success', 'Medication updated successfully!');
  }, [selectedMedication, imageUri]);

  const confirmDeleteMedication = useCallback(() => {
    if (medicationToDelete) {
      setMedications(prev => prev.filter(med => med.id !== medicationToDelete));
      setConfirmDeleteVisible(false);
      setMedicationToDelete(null);
      Alert.alert('Success', 'Medication removed successfully!');
    }
  }, [medicationToDelete]);

  const openMedicationModal = useCallback(() => {
    setProfileModalVisible(false);
    setContactModalVisible(false);
    setAccountModalVisible(false);
    
    setNewMedication({
      ...DEFAULT_MEDICATION,
      id: generateId()
    });
    setSelectedMedication(null);
    setImageUri(null);
    setActiveTab('update');
    
    setMedicationModalVisible(true);
  }, []);

  const openContactModal = useCallback(() => {
    setProfileModalVisible(false);
    setMedicationModalVisible(false);
    setAccountModalVisible(false);
    setContactModalVisible(true);
  }, []);

  const openAccountModal = useCallback(() => {
    setProfileModalVisible(false);
    setMedicationModalVisible(false);
    setContactModalVisible(false);
    setAccountModalVisible(true);
  }, []);

  // Render functions
  const renderFrequencyOptions = useCallback((
    medication: Medication, 
    isNewMedication: boolean = false
  ) => (
    <View style={styles.dateOptionContainer}>
      {(['Everyday', 'Weekdays', 'Weekends', 'Customize'] as const).map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.dateOptionButton,
            (isNewMedication ? newMedication.frequency === option : 
             selectedMedication?.frequency === option) && styles.selectedDateOption,
          ]}
          onPress={() => handleFrequencyChange(option, isNewMedication)}
        >
          <Text
            style={[
              styles.dateOptionText,
              (isNewMedication ? newMedication.frequency === option : 
               selectedMedication?.frequency === option) && styles.selectedDateOptionText,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  ), [newMedication.frequency, selectedMedication?.frequency, handleFrequencyChange]);

  const renderCustomDays = useCallback((
    medication: Medication, 
    isNewMedication: boolean = false
  ) => {
    const customDays = isNewMedication ? newMedication.customDays : selectedMedication?.customDays;
    if ((isNewMedication ? newMedication.frequency : selectedMedication?.frequency) !== 'Customize') {
      return null;
    }

    return (
      <View style={styles.weekdayToggleContainer}>
        <View style={additionalStyles.weekdayRow}>
          {(['SUN', 'MON', 'TUE', 'WED'] as const).map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.weekdayButton,
                customDays?.[day] && styles.weekdaySelected,
              ]}
              onPress={() => toggleCustomDay(day, isNewMedication)}
            >
              <Text
                style={[
                  styles.weekdayText,
                  customDays?.[day] && styles.weekdaySelectedText,
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={additionalStyles.weekdayRow}>
          {(['THU', 'FRI', 'SAT'] as const).map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.weekdayButton,
                customDays?.[day] && styles.weekdaySelected,
              ]}
              onPress={() => toggleCustomDay(day, isNewMedication)}
            >
              <Text
                style={[
                  styles.weekdayText,
                  customDays?.[day] && styles.weekdaySelectedText,
                ]}
              >
                {day === 'THU' ? 'THURS' : day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }, [newMedication.customDays, newMedication.frequency, selectedMedication?.customDays, 
      selectedMedication?.frequency, toggleCustomDay]);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {isLoading && (
        <View style={additionalStyles.loadingContainer}>
          <ActivityIndicator size="large" color="red" />
        </View>
      )}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Settings</Text>

      <View style={styles.profileContainer}>
        <FontAwesome5 name="user-circle" size={80} color="red" />
        <Text style={styles.username}>{displayName}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.optionsScrollContainer}>
        <View style={styles.optionsContainer}>
          <OptionButton
            icon="user-edit"
            text="Edit Profile"
            onPress={openProfileModal}
          />
          <OptionButton
            icon="phone"
            text="Edit Emergency Contact"
            onPress={openContactModal}
          />
          <OptionButton
            icon="pills"
            text="Edit Medications"
            onPress={openMedicationModal}
          />
          <OptionButton 
            icon="user" 
            text="Account" 
            onPress={openAccountModal} 
          />
          <OptionButton icon="paint-brush" text="Personalization" />
        </View>
      </ScrollView>

      {/* Account Modal */}
      <Modal
        visible={accountModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={additionalStyles.modalHeaderContainer}>
              <Text style={styles.modalHeader}>Account Information</Text>
            </View>

            <ScrollView>
              <View style={additionalStyles.accountInfoContainer}>
                <Text style={additionalStyles.accountInfoHeader}>Profile Information</Text>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Name:</Text>
                  <Text style={additionalStyles.accountInfoValue}>{displayName || 'Not set'}</Text>
                </View>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Age:</Text>
                  <Text style={additionalStyles.accountInfoValue}>{age || 'Not set'}</Text>
                </View>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Gender:</Text>
                  <Text style={additionalStyles.accountInfoValue}>{gender || 'Not set'}</Text>
                </View>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Birthday:</Text>
                  <Text style={additionalStyles.accountInfoValue}>
                    {dateOfBirth ? formatDate(dateOfBirth) : 'Not set'}
                  </Text>
                </View>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Address:</Text>
                  <Text style={additionalStyles.accountInfoValue}>{address || 'Not set'}</Text>
                </View>
                
                <View style={additionalStyles.accountInfoRow}>
                  <Text style={additionalStyles.accountInfoLabel}>Contact Number:</Text>
                  <Text style={additionalStyles.accountInfoValue}>{contactNumber || 'Not set'}</Text>
                </View>
              </View>

              <View style={additionalStyles.accountInfoContainer}>
                <Text style={additionalStyles.accountInfoHeader}>Emergency Contacts</Text>
                
                {contacts.filter(c => c.name.trim() && c.number.trim()).length > 0 ? (
                  contacts.filter(c => c.name.trim() && c.number.trim()).map((contact) => (
                    <View key={contact.id} style={additionalStyles.contactItem}>
                      <Text style={additionalStyles.contactName}>{contact.name}</Text>
                      <Text style={additionalStyles.contactNumber}>{contact.number}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={{ color: '#666', textAlign: 'center', marginVertical: 10 }}>
                    No emergency contacts set
                  </Text>
                )}
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setAccountModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Medication Modal */}
      <Modal
        visible={medicationModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => {
          setMedicationModalVisible(false);
          setActiveTab('update');
          setSelectedMedication(null);
          setNewMedication({
            ...DEFAULT_MEDICATION,
            id: generateId()
          });
          setImageUri(null);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={additionalStyles.modalContent}>
            {/* Tab Bar */}
            <View style={additionalStyles.tabBar}>
              {[
                { key: 'update', label: 'Update Medications' },
                { key: 'add', label: 'Add Medications' },
                { key: 'remove', label: 'Remove Medications' }
              ].map(tab => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    additionalStyles.tab,
                    activeTab === tab.key && additionalStyles.activeTab
                  ]}
                  onPress={() => {
                    setActiveTab(tab.key as 'update' | 'add' | 'remove');
                    if (tab.key === 'update') {
                      setSelectedMedication(null);
                      setImageUri(null);
                    }
                  }}
                >
                  <Text style={[
                    additionalStyles.tabText,
                    activeTab === tab.key && additionalStyles.activeTabText
                  ]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Tab Content */}
            <ScrollView 
              ref={medicationScrollViewRef}
              contentContainerStyle={{ paddingBottom: 100 }}
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
            >
              {activeTab === 'update' && (
                <View>
                  {medications.map((med) => (
                    <TouchableOpacity 
                      key={med.id}
                      style={additionalStyles.medicationCard}
                      onPress={() => {
                        setSelectedMedication(med);
                        setImageUri(med.imageUri || null);
                        setActiveTab('add');
                        medicationScrollViewRef.current?.scrollTo({ y: 0, animated: true });
                      }}
                    >
                      <View style={additionalStyles.medicationHeader}>
                        <Text style={additionalStyles.medicationName}>
                          {med.name}
                        </Text>
                      </View>
                      <Text style={additionalStyles.medicationDose}>
                        Dose: {med.dosage}
                      </Text>
                      <Text style={additionalStyles.medicationTime}>
                        Time: {med.hour}:{med.minute} {med.amPm}
                      </Text>
                      <Text style={additionalStyles.medicationFrequency}>
                        Frequency: {med.frequency}
                      </Text>
                      {med.imageUri && (
                        <Image 
                          source={{ uri: med.imageUri }} 
                          style={additionalStyles.medicationImage} 
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeTab === 'add' && (
                <View>
                  <TouchableOpacity 
                    style={additionalStyles.takePhotoButton}
                    onPress={handleTakePhoto}
                  >
                    <Text style={additionalStyles.takePhotoButtonText}>Take photo</Text>
                  </TouchableOpacity>

                  {(imageUri || selectedMedication?.imageUri) && (
                    <Image 
                      source={{ uri: imageUri || selectedMedication?.imageUri }} 
                      style={additionalStyles.previewImage} 
                    />
                  )}

                  <TextInput
                    style={styles.input}
                    placeholder="Medication Name"
                    value={selectedMedication ? selectedMedication.name : newMedication.name}
                    onChangeText={(text) => handleMedicationChange('name', text, !selectedMedication)}
                    placeholderTextColor="#aaa"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Dose"
                    value={selectedMedication ? selectedMedication.dosage : newMedication.dosage}
                    onChangeText={(text) => handleMedicationChange('dosage', text, !selectedMedication)}
                    placeholderTextColor="#aaa"
                  />

                  <TextInput
                    style={styles.input}
                    placeholder="Number of Pills / Grams"
                    value={selectedMedication ? selectedMedication.pillsGrams : newMedication.pillsGrams}
                    onChangeText={(text) => handleMedicationChange('pillsGrams', text, !selectedMedication)}
                    keyboardType="numeric"
                    placeholderTextColor="#aaa"
                  />

                  <View style={styles.timeContainer}>
                    <Text style={styles.sectionLabel}>Time:</Text>
                    <View style={styles.dropdownRow}>
                      <View style={{ flex: 1.5 }}>
                        <Picker
                          selectedValue={selectedMedication ? selectedMedication.hour : newMedication.hour}
                          onValueChange={(value) => handleTimeChange('hour', value, !selectedMedication)}
                          style={{ backgroundColor: '#F5F5F5', borderRadius: 8 }}
                        >
                          {hourOptions.map((hour) => (
                            <Picker.Item key={hour} label={hour} value={hour} />
                          ))}
                        </Picker>
                      </View>

                      <Text style={{ fontSize: 18, fontWeight: 'bold', paddingHorizontal: 5 }}>
                        :
                      </Text>

                      <View style={{ flex: 1.5 }}>
                        <Picker
                          selectedValue={selectedMedication ? selectedMedication.minute : newMedication.minute}
                          onValueChange={(value) => handleTimeChange('minute', value, !selectedMedication)}
                          style={{ backgroundColor: '#F5F5F5', borderRadius: 8 }}
                        >
                          {minuteOptions.map((minute) => (
                            <Picker.Item key={minute} label={minute} value={minute} />
                          ))}
                        </Picker>
                      </View>

                      <View style={{ flex: 1 }}>
                        <Picker
                          selectedValue={selectedMedication ? selectedMedication.amPm : newMedication.amPm}
                          onValueChange={(value) => handleTimeChange('amPm', value, !selectedMedication)}
                          style={{ backgroundColor: '#F5F5F5', borderRadius: 8 }}
                        >
                          <Picker.Item label="AM" value="AM" />
                          <Picker.Item label="PM" value="PM" />
                        </Picker>
                      </View>
                    </View>
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionLabel}>Date:</Text>
                    {renderFrequencyOptions(selectedMedication || newMedication, !selectedMedication)}
                    {renderCustomDays(selectedMedication || newMedication, !selectedMedication)}
                  </View>

                  <View style={additionalStyles.checkboxContainer}>
                    <View style={additionalStyles.checkboxWrapper}>
                      <Checkbox
                        value={selectedMedication ? selectedMedication.taken : newMedication.taken}
                        onValueChange={() => toggleTaken(!selectedMedication)}
                        style={styles.checkbox}
                      />
                      <Text style={styles.checkboxLabel}>Taken</Text>
                    </View>

                    {(selectedMedication ? selectedMedication.taken : newMedication.taken) && (
                      <View style={{ width: '100%', marginTop: 10 }}>
                        {showCalendar === -1 || showCalendar === -2 ? (
                          <Calendar
                            onDateSelect={handleDateSelect}
                            selectedDate={selectedMedication ? selectedMedication.takenDate : newMedication.takenDate}
                          />
                        ) : (
                          <TouchableOpacity
                            style={additionalStyles.dateDisplay}
                            onPress={() => setShowCalendar(selectedMedication ? -2 : -1)}
                          >
                            <Text>
                              {(selectedMedication ? selectedMedication.takenDate : newMedication.takenDate)
                                ? formatDate(selectedMedication ? selectedMedication.takenDate : newMedication.takenDate)
                                : 'Select date'}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    style={additionalStyles.updateMedicationButton}
                    onPress={selectedMedication ? handleUpdateMedication : handleAddNewMedication}
                  >
                    <Text style={additionalStyles.updateButtonText}>
                      {selectedMedication ? 'Update Medication' : 'Add Medication'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeTab === 'remove' && (
                <View>
                  {medications.map((med) => (
                    <View 
                      key={med.id} 
                      style={additionalStyles.medicationCard}
                    >
                      <View style={additionalStyles.medicationHeader}>
                        <Text style={additionalStyles.medicationName}>
                          {med.name}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setMedicationToDelete(med.id);
                            setConfirmDeleteVisible(true);
                          }}
                        >
                          <AntDesign name="delete" size={20} color="red" />
                        </TouchableOpacity>
                      </View>
                      <Text style={additionalStyles.medicationDose}>
                        Dose: {med.dosage}
                      </Text>
                      <Text style={additionalStyles.medicationTime}>
                        Time: {med.hour}:{med.minute} {med.amPm}
                      </Text>
                      <Text style={additionalStyles.medicationFrequency}>
                        Frequency: {med.frequency}
                      </Text>
                      {med.imageUri && (
                        <Image 
                          source={{ uri: med.imageUri }} 
                          style={additionalStyles.medicationImage} 
                        />
                      )}
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>

            {/* Confirmation Modal for Delete */}
            <Modal
              visible={confirmDeleteVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setConfirmDeleteVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={additionalStyles.confirmationContainer}>
                  <Text style={additionalStyles.confirmationText}>
                    Remove medication?
                  </Text>
                  <Text style={{ marginBottom: 20 }}>
                    Are you sure you want to remove this medication?
                  </Text>
                  <View style={additionalStyles.confirmationButtons}>
                    <TouchableOpacity
                      style={additionalStyles.cancelConfirmButton}
                      onPress={() => {
                        setConfirmDeleteVisible(false);
                        setMedicationToDelete(null);
                      }}
                    >
                      <Text>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={additionalStyles.confirmButton}
                      onPress={confirmDeleteMedication}
                    >
                      <Text style={{ color: 'white' }}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setMedicationModalVisible(false);
                setActiveTab('update');
                setSelectedMedication(null);
                setNewMedication({
                  ...DEFAULT_MEDICATION,
                  id: generateId()
                });
                setImageUri(null);
              }}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Profile Modal */}
      <Modal
        visible={profileModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={additionalStyles.modalHeaderContainer}>
              <Text style={styles.modalHeader}>Edit Profile</Text>
            </View>

            <TextInput
              style={[styles.input, nameError && additionalStyles.errorInput]}
              placeholder="Name"
              value={tempName}
              onChangeText={(text) => {
                setTempName(text);
                validateName(text);
              }}
              placeholderTextColor="#aaa"
            />
            {nameError ? (
              <Text style={additionalStyles.validationText}>{nameError}</Text>
            ) : null}

            <TextInput
              style={[styles.input, ageError && additionalStyles.errorInput]}
              placeholder="Age"
              value={tempAge}
              onChangeText={(text) => {
                setTempAge(text);
                validateAge(text);
              }}
              keyboardType="numeric"
              placeholderTextColor="#aaa"
            />
            {ageError ? (
              <Text style={additionalStyles.validationText}>{ageError}</Text>
            ) : null}

            <TextInput
              style={[styles.input, addressError && additionalStyles.errorInput]}
              placeholder="Address"
              value={tempAddress}
              onChangeText={(text) => {
                setTempAddress(text);
                validateAddress(text);
              }}
              placeholderTextColor="#aaa"
            />
            {addressError ? (
              <Text style={additionalStyles.validationText}>{addressError}</Text>
            ) : null}

            <View style={styles.dropdownContainer}>
              <Text style={styles.dropdownLabel}>Gender:</Text>
              <Picker
                selectedValue={tempGender}
                onValueChange={(itemValue) => setTempGender(itemValue)}
                style={styles.dropdown}
              >
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Other" value="Other" />
              </Picker>
            </View>

            {/* Date of Birth Dropdowns */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
              {/* Month Dropdown */}
              <View style={{ flex: 0.32 }}>
                <Text style={styles.dropdownLabel}>Month:</Text>
                <Picker
                  selectedValue={tempDateOfBirth ? months[tempDateOfBirth.getMonth()] : months[0]}
                  onValueChange={(itemValue) => {
                    const monthIndex = months.indexOf(itemValue);
                    const newDate = tempDateOfBirth ? new Date(tempDateOfBirth) : new Date();
                    newDate.setMonth(monthIndex);
                    setTempDateOfBirth(newDate);
                    setTempBirthday(formatDate(newDate));
                    validateBirthday(formatDate(newDate));
                  }}
                  style={styles.dropdown}
                >
                  {months.map((month) => (
                    <Picker.Item key={month} label={month} value={month} />
                  ))}
                </Picker>
              </View>

              {/* Day Dropdown */}
              <View style={{ flex: 0.32 }}>
                <Text style={styles.dropdownLabel}>Day:</Text>
                <Picker
                  selectedValue={tempDateOfBirth ? String(tempDateOfBirth.getDate()).padStart(2, '0') : '01'}
                  onValueChange={(itemValue) => {
                    const day = parseInt(itemValue, 10);
                    const newDate = tempDateOfBirth ? new Date(tempDateOfBirth) : new Date();
                    newDate.setDate(day);
                    setTempDateOfBirth(newDate);
                    setTempBirthday(formatDate(newDate));
                    validateBirthday(formatDate(newDate));
                  }}
                  style={styles.dropdown}
                >
                  {days.map((day) => (
                    <Picker.Item key={day} label={day} value={day} />
                  ))}
                </Picker>
              </View>

              {/* Year Dropdown */}
              <View style={{ flex: 0.32 }}>
                <Text style={styles.dropdownLabel}>Year:</Text>
                <Picker
                  selectedValue={tempDateOfBirth ? String(tempDateOfBirth.getFullYear()) : '2000'}
                  onValueChange={(itemValue) => {
                    const year = parseInt(itemValue, 10);
                    const newDate = tempDateOfBirth ? new Date(tempDateOfBirth) : new Date();
                    newDate.setFullYear(year);
                    setTempDateOfBirth(newDate);
                    setTempBirthday(formatDate(newDate));
                    validateBirthday(formatDate(newDate));
                  }}
                  style={styles.dropdown}
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={year} value={year} />
                  ))}
                </Picker>
              </View>
            </View>
            {birthdayError ? (
              <Text style={additionalStyles.validationText}>{birthdayError}</Text>
            ) : null}

            <TextInput
              style={[
                styles.input,
                contactNumberError && additionalStyles.errorInput,
              ]}
              placeholder="Contact Number"
              value={tempContactNumber}
              onChangeText={(text) => {
                setTempContactNumber(text);
                validateContactNumber(text);
              }}
              keyboardType="phone-pad"
              maxLength={11}
              placeholderTextColor="#aaa"
            />
            {contactNumberError ? (
              <Text style={additionalStyles.validationText}>
                {contactNumberError}
              </Text>
            ) : null}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setProfileModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, !formValid && styles.disabledButton]}
                onPress={handleSaveProfile}
                disabled={!formValid}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Contact Modal */}
      <Modal
        visible={contactModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setContactModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={additionalStyles.modalHeaderContainer}>
              <Text style={styles.modalHeader}>Emergency Contacts</Text>
            </View>

            <ScrollView>
              {contacts.map((contact) => (
                <View key={contact.id} style={styles.contactRow}>
                  <TextInput
                    style={styles.contactInput}
                    placeholder="Name"
                    value={contact.name}
                    onChangeText={(text) => handleContactChange(contact.id, 'name', text)}
                    placeholderTextColor="#aaa"
                  />
                  <TextInput
                    style={styles.contactInput}
                    placeholder="Number"
                    value={contact.number}
                    onChangeText={(text) => handleContactChange(contact.id, 'number', text)}
                    keyboardType="phone-pad"
                    placeholderTextColor="#aaa"
                  />
                  <TouchableOpacity
                    onPress={() => handleRemoveContact(contact.id)}
                    style={styles.removeContactButton}
                  >
                    <AntDesign name="delete" size={20} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={additionalStyles.addTabContainer}
              onPress={handleAddContact}
            >
              <AntDesign name="plus" size={16} color="red" />
              <Text style={additionalStyles.addTabText}>Add Contact</Text>
            </TouchableOpacity>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setContactModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveContacts}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

export default SettingsScreen;