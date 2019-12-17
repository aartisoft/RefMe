
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

import AppNavigator from './navigation/AppNavigator';

import { Text } from 'native-base';

export default function App(props) {

  const store = createStore(rootReducer)
  
  return (
    <Provider store={store}>
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <AppNavigator />
      </View>
    </Provider>
  );

}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseText: {
    color: '#000'
  },
});