// DistressInput.js

import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

const DistressInput = ({ onDistressMessageChange }) => {
  const [distressMessage, setDistressMessage] = useState('');

  const handleDistressMessageChange = (text) => {
    setDistressMessage(text);
    onDistressMessageChange(text);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter distress message..."
        value={distressMessage}
        onChangeText={handleDistressMessageChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default DistressInput;
