import React from 'react';
import { AsyncStorage, Alert, ScrollView, ActivityIndicator } from "react-native";
import { View, Text, Button } from "native-base";
import firebase from "../../Firebase";
import Colors from '../../constants/Colors';
import NumberFormat from 'react-number-format';

export default class PesanBarangScreen extends React.Component {
    static navigationOptions = {
        title: 'Checkout',
        headerStyle: {
            backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
    };

    constructor() {
        super();
        this.state = {
            token: '',
            data: [],
            total: 0,
            loading: true
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const barang = params.barang;

        barang.map(data => {
            const ref = firebase.firestore().collection('boards').doc(data.id);
            ref.get().then((doc) => {
                if (doc.exists) {
                    let newData = this.state.data;
                    newData.push({ ...doc.data(), key: doc.id, jumlah: data.jumlah });
                    this.setState({
                        data: newData,
                        total: this.state.total + (doc.data().harga*data.jumlah),
                        loading: false
                    });
                }
            });
        });

        AsyncStorage.getItem('userToken', (error, result) => {
            if (result) {
                this.setState({ token: result });
            }
        });
    }

    _doTransaksi = () => {
        if (this.state.loading) return;

        this.ref = firebase.firestore().collection('penjualan');

        let barang = [];
        this.state.data.map(val => {
            barang.push(firebase.firestore().doc(`/boards/${val.key}`));
        });
        
        this.ref.add({
            pembeli: firebase.firestore().doc(`/user/${this.state.token}`),
            barang: barang,
            tanggal: firebase.firestore.FieldValue.serverTimestamp(),
            total: `${this.state.total}`,
        })
        .catch((error) => {
            console.error("Error adding user: ", error);
        });

        Alert.alert('', 'Pembelian Berhasil');
        this.props.navigation.navigate('Transaksi');
    }

    renderBarang = () => {
        if (this.state.loading) {
            return (
                <View style={{ marginTop: 60 }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            );
        }

        return this.state.data.map(data => {
            return (
                <View key={data.key} style={{ borderBottomWidth: 1, borderColor: Colors.divider, paddingVertical: 5, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View>
                        <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
                        <Text>Jumlah: {data.jumlah}</Text>
                    </View>
                    <NumberFormat value={data.harga * data.jumlah} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
                        renderText={value => <Text>{value}</Text>}
                    />
                </View>
            );
        });
    };

    render() {
        return ( 
            <View style={{ flex: 1 }}>
                <ScrollView style={{ paddingHorizontal: 16 }}>
                    {this.renderBarang()}
                </ScrollView>
                <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: Colors.divider }}>
                    <View style={{ display: 'flex' }}>
                        <Text>Total</Text>
                        <NumberFormat value={this.state.total} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
                            renderText={value => <Text style={{ fontWeight: 'bold' }}>{value}</Text>}
                        />
                    </View>
                    <Button onPress={this._doTransaksi} style={{ marginTop: 6, backgroundColor: Colors.primary, height: 30 }}><Text style={{ color: '#fff' }}>KONFIRMASI</Text></Button>
                </View>
            </View>
        );
    }
}
