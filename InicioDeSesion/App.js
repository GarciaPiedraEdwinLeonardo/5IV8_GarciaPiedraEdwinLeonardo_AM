import React, { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert} from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function App() {

  const[usuario, setUsuario] = useState("");
  const[pass, setPass] = useState("");
  const[imageUrl,setImageUrl] = useState(null);
  const[loggedIn, setLoggedIn] = useState(false);

  const validarLogin = () => {

    const validUser = "admin";
    const validPass = "1234";
    
    if(usuario === validUser && pass === validPass){
      Alert.alert("Inicio de sesion exitoso");
      setLoggedIn(true);
    } else{
      Alert.alert("Usuario o contraseña incorrectos, intenta de nuevo");
    }

  };

  const cambiarImagen = async() =>{

    const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if(status !== "granted"){
      Alert.alert("Permiso denegado, se necesita acceso a las imagenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if(!result.canceled){
      setImageUrl(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Iniciar Sesion</Text>
          <TextInput placeholder='Usuario' value={usuario} onChangeText={setUsuario} style={styles.input}></TextInput>
          <TextInput placeholder='contraseña' value={pass} onChangeText={setPass} secureTextEntry style={styles.input}></TextInput>
          <TouchableOpacity onPress={validarLogin} style={styles.button}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      ):(
        <View>
          <Text style={styles.welcomeText}>Bienvenido {usuario}</Text>
          <TouchableOpacity onPress={cambiarImagen}>
            <Image 
              source={{ uri: imageUrl || 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Toca la imagen para cambiarla</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
  },
  profileContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
    },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 20,
    borderRadius: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AAA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#007AAA',
  },
  changePhotoText: {
    marginTop: 15,
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
});
