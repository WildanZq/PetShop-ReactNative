import React from 'react';
import { createAppContainer, createSwitchNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import LoginScreen from '../screens/login/LoginScreen';
import SignupScreen from '../screens/login/SignupScreen';
import DetailBarangScreen from '../screens/barang/DetailBarangScreen';
import PesanBarangScreen from '../screens/barang/PesanBarangScreen';
import KategoriBarangScreen from '../screens/barang/KategoriBarangScreen';
import WishlistBarangScreen from '../screens/barang/WishlistBarangScreen';
import AddProductScreen from '../screens/AddProductScreen';
import TransaksiScreen from '../screens/TransaksiScreen';

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
    SignIn: LoginScreen,
    SignUp: SignupScreen,
    DetailBarang: DetailBarangScreen,
    PesanBarang: PesanBarangScreen,
    AddProduct: AddProductScreen,
    KategoriBarang: KategoriBarangScreen,
    Transaksi: TransaksiScreen,
    WishlistBarang: WishlistBarangScreen

  }
);

export default createAppContainer(createSwitchNavigator(
  {
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    App: AppStack,
  },
  {
    initialRouteName: 'App',
  }
));
