import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

export default function LiveStreamScreen() {
  return (
    <View style={styles.container}>
      <Video
        source={{ uri: 'http://192.168.100.79:5000/stream/live/stream.m3u8' }}
        controls
        resizeMode="contain"
        style={styles.video}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
});
