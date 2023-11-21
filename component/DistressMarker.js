// DistressMarker.js

import React from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, Text } from 'react-native';

const DistressMarker = ({ coordinate, message }) => {
  return (
    <Marker coordinate={coordinate}>
      <Callout>
        <View>
          <Text>{message}</Text>
        </View>
      </Callout>
    </Marker>
  );
};

export default DistressMarker;
