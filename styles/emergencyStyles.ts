import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#e53935',
  },
  emergencyOptions: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
  },
  callingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15,
  },
  countdownTimer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#e53935',
  },
  callingText: {
    fontSize: 18,
    color: '#333',
  },
  safeButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});
