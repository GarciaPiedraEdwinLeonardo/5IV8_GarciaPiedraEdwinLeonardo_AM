import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Keyboard } from 'react-native';

export default function App() {
  const [peso, setPeso] = useState("");
  const [estatura, setEstatura] = useState("");
  const [resultado, setResultado] = useState("");

  const calcularIMC = () => {
    Keyboard.dismiss();
    
    if (!peso || !estatura) {
      setResultado("Ingresa peso y estatura");
      return;
    }

    const pesoNum = parseFloat(peso);
    const estaturaNum = parseFloat(estatura);

    if (isNaN(pesoNum) || isNaN(estaturaNum)) {
      setResultado("Valores inválidos");
      return;
    }

    const imc = (pesoNum / (estaturaNum ** 2)).toFixed(1);
    
    let clasif = "";
    if (imc < 18.5 && imc > 0) clasif = "Bajo peso";
    else if (imc < 25) clasif = "Normal";
    else if (imc < 30) clasif = "Sobrepeso";
    else if(imc > 30 && imc<50) clasif= "Obesidad";
    else if (imc.isNaN || !imc.isFinite) clasif="No se puede dividir entre cero";
    else clasif="No se admiten negativos";

    setResultado(`IMC: ${imc} - ${clasif}`);
  }

  const borrar = () => {
    setPeso("");
    setEstatura("");
    setResultado("");
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calculadora IMC</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Peso (kg)" 
        value={peso} 
        onChangeText={setPeso}
        keyboardType="numeric"
      />

      <TextInput 
        style={styles.input} 
        placeholder="Estatura (m)" 
        value={estatura} 
        onChangeText={setEstatura}
        keyboardType="numeric"
      />
      
      <View style={styles.botones}>
        <TouchableOpacity style={styles.btnCalcular} onPress={calcularIMC}>
          <Text style={styles.btnTexto}>Calcular</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnBorrar} onPress={borrar}>
          <Text style={styles.btnTexto}>Borrar</Text>
        </TouchableOpacity>
      </View>

      {resultado ? <Text style={styles.resultado}>{resultado}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderColor: '#21aaf3',
    borderWidth: 2,
    marginBottom: 15,
    fontSize: 16,
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  btnCalcular: {
    backgroundColor: '#21aaF3',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
  },
  btnBorrar: {
    backgroundColor: '#21aaF3',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
  },
  btnTexto: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultado: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    color: '#333',
  },
});