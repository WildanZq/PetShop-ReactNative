import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/login/AuthNavigator';
import LoginScreen from '../screens/login/LoginScreen';
import DetailBarangScreen from '../screens/barang/DetailBarangScreen';

const AuthStack = createStackNavigator({ SignIn: LoginScreen });
const doNotShowHeaderOption = {
  navigationOptions: {
    header: null,
  },
};

const AppStack = createStackNavigator(
  {
    Main: {
      screen: MainTabNavigator,
      ...doNotShowHeaderOption,
    },
    DetailBarang: DetailBarangScreen
  }
);

export default createAppContainer(createSwitchNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
