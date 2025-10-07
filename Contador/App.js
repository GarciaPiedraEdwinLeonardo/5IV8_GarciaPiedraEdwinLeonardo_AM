import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

export default function App() {

  const[cuenta, setCount] = useState(0);
  const sumar = () => setCount(cuenta+1);
  const restar = () => setCount(cuenta-1);

  return (
    <View style={styles.principalcontainer}>
      <Text style={styles.title}>Contador</Text>
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{cuenta}</Text>
      </View>
      <View style={styles.container}>
        <View style={styles.subcontainer}>
          <TouchableOpacity style={[styles.btn]} onPress={restar}>
            <Text style={styles.textbtn}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={sumar}>
            <Text style={styles.textbtn}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  principalcontainer: {
    flex: 1,
    backgroundColor: '#f0f8ff', 
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b22222',
    marginBottom: 30,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 20,
  },
  btn: {
    backgroundColor: '#dc143c',
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textbtn: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  counterContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#1e90ff',
    marginBottom: 30,
  },
  counterText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#b22222',
    textAlign: 'center',
  },
});