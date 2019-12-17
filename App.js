
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

import AppContainer from './navigation/AppNavigator';

const App: () => React$Node = () => {

  const store = createStore(rootReducer)
  
  return (
    <Provider store={store}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
      <AppContainer />
    </Provider>
  );

}

export default App;