import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Modal } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function QRScannerApp() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text>Cargando</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Permiso de cámara necesario</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Permitir cámara</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
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
            return Linking.openURL(url);
          } else {
            Alert.alert('Error', 'No se puede abrir este enlace');
          }
        })
        .catch(err => {
          Alert.alert('Error', 'Error al abrir el enlace: ' + err.message);
        });
    }
    setModalVisible(false);
    setScannedData(null);
    setTimeout(() => setScanned(false), 1000);
  };

  const copyToClipboard = () => {
    if (scannedData) {
      Alert.alert('Copiado', 'Texto copiado al portapapeles');
    }
    setModalVisible(false);
    setScannedData(null);
    setTimeout(() => setScanned(false), 1000);
  };

  const resetScanner = () => {
    setModalVisible(false);
    setScannedData(null);
    setScanned(false);
  };

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
        <Text style={styles.scanText}>Enfoca el QR</Text>
      </View>
      
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
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={copyToClipboard}
              >
                <Text style={[styles.modalButtonText, styles.secondaryButtonText]}>
                  Copiar Texto
                </Text>
              </TouchableOpacity>
              
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});