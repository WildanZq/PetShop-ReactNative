import React from 'react';
import { ActivityIndicator, FlatList, ScrollView } from "react-native";
import { View } from "native-base";
import ProductItem from "../../components/ProductItem";
import firebase from "../../Firebase";
import Colors from '../../constants/Colors';

export default class KategoriBarangScreen extends React.PureComponent {
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
        keyExtractor={item => item.key}
        renderItem={({ item }) => (
            <ProductItem
            navigation={this.props.navigation}
            data={item} />
        )}
        numColumns={2}
        onEndReached={({ item }) => (
            <ProductItem
            navigation={this.props.navigation}
            data={item} />
        )}
        onEndThreshold={0}
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
