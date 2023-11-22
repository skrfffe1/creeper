import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated } from 'react-native';
import * as Location from 'expo-location';
import MapComponent from './component/MapComponent';
import DistressInput from './component/DistressInput';

export default function App() {
  const [location, setLocation] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [toastText, setToastText] = useState('');
  const [distressMessage, setDistressMessage] = useState('');

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
          body: JSON.stringify({ latitude, longitude, message: distressMessage }),
        });

        const data = await response.json();
        console.log(data.message);

         // Set the toast text
         setToastText(`Latitude: ${latitude}, Longitude: ${longitude}`);

        // After sending location, show the map
        setShowMap(true);
      } catch (error) {
        console.error('Error sending location and distress message:', error.message);
      }
    } else {
      console.log('Location not available yet');
    }
  };

  const handleDistressMessageChange = (message) => {
    setDistressMessage(message);
  };

  const fadeIn = new Animated.Value(0);

  const showToast = () => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        hideToast();
      }, 2000);
    });
  };

  const hideToast = (callback) => {
    Animated.timing(fadeIn, {
      toValue: 0,
      duration: 500,
      useNativeDriver: false,
    }).start(() => {
      if(callback) {
        callback();
      }
    });
  };

  return (
    <>
      <View style={styles.container}>
      <View style={styles.buttonContainer}>
      {!showMap ? (
        <>
          <DistressInput onDistressMessageChange={handleDistressMessageChange} />
          <TouchableOpacity style={styles.button} onPress={() => {
            sendLocation();
            hideToast();
          }}>
          <Text style={styles.buttonText}>Send Location</Text>
          </TouchableOpacity>
        </>
      ) : (
       <Text></Text>
      )}
        <TouchableOpacity style={styles.button} onPress={() => setShowMap(!showMap)}>
          <Text style={styles.buttonText}>{showMap ? 'Hide Map' : 'Show Map'}</Text>
        </TouchableOpacity>
      </View>
      {showMap && (
        <View style={styles.mapContainer}>
          <MapComponent />
        </View>
      )}
      <Animated.View style={[styles.toast, { opacity: fadeIn }]}>
        <Text style={styles.toastText}>{toastText}</Text>
      </Animated.View>
    </View>
    </>
    
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
    height: '25%',
  },
  button: {
    backgroundColor: '#1E293B',
    padding: 15,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'whitesmoke',
    fontWeight: 'bold',
    fontSize: 18,
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  toast: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
  },
});
