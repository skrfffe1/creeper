import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

const MapComponent = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Fetch locations from the server
    const fetchData = async () => {
      try {
        const response = await fetch('http://192.168.254.113:3000/api/get-locations');
        const data = await response.json();
        setLocations(data.locations);
      } catch (error) {
        console.error('Error fetching locations:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{ 
        latitude: 11.219115930422078,
        longitude: 124.99908929956703, 
        latitudeDelta: 0.09, 
        longitudeDelta: 0.09 }}>

        {locations.map((location, index) => (
          <Marker key={index} coordinate={{ latitude: location.latitude, longitude: location.longitude }} title={`Location ${index + 1}`} />
        ))}

      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapComponent;
