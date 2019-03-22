import React from 'react';
import { ScrollView, AsyncStorage, ActivityIndicator } from 'react-native';
import { View, Text } from "native-base";
import NumberFormat from 'react-number-format';

import Colors from '../constants/Colors';
import firebase from "../Firebase";

export default class TransaksiScreen extends React.Component {
  static navigationOptions = {
    title: 'Riwayat Transaksi',
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
    await AsyncStorage.getItem('userToken', (error, result) => {
      if (result) {
        const userRef = firebase.firestore().collection('user').doc(result);

        const transaksi = firebase.firestore().collection('penjualan').where('pembeli', '==', userRef);
        transaksi.onSnapshot(doc => {
          this.setState({ data: [], loading: true });
          doc.docs.map(data => {
            let transaksi = this.state.data;
            let barang = [];
            data.data().barang.map(barangData => {
              barangData.barang.get().then(barangDoc => {
                barang.push({ jumlah: barangData.jumlah, title: barangDoc.data().title, key: barangDoc.id, harga: barangDoc.data().harga });
                transaksi.map((val, index) => {
                  if (val.key === data.id) {
                    transaksi.splice(index, 1);
                  }
                });
                transaksi.push({ ...data.data(), key: data.id, listBarang: barang });
                this.setState({ data: transaksi, loading: false });
              });
            });
          });
        });
      }
    });

    this.setState({ loading: false });
  };

  renderTransaksi = () => {
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
          <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Tidak ada transaksi</Text>
        </View>
      );
    }

    return this.state.data.map(data => {
      if (data.tanggal) {
        const tanggal = new Date(data.tanggal.seconds * 1000);
        const date = tanggal.getDate() + ' ' + (tanggal.getMonth() + 1) + ' ' + tanggal.getFullYear() + ' ' + tanggal.getHours() + ':' + tanggal.getMinutes();
        return (
          <View key={data.key} style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: Colors.divider }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>{date}</Text>
            {this.renderBarang(data.listBarang)}
            <NumberFormat value={data.total} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
              renderText={value => <Text style={{ textAlign: 'right', marginTop: 5, fontWeight: 'bold' }}>Total: {value}</Text>}
            />
          </View>
        );
      }
    });
  };

  renderBarang = barang => {
    return barang.map(data => {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} key={data.key}>
            <Text>{data.jumlah}</Text>
            <Text style={{ flex: 1, marginLeft: 5 }}>{data.title}</Text>
            <NumberFormat value={data.harga * data.jumlah} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
              renderText={value => <Text style={{ textAlign: 'right' }}>{value}</Text>}
            />
          </View>
        );
    });
  }

  render() {
    return (
      <ScrollView style={{ paddingHorizontal: 16 }}>
        {this.renderTransaksi()}
      </ScrollView>
    );
  }
}
