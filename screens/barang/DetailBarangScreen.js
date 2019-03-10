import React from 'react';
import {
  View,
  Text,
  Card,
  CardItem,
  Icon,
  Button,
  Item,
  Input,
} from "native-base";
import { ExpoConfigView } from '@expo/samples';

export default class DetailBarangScreen extends React.Component {
  static navigationOptions = {
    title: 'Detail Barang',
  };

  render() {
    const { params } = this.props.navigation.state;
    const boardKey = params ? params.boardKey: null;

    return (
        <Button onPress={() => this.props.navigation.goBack()}><Text>{JSON.parse(boardKey)}</Text></Button>
    );
  }
}
