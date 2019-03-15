// import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const HeaderCustom = ({ title, subTitle}) => {
  return (
    <View>
      <Text>{title}</Text>
      <Text>{subTitle}</Text>
    </View>
  );
};

//make this component available to the app
export default HeaderCustom;
