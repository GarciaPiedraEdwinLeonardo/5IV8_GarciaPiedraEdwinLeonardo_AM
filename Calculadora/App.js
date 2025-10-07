import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function App() {
  const [display, setDisplay] = useState("0");
  const [operacion, setOperacion] = useState(null);
  const [valorAnterior, setValorAnterior] = useState(null);

  const agregarNumero = (numero) => {
    if (display === "0") {
      setDisplay(numero.toString());
    } else {
      setDisplay(display + numero.toString());
    }
  };

  const agregarOperacion = (op) => {
    setValorAnterior(parseFloat(display));
    setOperacion(op);
    setDisplay("0");
  };

  const calcularResultado = () => {
    
    const valorActual = parseFloat(display);
    let resultado = 0;
    switch (operacion) {
      case '+': resultado = valorAnterior + valorActual; break;
      case '-': resultado = valorAnterior - valorActual; break;
      case '*': resultado = valorAnterior * valorActual; break;
      case '/': resultado = valorAnterior / valorActual; break;
      default: return;
    }

    setDisplay(resultado.toString());
    setOperacion(null);
    setValorAnterior(null);
  };

  const limpiar = () => {
    setDisplay("0");
    setOperacion(null);
    setValorAnterior(null);
  };

  const agregarPunto = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  return (
    <View style={styles.principalcontainer}>
      <Text style={styles.title}>Calculadora</Text>

      <View style={styles.displayContainer}>
        <Text style={styles.displayText}>{display}</Text>
      </View>
      

      <View style={styles.tecladoContainer}>
        <View style={styles.fila}>
          <TouchableOpacity style={[styles.btn]} onPress={limpiar}>
            <Text style={styles.textbtn}>C</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => agregarOperacion('/')}>
            <Text style={styles.textbtn}>/</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => agregarOperacion('*')}>
            <Text style={styles.textbtn}>×</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn]} onPress={() => agregarOperacion('-')}>
            <Text style={styles.textbtn}>-</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fila}>
          {[7, 8, 9].map(num => (
            <TouchableOpacity key={num} style={[styles.btn]} onPress={() => agregarNumero(num)}>
              <Text style={styles.textbtn}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn, styles.btn]} onPress={() => agregarOperacion('+')}>
            <Text style={styles.textbtn}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fila}>
          {[4, 5, 6].map(num => (
            <TouchableOpacity key={num} style={[styles.btn]} onPress={() => agregarNumero(num)}>
              <Text style={styles.textbtn}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn]} onPress={calcularResultado}>
            <Text style={styles.textbtn}>=</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fila}>
          {[1, 2, 3].map(num => (
            <TouchableOpacity key={num} style={[styles.btn]} onPress={() => agregarNumero(num)}>
              <Text style={styles.textbtn}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.btn]} onPress={agregarPunto}>
            <Text style={styles.textbtn}>.</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fila}>
          <TouchableOpacity style={[styles.btn]} onPress={() => agregarNumero(0)}>
            <Text style={styles.textbtn}>0</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#b22222',
    marginBottom: 20,
  },
  displayContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#1e90ff',
    marginBottom: 20,
  },
  displayText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#b22222',
    textAlign: 'right',
  },
  tecladoContainer: {
    width: '100%',
  },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  btn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
  },
  textbtn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});