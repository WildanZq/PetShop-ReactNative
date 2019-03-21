import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import TransaksiScreen from '../screens/TransaksiScreen';
import ProfileScreen from '../screens/ProfileScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home-circle${focused ? '' : '-outline'}`
          : 'md-home'
      }
    />
  ),
};

const CartStack = createStackNavigator({
  Cart: CartScreen,
});

CartStack.navigationOptions = {
  tabBarLabel: 'Cart',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-cart' : 'md-cart'}
    />
  ),
};

const TransaksiStack = createStackNavigator({
  Transaksi: TransaksiScreen,
});

TransaksiStack.navigationOptions = {
  tabBarLabel: 'Transaksi',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-card' : 'md-card'}
    />
  ),
};

const ProfileStack = createStackNavigator({
  Profile: ProfileScreen,
});

ProfileStack.navigationOptions = {
  tabBarLabel: 'Account',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  CartStack,
  TransaksiStack,
  ProfileStack,
});
