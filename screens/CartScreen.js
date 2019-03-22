import React from 'react';
import { ScrollView, StyleSheet, AsyncStorage, ActivityIndicator } from 'react-native';
import { View, Text, Icon, Button } from 'native-base';

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
      loading: true,
      data: []
    };
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    this.setState({ loading: true, data: [] });
    const cart = JSON.parse(await AsyncStorage.getItem('cart'));

    cart.map(async value => {
      const ref = await firebase.firestore().collection('boards').doc(value.id);
      ref.get().then((doc) => {
        if (doc.exists) {
          const item = {...doc.data(), jumlah: value.jumlah, key: doc.id};
          let newData = this.state.data;
          newData.push(item);
          this.setState({ data: newData });
        }
      });

      this.setState({ loading: false });
    });
  };

  renderCart = () => {
    if (this.state.loading) {
      return (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }

    if (! this.state.data) {
      return (
        <VIew>
          <Text>Keranjang kosong</Text>
        </VIew>
      );
    }

    return this.state.data.map(data => {
      return (
        <View key={data.key}>
          <Text>{data.title}</Text>
          <Text>{data.jumlah}</Text>
        </View>
      );
    });
  };

  render() {
    return (
      <ScrollView style={styles.container}>
        <Button onPress={this.getData}>
          <Icon
            name='md-refresh'
            size={50}
            style={{ color: '#fff', marginHorizontal: 16 }}
          />
        </Button>
        {this.renderCart()}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
