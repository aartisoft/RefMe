import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Platform } from 'react-native';

import MainTabNavigator from './MainTabNavigator';

export default createAppContainer(
  createSwitchNavigator({
    Main: MainTabNavigator,
  })
);
