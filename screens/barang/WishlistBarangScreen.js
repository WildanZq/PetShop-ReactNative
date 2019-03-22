import React from 'react';
import { AsyncStorage, Alert, ScrollView, FlatList } from "react-native";
import {
    View,
    Text,
    Container,
    Header,
    Content,
    Card,
    CardItem,
    Body,
    H3,
    Right,
    Icon,
    Button,
    Item,
    Input,
} from "native-base";
import firebase from "../../Firebase";
import Colors from '../../constants/Colors';
import NumberFormat from 'react-number-format';

export default class WishlistBarangScreen extends React.Component {
    static navigationOptions = {
        title: 'Wislist',
        headerStyle: {
            backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
    };

    constructor() {
        super();
        this.state = {
            isLoading: true,
            getUser: {},
            key: '',
            wishlist: []
        };

        this.unsubscribe = null;
    }

    onCollectionUpdate = querySnapshot => {
        const wishlist = [];

        querySnapshot.forEach(doc => {
            let newItem = doc.data();
            newItem.id = doc.id;
            console.log(newItem.id)
            console.log("awe" + newItem.barang[0].nama)

            for(let i=0; i < newItem.barang.length; i++) {
                let { nama } = newItem.barang[i];
                console.log(nama);

                wishlist.push({
                    key: i,
                    nama
                });

                this.setState({
                    wishlist: wishlist
                })
            }
        });
    };

    _showData = async () =>  {
        await AsyncStorage.getItem('userToken', (error, result) => {
            if (result) {
            const userRef = firebase.firestore().collection('user').doc(result);

            this.dataNya = firebase.firestore().collection('wishlist').where('user', '==', userRef);
            this.unsubscribe = this.dataNya.onSnapshot(this.onCollectionUpdate);

            const ref = firebase.firestore().collection('user').doc(result);

                this.setState({
                    key: result,
                    isLoading: false,
                });
            }
            else {
                this.setState({
                    isLoading: false,
                });
            }
        });
    };

    componentDidMount() {
        this._showData();
    }

    _doTransaksi = () => {
        this.ref = firebase.firestore().collection('wishlist');
        
        this.ref.add({
            pembeli: firebase.firestore().doc(`/user/${this.state.token}`),
            barang: firebase.firestore().doc(`/boards/${this.state.key}`),
            tanggal: firebase.firestore.FieldValue.serverTimestamp(),
            total: `${this.state.getBarang.harga}`,
        })
        .catch((error) => {
            console.error("Error adding user: ", error);
        });

        Alert.alert('', 'Pembelian Berhasil Dilakukan!');
        this.props.navigation.navigate("Main");
    }

    render() {
        return ( 
            <ScrollView>
                <View>
                <FlatList
                    data={this.state.wishlist}
                    keyExtractor = { (item, index) => index.toString() }
                    renderItem={({ item }) => (
                    <Text>{ item.key }</Text>
                    )}
                />
                </View>
            </ScrollView>
        );
    }
}
