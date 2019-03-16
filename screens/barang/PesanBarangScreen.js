import React from 'react';
import {
    AsyncStorage, Alert
} from "react-native";
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
import {
    ExpoConfigView
} from '@expo/samples';
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
            idDocument: '',
            token: '',
            getBarang: {},
            key: '',
        };
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        const boardKey = params ? params.boardKey: null;

        const ref = firebase.firestore().collection('boards').doc(boardKey);
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

    _doTransaksi = () => {
        this.ref = firebase.firestore().collection('penjualan');
        
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
        <Content>
          <Card style={{marginTop:20, backgroundColor:'#f5f5f5', flex: 1,}}>
            <CardItem>
              <Body>
                <Text>{this.state.getBarang.title}</Text>  
              </Body>
              <Right><NumberFormat value={this.state.getBarang.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} 
            renderText={value => 
            <Text>{value}{"\n\n"}</Text>} />
          </Right>
            </CardItem>
          </Card>

          <Card transparent style={{marginTop:20, backgroundColor:'#f5f5f5', flex: 1,}}>
            <CardItem>
              <Right><NumberFormat value={this.state.getBarang.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} 
            renderText={value => 
            <H3>TOTAL: {value}{"\n\n"}</H3>} />
          </Right>
            </CardItem>
          </Card>

            <Button block success
            onPress={() => {this._doTransaksi()} }>
                <Text>Konfirmasi Pembayaran</Text>
            </Button>
        </Content>
        );
    }
}
