import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import ComponentTabBar from './ComponentTabBar';

export default function TabBar() {
  return (
    <View style={styles.container}>
      <ComponentTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ea3345',
    justifyContent: 'flex-end',
  },
});
