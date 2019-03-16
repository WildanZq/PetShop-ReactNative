import React from 'react';
import { AsyncStorage, Alert } from "react-native";
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
import firebase from "../../Firebase";

export default class DetailBarangScreen extends React.Component {
  static navigationOptions = {
    title: 'Detail Barang',
  };

  constructor() {
    super();
    this.state = {
      idDocument: '',
      token: '',
      getBarang: {},
      key: '',
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const boardKey = params ? params.boardKey : null;

    const ref = firebase.firestore().collection('boards').doc(`${JSON.parse(boardKey)}`);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          getBarang: doc.data(),
          key: doc.id,
          isLoading: false,
        });
      } else {
        console.log("No such document!");
      }
    });

    AsyncStorage.getItem('userToken', (error, result) => {
      if (result) {
        this.setState({
          token: result,
        });
      }
    });
  }

  _doPayment() {
    if (this.state.token == '') {
      Alert.alert(
        'Gagal',
        'Silakan Login Terlebih Dahulu',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => this.props.navigation.navigate("SignIn") },
        ],
        { cancelable: false }
      );
    }
    else {
      this.props.navigation.navigate("PesanBarang", {
        key: this.props.navigation.state.key,
        boardKey: this.state.key
      })
    }
  }

  render() {
    return (
      <View>
        <Text>{this.state.key}{"\n\n\n"} </Text>
        <Text>{this.state.getBarang.title}{"\n\n\n"} </Text>
        <Text>{this.state.getBarang.kategori}{"\n\n\n"} </Text>
        <Text>{this.state.getBarang.harga}{"\n\n\n"} </Text>

        <Button success
          onPress={() => this._doPayment()}>
          <Text>Beli Barang {this.state.idDocument}</Text>
        </Button>
      </View>
    );
  }
}