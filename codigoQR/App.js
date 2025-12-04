import React, { useState, useRef } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  Image, StyleSheet, Alert, Button,
  Linking, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  // Estados para login y perfil
  const [usuario, setUsuario] = useState("");
  const [pass, setPass] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  
  // Estados para la cámara de fotos
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  
  // Estados para el escáner QR
  const [qrScannerVisible, setQrScannerVisible] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrPermission, requestQrPermission] = useCameraPermissions();

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
      Alert.alert("Permiso denegado", "Se necesita acceso a las imágenes");
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
      setShowCamera(false);
    }
  };

  const tomarOtraFoto = () => {
    setPhoto(null);
  };

  const cerrarCamara = () => {
    setShowCamera(false);
    setPhoto(null);
  };

  const abrirQRScanner = () => {
    setQrScannerVisible(true);
  };

  const cerrarQRScanner = () => {
    setQrScannerVisible(false);
    setScanned(false);
    setScannedData(null);
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    setModalVisible(true);
  };

  const openLink = () => {
    if (scannedData) {
      const url = scannedData.startsWith('http') 
        ? scannedData 
        : `http://${scannedData}`;
      
      Linking.canOpenURL(url)
        .then(supported => {
          if (supported) {
            Linking.openURL(url);
          } else {
            Alert.alert('Error', 'No se puede abrir este enlace');
          }
        })
        .catch(err => {
          Alert.alert('Error', 'Error al abrir el enlace');
        });
    }
    setModalVisible(false);
    setScannedData(null);
    setScanned(false);
  };

  const resetScanner = () => {
    setModalVisible(false);
    setScannedData(null);
    setScanned(false);
  };

  const cerrarSesion = () => {
    setLoggedIn(false);
    setUsuario("");
    setPass("");
    setImageUrl(null);
    setShowCamera(false);
    setPhoto(null);
    setQrScannerVisible(false);
    setScannedData(null);
    setModalVisible(false);
  };

  // Pantalla de permisos de cámara para foto
  if (!cameraPermission && showCamera) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Necesitas permitir acceso a la cámara</Text>
        <Button title="Dar permiso" onPress={requestCameraPermission} />
        <Button title="Cancelar" onPress={cerrarCamara} color="#666" />
      </View>
    );
  }

  // Pantalla de cámara para tomar foto
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

  // Pantalla de escáner QR
  if (qrScannerVisible) {
    // Verificar permisos para QR
    if (!qrPermission) {
      return (
        <View style={styles.container}>
          <Text>Cargando permisos...</Text>
        </View>
      );
    }

    if (!qrPermission.granted) {
      return (
        <View style={styles.container}>
          <Text style={styles.permissionText}>Permiso de cámara necesario para escanear QR</Text>
          <Button title="Permitir cámara" onPress={requestQrPermission} />
          <Button title="Volver" onPress={cerrarQRScanner} color="#666" />
        </View>
      );
    }

    return (
      <View style={{ flex: 1 }}>
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "pdf417", "ean13"]
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />
        
        <View style={styles.overlay}>
          <View style={styles.scanFrame} />
          <Text style={styles.scanText}>Enfoca el código QR</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.backButton}
          onPress={cerrarQRScanner}
        >
          <Text style={styles.backButtonText}>← Volver</Text>
        </TouchableOpacity>
        
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>QR Escaneado</Text>
              
              <View style={styles.dataContainer}>
                <Text style={styles.dataLabel}>Contenido:</Text>
                <Text style={styles.dataText} numberOfLines={3}>
                  {scannedData}
                </Text>
              </View>

              <View style={styles.buttonContainer}>
                {scannedData && (scannedData.includes('http') || scannedData.includes('://') || scannedData.includes('.')) && (
                  <TouchableOpacity 
                    style={[styles.modalButton, styles.primaryButton]}
                    onPress={openLink}
                  >
                    <Text style={styles.modalButtonText}>Abrir Enlace</Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={resetScanner}
                >
                  <Text style={styles.modalButtonText}>Escanear Otro</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  // Pantalla principal (login o perfil)
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
            <TouchableOpacity onPress={abrirCamara} style={[styles.actionButton, styles.cameraButton]}>
              <Text style={styles.buttonText}>Abrir Cámara</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={abrirQRScanner} style={[styles.actionButton, styles.qrButton]}>
              <Text style={styles.buttonText}>Escanear QR</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity onPress={cerrarSesion} style={[styles.actionButton, styles.logoutButton]}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  actionButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  cameraButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginHorizontal: 5,
  },
  qrButton: {
    backgroundColor: '#17a2b8',
    flex: 1,
    marginHorizontal: 5,
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    width: '100%',
    marginTop: 20,
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  // Estilos para el escáner QR
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  scanText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  dataContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    marginBottom: 25,
  },
  dataLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  dataText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
  },
  modalButton: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cancelButton: {
    backgroundColor: '#ff3b30',
  },
  backButtonQR: {
    backgroundColor: '#6c757d',
    marginTop: 5,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#333',
  },
});