import React from 'react';
import {SafeAreaView, StyleSheet, Text} from 'react-native';

const Loader = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
});
export default Loader;
