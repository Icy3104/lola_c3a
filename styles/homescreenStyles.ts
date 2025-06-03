import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8DC', // light yellow background
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 20,
  },
  menuButton: {
    width: 140,
    height: 80,
    backgroundColor: '#4682B4', // steel blue
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 2 },
  },
  emergencyButton: {
    width: 140,
    height: 80,
    backgroundColor: '#FF3B30', // red for emergency
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 2, height: 2 },
  },
  buttonText: {
    marginTop: 5,
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
