import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text, View } from 'native-base';
import { TextInput, Picker, Image, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { ImagePicker } from 'expo';

import Colors from '../constants/Colors';
import firebase from "../Firebase";

export default class AddProductScreen extends React.Component {
    static navigationOptions = {
        title: 'Tambah Produk',
        headerStyle: {
            backgroundColor: Colors.primary
        },
        headerTintColor: '#fff'
    };

  constructor(props) {
    super(props)
    this.state = {
      img: null,
      title: null,
      harga: null,
      kategori: 'adopsi',
      stok: null,
      loading: false
    };
  }

  renderImg = () => {
    if (this.state.img) {
      return (<Image
        style={styles.img}
        source={{uri: this.state.img}}
      />);
    }

    return (<Image
      style={styles.img}
      source={require('../assets/images/no_img.jpeg')}
    />);
  }

  renderBtnInner = () => {
    if (!this.state.loading) {
      return (<Text style={{ color: '#000' }}>Tambah</Text>);
    }

    return (<ActivityIndicator size="small" color='#000' />);
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        {this.renderImg()}
        <Button style={{ marginVertical: 10 }} onPress={this.chooseImg}><Text>Pilih Gambar</Text></Button>
        <Text>Nama</Text>
        <TextInput
          placeholder='Kucing'
          onSubmitEditing={this.addProduct}
          style={styles.input}
          onChangeText={(e) => this.setState({ title: e })}
          value={this.state.title}/>
        <Text>Harga</Text>
        <TextInput
          placeholder='800000'
          onSubmitEditing={this.addProduct}
          keyboardType='numeric'
          style={styles.input}
          onChangeText={(e) => this.setState({ harga: e })}
          value={this.state.harga}/>
        <Text>Kategori</Text>
        <Picker
          selectedValue={this.state.kategori}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({kategori: itemValue})
          }>
          <Picker.Item label="Adopsi" value="adopsi" />
          <Picker.Item label="Makanan" value="makanan" />
          <Picker.Item label="Aksesoris" value="aksesoris" />
          <Picker.Item label="Mainan" value="mainan" />
          <Picker.Item label="Kesehatan" value="kesehatan" />
          <Picker.Item label="Suplemen" value="suplemen" />
        </Picker>
        <Text>Stok</Text>
        <TextInput
          placeholder='10'
          onSubmitEditing={this.addProduct}
          keyboardType='numeric'
          style={styles.input}
          onChangeText={(e) => this.setState({ stok: e })}
          value={this.state.stok} />
        <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 10 }}>
          <Button danger style={{ borderRadius: 6, paddingHorizontal: 15, marginRight: 10 }} onPress={() => this.props.navigation.goBack()}><Text>Batal</Text></Button>
          <Button style={{ backgroundColor: Colors.accent, borderRadius: 6, paddingHorizontal: 15 }} onPress={this.addProduct}>{this.renderBtnInner()}</Button>
        </View>
      </ScrollView>
    );
  }

  chooseImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({});

    if (!result.cancelled) {
      this.setState({ img: result.uri });
    }
  }

  addProduct = async () => {
    if (this.state.loading) return;
    if (!this.state.harga || !this.state.title || !this.state.img || !this.state.stok) {
      Alert.alert('Gagal', 'Isi semua inputan');
      return;
    }

    this.setState({ loading: true });
    const db = firebase.firestore();

    await db.collection('boards').add({
      title: this.state.title,
      harga: this.state.harga,
      kategori: this.state.kategori,
      stok: this.state.stok,
      uid: await AsyncStorage.getItem('userToken')
    })
      .then(this.goBack)
      .catch(function (error) {
        Alert.alert('Gagal', error.message);
      });

    this.setState({ loading: false });
  }

  goBack = () => {
    this.props.navigation.goBack();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  img: {
    width: '100%',
    height: 170,
    marginTop: 10
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.divider,
    paddingLeft: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginBottom: 10,
    borderRadius: 6
  }
});