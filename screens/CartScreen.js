import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, ActivityIndicator, Image, Alert } from 'react-native';
import { View, Text, Icon, Button } from 'native-base';
import NumberFormat from 'react-number-format';

import Colors from '../constants/Colors';
import firebase from '../Firebase';

export default class CartScreen extends React.Component {
  state = {};
  static navigationOptions = {
    title: 'Keranjang',
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTintColor: '#fff'
  };

  constructor() {
    super();
    this.state = {
      loading: false,
      data: []
    };
  }

  componentDidMount() {
    this.getData();
    setInterval(this.getData, 3000);
  }

  getData = async () => {
    if (this.state.loading) return;

    const cart = JSON.parse(await AsyncStorage.getItem('cart'));

    if (! cart) {
      this.setState({ loading: false, data: [] });
      return;
    }

    const data = [];
    cart.map(async value => {
      const ref = await firebase.firestore().collection('boards').doc(value.id);
      ref.get().then((doc) => {
        if (doc.exists) {
          const item = {...doc.data(), jumlah: value.jumlah, key: doc.id};
          let newData = data;
          let match = false;
          this.state.data.map(val => {
            if (JSON.stringify(item) === JSON.stringify(val)) {
              match = true;
            }
          });
          newData.push(item);
          if (!match)
            this.setState({ data: newData });
        }
      });
    });
    
    this.setState({ loading: false });
  };

  renderCart = () => {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (this.state.data.length === 0) {
      return (
        <View style={{ marginTop: 42 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Keranjang kosong</Text>
        </View>
      );
    }

    return this.state.data.map(data => {
      return (
        <View style={{ borderWidth: 1, borderColor: Colors.divider, marginVertical: 5 }} key={data.key}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={data.image ? { uri: data.image } : require('../assets/images/no_img.jpeg')}
              style={{ height: 100, width: 100 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
              <NumberFormat value={data.harga * data.jumlah} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
                renderText={value => <Text>{value}</Text>}
              />
              <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
                <Button onPress={() => this.subtractItemQty(data.key)} warning style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>-</Text>
                </Button>
                <Text style={{ marginHorizontal: 8 }}>{data.jumlah}</Text>
                <Button onPress={() => this.addItemQty(data.key)} success style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>+</Text>
                </Button>
                <View style={{ marginLeft: 10 }}></View>
                <Button onPress={() => this.removeItem(data.key)} danger style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>x</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  subtractItemQty = async (key) => {
    let data = this.state.data;
    data.map((val) => {
      if (val.key === key) {
        if (val.jumlah === 1) return;
        val.jumlah--;
      }
    });
    this.setState({ data: data });

    let dataStorage = JSON.parse(await AsyncStorage.getItem('cart'));
    dataStorage.map((val) => {
      if (val.id === key) {
        if (val.jumlah === 1) return;
        val.jumlah--;
      }
    });
    AsyncStorage.setItem('cart', JSON.stringify(dataStorage));
  };

  addItemQty = async (key) => {
    let data = this.state.data;
    data.map((val) => {
      if (val.key === key) {
        val.jumlah++;
      }
    });
    this.setState({ data: data });

    let dataStorage = JSON.parse(await AsyncStorage.getItem('cart'));
    dataStorage.map((val) => {
      if (val.id === key) {
        val.jumlah++;
      }
    });
    AsyncStorage.setItem('cart', JSON.stringify(dataStorage));
  };

  removeItem = async (key) => {
    let data = this.state.data;
    data.map((val, index) => {
      if (val.key === key) {
        data.splice(index, 1);
      }
    });
    this.setState({ data: data });

    let dataStorage = JSON.parse(await AsyncStorage.getItem('cart'));
    dataStorage.map((val, index) => {
      if (val.id === key) {
        dataStorage.splice(index, 1);
      }
    });
    AsyncStorage.setItem('cart', JSON.stringify(dataStorage));
  }

  renderTotal = () => {
    if (!this.state.loading) {
      let total = 0;
      this.state.data.map((data) => {
        total += data.harga * data.jumlah;
      });
      return (
        <NumberFormat value={total} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
          renderText={value => <Text style={{ fontWeight: 'bold' }}>{value}</Text>}
        />
      );
    }
  };

  _doPayment = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (! token) {
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
      if (! await AsyncStorage.getItem('cart')) return;
      this.props.navigation.navigate("PesanBarang", {
        barang: JSON.parse(await AsyncStorage.getItem('cart')),
        eraseCart: true
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ paddingHorizontal: 16 }}>
          {this.renderCart()}
        </ScrollView>
        <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: Colors.divider }}>
          <View style={{ display: 'flex' }}>
            <Text>Total</Text>
            <Text>{this.renderTotal()}</Text>
          </View>
          <View style={{ marginTop: 6, flexDirection: 'row' }}>
            <Button style={{ height: 30, marginRight: 8 }} onPress={this.getData}>
              <Icon
                name='md-refresh'
                size={30}
                style={{ color: '#fff', marginHorizontal: 16 }}
              />
            </Button>
            <Button onPress={this._doPayment} style={{ backgroundColor: Colors.primary, height: 30 }}>
              <Text style={{ color: '#fff' }}>Bayar</Text>
            </Button>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cartItemBtn: {
    height: 26,
    width: 26,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center'
  }
});
