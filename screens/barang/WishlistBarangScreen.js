import React from 'react';
import { AsyncStorage, ScrollView, FlatList } from "react-native";
import firebase from "../../Firebase";
import Colors from '../../constants/Colors';
import ProductItem from "../../components/ProductItem";

export default class WishlistBarangScreen extends React.Component {
    static navigationOptions = {
        title: 'Wishlist',
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

        if (newItem.barang != null) {
            newItem.barang.get()
            .then(res => {
                newItem.barangData = res.data();
                newItem.barangData.key = res.id;

                if (newItem.barangData != null) {
                wishlist.push(newItem);
                this.setState({
                    wishlist: wishlist
                })
                console.log(newItem.barangData.title)
                }
            })
            .catch(err => console.error(err));
        } else {
            wishlist.push(newItem);
        }
        });
    };

    _showData = async () =>  {
        await AsyncStorage.getItem('userToken', (error, result) => {
            if (result) {
                this.dataNya = firebase.firestore().collection('wishlist').where('user', '==', result);
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
                <FlatList
                style={{ padding: 5 }}
                data={this.state.wishlist}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <ProductItem
                    navigation={this.props.navigation}
                    data={item.barangData} />
                )}
                horizontal={false}
                numColumns={2}
                onEndThreshold={0}
                />
            </ScrollView>
        );
    }
}
