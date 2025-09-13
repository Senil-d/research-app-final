import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Header = ({ username, level }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.left}>Welcome, {username}</Text>
      <Text style={styles.right}>Level: {level}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#2196F3',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  left: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  right: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  }
});
