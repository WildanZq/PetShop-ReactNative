import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Button, Text, View, Icon } from 'native-base';
import { TextInput, Picker, Image, Alert, AsyncStorage, ActivityIndicator } from 'react-native';
import { ImagePicker } from 'expo';
import uuid from 'uuid';

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
      deskripsi: null,
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
        <Button style={{ backgroundColor: '#fff', borderRadius: 50, width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 275, right: 15 }} onPress={this.chooseImg}>
          <Icon
            name='md-camera'
            size={56}
            style={{ color: Colors.primary, marginLeft: 0, marginRight: 0 }}
          />
        </Button>
        <View style={{ paddingHorizontal: 20 }}>
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
          <Text>Deskripsi</Text>
          <TextInput
            placeholder='Lorem ipsum'
            style={styles.input}
            multiline={true}
            numberOfLines={4}
            onChangeText={(e) => this.setState({ deskripsi: e })}
            value={this.state.deskripsi} />
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginBottom: 10 }}>
            <Button danger style={{ borderRadius: 6, paddingHorizontal: 15, marginRight: 10 }} onPress={() => this.props.navigation.goBack()}><Text>Batal</Text></Button>
            <Button style={{ backgroundColor: Colors.accent, borderRadius: 6, paddingHorizontal: 15 }} onPress={this.addProduct}>{this.renderBtnInner()}</Button>
          </View>
        </View>
      </ScrollView>
    );
  }

  chooseImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({});

    if (!result.cancelled) {
      //uploadUrl = await this.uploadImageAsync(result.uri);
      this.setState({ img: result.uri });
    }
  }

  uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child("images/barang/"+uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  addProduct = async () => {
    if (this.state.loading) return;
    if (!this.state.harga || !this.state.title || !this.state.img || !this.state.stok) {
      Alert.alert('Gagal', 'Isi semua inputan');
      return;
    }

    this.setState({ loading: true });
    const db = firebase.firestore();
    
    uploadUrl = await this.uploadImageAsync(this.state.img);

    await db.collection('boards').add({
      title: this.state.title,
      image: uploadUrl,
      harga: this.state.harga,
      kategori: this.state.kategori,
      stok: this.state.stok,
      deskripsi: this.state.deskripsi,
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
    backgroundColor: '#fff'
  },
  img: {
    borderWidth: 1,
    borderColor: Colors.divider,
    width: '100%',
    height: 300,
    marginBottom: 15
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