// components/QuitConfirmationModal.js

import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QuitConfirmationModal({ visible, onCancel, onConfirm }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <MaterialIcons name="warning" size={40} color="#FFA500" style={styles.icon} />
          <Text style={styles.title}>Quit Quiz?</Text>
          <Text style={styles.message}>
            Your progress will be lost. Are you sure you want to quit?
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
              <Text style={styles.confirmText}>Quit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 8,
  },
  icon: {
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  message: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
