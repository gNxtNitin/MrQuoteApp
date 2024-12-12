import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

type DrawingControlsProps = {
  onAddLabel: () => void;
  onEraser: () => void;
  onFreeForm: () => void;
  onLineStraight: () => void;
  onClear: () => void;
  onRemoveLabel: () => void;
};

export const DrawingControls: React.FC<DrawingControlsProps> = ({
  onAddLabel,
  onEraser,
  onFreeForm,
  onLineStraight,
  onClear,
  onRemoveLabel,
}) => {
  return (
    <>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onAddLabel}>
          <Text style={styles.buttonText}>Add Label</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onEraser}>
          <Text style={styles.buttonText}>Eraser</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onFreeForm}>
          <Text style={styles.buttonText}>Free Form</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onLineStraight}>
          <Text style={styles.buttonText}>Line Straight</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearButton} onPress={onRemoveLabel}>
          <Text style={styles.clearButtonText}>Remove Label</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: { flexDirection: 'row', marginTop: 10 },
  button: { marginHorizontal: 5, backgroundColor: 'grey', padding: 10, borderRadius: 5 },
  buttonText: { color: 'white', fontWeight: 'bold' },
  clearButton: { margin: 10, backgroundColor: 'black', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  clearButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
}); 