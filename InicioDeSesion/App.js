import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Alert, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const validarLogin = () => {
    const validUser = "admin";
    const validPass = "1234";
    
    if (usuario === validUser && pass === validPass) {
      Alert.alert("Inicio de sesión exitoso");
      setLoggedIn(true);
    } else {
      Alert.alert("Usuario o contraseña incorrectos, intenta de nuevo");
    }
  };

  const cambiarImagen = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permiso denegado, se necesita acceso a las imágenes");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const abrirCamara = () => {
    setShowCamera(true);
  };

  const tomarFoto = async () => {
    if (cameraRef.current) {
      const result = await cameraRef.current.takePictureAsync();
      setPhoto(result.uri);
      setImageUrl(result.uri); 
    }
  };

  const tomarOtraFoto = () => {
    setPhoto(null);
  };

  const cerrarCamara = () => {
    setShowCamera(false);
    setPhoto(null);
  };

  const cerrarSesion = () => {
    setLoggedIn(false);
    setUsuario("");
    setPass("");
    setImageUrl(null);
    setShowCamera(false);
    setPhoto(null);
  };

  if (!permission) return <View />;

  if (!permission.granted && showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitas permitir acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestPermission} />
        <Button title="Cancelar" onPress={cerrarCamara} color="#666" />
      </View>
    );
  }

  if (showCamera) {
    return (
      <View style={{ flex: 1 }}>
        {!photo ? (
          <>
            <CameraView ref={cameraRef} style={{ flex: 1 }} />
            <View style={styles.cameraButtons}>
              <Button title="Tomar foto" onPress={tomarFoto} />
              <Button title="Cancelar" onPress={cerrarCamara} color="#666" />
            </View>
          </>
        ) : (
          <>
            <Image source={{ uri: photo }} style={{ flex: 1 }} />
            <View style={styles.cameraButtons}>
              <Button title="Usar esta foto" onPress={cerrarCamara} />
              <Button title="Tomar otra" onPress={tomarOtraFoto} />
            </View>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!loggedIn ? (
        <View style={styles.loginContainer}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <TextInput 
            placeholder='Usuario' 
            value={usuario} 
            onChangeText={setUsuario} 
            style={styles.input}
          />
          <TextInput 
            placeholder='Contraseña' 
            value={pass} 
            onChangeText={setPass} 
            secureTextEntry 
            style={styles.input}
          />
          <TouchableOpacity onPress={validarLogin} style={styles.button}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.profileContainer}>
          <Text style={styles.welcomeText}>Bienvenido {usuario}</Text>
          
          <TouchableOpacity onPress={cambiarImagen}>
            <Image 
              source={{ uri: imageUrl || 'https://static.vecteezy.com/system/resources/previews/005/005/840/non_2x/user-icon-in-trendy-flat-style-isolated-on-grey-background-user-symbol-for-your-web-site-design-logo-app-ui-illustration-eps10-free-vector.jpg' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
          
          <Text style={styles.changePhotoText}>Toca la imagen para cambiarla</Text>
          
          <View style={styles.photoButtons}>
            <TouchableOpacity onPress={abrirCamara} style={styles.cameraButton}>
              <Text style={styles.buttonText}>Abrir Cámara</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={cerrarSesion} style={styles.logoutButton}>
              <Text style={styles.buttonText}>Cerrar Sesión</Text>
            </TouchableOpacity>
          </View>
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
  cameraButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
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
    marginBottom: 20,
  },
  photoButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  cameraButtons: {
    padding: 20,
    gap: 10,
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
});