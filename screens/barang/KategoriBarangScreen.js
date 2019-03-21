import React from 'react';
import { AsyncStorage, Alert, ActivityIndicator, FlatList, ScrollView } from "react-native";
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
import ProductItem from "../../components/ProductItem";
import firebase from "../../Firebase";
import Colors from '../../constants/Colors';

export default class KategoriBarangScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
      const {params = {}} = navigation.state;
        return {
            title: params.refKategori.toUpperCase(),
            headerStyle: {
                backgroundColor: Colors.primary,
            },
            headerTintColor: '#fff',
        }
    }

    constructor() {
        super();
        this.state = {
            isLoading: true,
            barang: []
        };
        this.unsubscribe = null;
    }

    onCollectionUpdate = querySnapshot => {
        const barang = [];

        querySnapshot.forEach(doc => {
            const { title, image, kategori, harga } = doc.data();
            barang.push({
                key: doc.id,
                title,
                image,
                kategori,
                harga
            });
        });
        this.setState({
            barang,
            isLoading: false
        });
    };

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const refKategori = params ? params.refKategori: null;

        this.ref = firebase.firestore().collection("boards").where('kategori', '==', refKategori);
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }

    renderProductList() {
        if (this.state.isLoading) {
            return (
                <View style={{ marginTop: 12 }}>
                <ActivityIndicator size='small' color={Colors.primary} />
                </View>
            );
        }

        return (<FlatList
        style={{ padding: 5 }}
        data={this.state.barang}
        renderItem={({ item }) => (
            <ProductItem
            navigation={this.props.navigation}
            data={item} />
        )}
        horizontal={false}
        numColumns={2}
        />);
    }

    render() {
        return (
        <ScrollView>
            {this.renderProductList()}
        </ScrollView>
        );
    }
}
