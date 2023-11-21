import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const sendLocation = async () => {
    if (location) {
      const { latitude, longitude } = location.coords;
      
      try {
        const response = await fetch('http://192.168.254.113:3000/api/send-location', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ latitude, longitude }),
        });

        if (!response.ok) {
          throw new Error('Network request failed');
        }
      
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error sending location:', error.message);
      }
    } else {
      console.log('Location not available yet');
    }
  };  

  return (
    <View style={styles.container}>
      <Text>Disaster Location App</Text>
      {location && (
        <Text>
          Latitude: {location.coords.latitude}, Longitude: {location.coords.longitude}
        </Text>
      )}
      <Button title="Send Location" onPress={sendLocation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
