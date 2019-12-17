
import React, { useState } from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';

import { Provider } from 'react-redux'
import { createStore } from 'redux'
import rootReducer from './reducers'

import AppNavigator from './navigation/AppNavigator';

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  const store = createStore(rootReducer)

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <>
      </>
    );
  } else {
    return (
      <Provider store={store}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </Provider>
    );
  }
}

function handleLoadingError(error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
