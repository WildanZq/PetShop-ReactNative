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

            for(let i=0; i < newItem.barang.length; i++) {
                newItem.barang[i].barangData.get()
                .then(res => {
                        const { title, image, kategori, harga } = res.data();
                        newItem.barangData = res.data();
                        
                        wishlist.push({
                            key: res.id,
                            title,
                            image, 
                            kategori, 
                            harga
                        });
                        this.setState({
                            wishlist: wishlist
                        });
                        
                        console.log(newItem.barangData.title)
                })
                .catch(err => console.error(err));
            }
        });
    };

    _showData = async () =>  {
        await AsyncStorage.getItem('userToken', (error, result) => {
            if (result) {
                const userRef = firebase.firestore().collection('user').doc(result);

                this.dataNya = firebase.firestore().collection('wishlist').where('user', '==', userRef);
                this.unsubscribe = this.dataNya.onSnapshot(this.onCollectionUpdate);

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

    render() {
        return ( 
            <ScrollView>
                <View>
                <FlatList
                    data={this.state.wishlist}
                    renderItem={({ item }) => (
                    <Text key={item.key}>{ item.title }</Text>
                    )}
                />
                </View>
            </ScrollView>
        );
    }
}
