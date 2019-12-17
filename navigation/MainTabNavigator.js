import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import DocumentsScreen from '../screens/DocumentsScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import ReferencesScreen from '../screens/ReferencesScreen';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const DocumentsStack = createStackNavigator(
  {
    Docs: DocumentsScreen,
    Articles: ArticlesScreen
  },
  config
);

DocumentsStack.navigationOptions = {
  tabBarLabel: 'Papers',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios' ? `ios-paper` : 'md-paper'
      }
    />
  ),
};

DocumentsStack.path = '';

const ReferencesStack = createStackNavigator(
  {
    Refs: ReferencesScreen,
  },
  config
);

ReferencesStack.navigationOptions = {
  tabBarLabel: 'Refs',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-book' : 'md-book'} />
  ),
};

ReferencesStack.path = '';

const tabNavigator = createBottomTabNavigator({
  DocumentsStack: {screen: DocumentsStack},
  ReferencesStack: {screen: ReferencesStack}
});

tabNavigator.path = '';

export default tabNavigator;
