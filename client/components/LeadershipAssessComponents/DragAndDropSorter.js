// components/DragAndDropSorter.js

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import { MaterialIcons } from '@expo/vector-icons';

export default function DragAndDropSorter({ options = [], onComplete }) {
  const [data, setData] = useState(
    options.map((item, index) => ({
      key: `item-${index}`,
      label: item,
    }))
  );

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    const reordered = data.map((item, index) => index);
    const reorderedLabels = data.map((item) => item.label);
    setSubmitted(true);
    onComplete(reorderedLabels); // pass reordered list back to parent
  };

  const renderItem = ({ item, drag, isActive }) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={submitted}
        style={[
          styles.item,
          isActive && styles.activeItem,
          submitted && styles.disabledItem,
        ]}
      >
        <MaterialIcons
          name="drag-indicator"
          size={20}
          color={isActive ? '#fff' : '#555'}
          style={{ marginRight: 10 }}
        />
        <Text style={[styles.itemText, isActive && { color: '#fff' }]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>Drag to reorder the options</Text>

      <DraggableFlatList
        data={data}
        onDragEnd={({ data }) => setData(data)}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
      />

      {!submitted && (
        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      )}

      {submitted && (
        <Text style={styles.successText}>✅ Answer submitted!</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  activeItem: {
    backgroundColor: '#1A73E8',
  },
  disabledItem: {
    opacity: 0.6,
  },
  itemText: {
    fontSize: 16,
    color: '#222',
  },
  submitBtn: {
    backgroundColor: '#0A2647',
    marginTop: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  successText: {
    marginTop: 12,
    color: 'green',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
