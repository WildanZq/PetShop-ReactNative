import React from 'react';
import {
    AsyncStorage
} from "react-native";
import {
    View,
    Text,
    Card,
    CardItem,
    Icon,
    Button,
    Item,
    Input,
} from "native-base";
import {
    ExpoConfigView
} from '@expo/samples';
import firebase from "../../Firebase";

export default class PesanBarangScreen extends React.Component {
    static navigationOptions = {
        title: 'Checkout',
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
    }

    render() {
        return ( 
            <View>
                <Text>Pesan</Text>
            </View>
        );
    }
}
