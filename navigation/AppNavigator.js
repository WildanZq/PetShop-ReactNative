import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthLoadingScreen from '../screens/login/AuthNavigator';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';

const AuthStack = createStackNavigator({SignIn: LoginScreen});

export default createAppContainer(createSwitchNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    AuthLoading: AuthLoadingScreen,
    App: MainTabNavigator,
    Auth: AuthStack,
    SignUp: SignupScreen,
  },
  {
    initialRouteName: 'AuthLoading',
  }
));
