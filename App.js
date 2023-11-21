import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapComponent from './component/MapComponent';

export default function App() {
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);

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

        const data = await response.json();
        console.log(data.message);

        // After sending location, show the map
        setShowMap(true);
      } catch (error) {
        console.error('Error sending location:', error.message);
      }
    } else {
      console.log('Location not available yet');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={sendLocation}>
          <Text style={styles.buttonText}>Send Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setShowMap(!showMap)}>
          <Text style={styles.buttonText}>{showMap ? 'Hide Map' : 'Show Map'}</Text>
        </TouchableOpacity>
      </View>
      {showMap && (
        <View style={styles.mapContainer}>
          <MapComponent />
        </View>
      )}
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
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '50%',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
});
