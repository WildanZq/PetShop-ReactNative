import React from 'react';
import {AsyncStorage} from "react-native";
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

  constructor() {
    super();
    this.state = {
      idDocument: '',
      token: '',
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const boardKey = params ? params.boardKey: null;

    this.setState({
      idDocument: `${JSON.parse(boardKey)}`,
    });

    AsyncStorage.getItem('userToken', (error, result) => {
        if (result) {
          this.setState({
            token: result,
          });
        }
    });
  }

  _doSignIn = () => {
      return (
        <Button warning onPress={() => this.props.navigation.navigate('SignIn')}>
            <Text>Login Terlebih Dahulu</Text>
        </Button>
      )
  }
  _doPayment = () => {
      return (
        <Button success onPress={() => this.props.navigation.goBack()}>
            <Text>Beli Barang {this.state.idDocument}</Text>
        </Button>
      )
  }

  render() {
    return (
        <View>
          <Text>{this.state.idDocument}{"\n\n\n"} </Text>

          {this.state.token ? (
            this._doPayment()
            ): (
            this._doSignIn()
          )}
        </View>
    );
  }
}
