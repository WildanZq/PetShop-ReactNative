import React from 'react';
import {AsyncStorage, Alert, Image, StyleSheet, Dimensions, ScrollView} from "react-native";
import {
  View,
  Button,
  Text,
  Icon
} from "native-base";
import { TouchableOpacity, ActivityIndicator } from 'react-native';
import ImageView from 'react-native-image-view';
import firebase from "../../Firebase";
import NumberFormat from 'react-number-format';
import Colors from '../../constants/Colors';

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollview: {
  },
  main: {
    marginLeft: 0.05 * deviceWidth,
    marginRight: 0.05 * deviceWidth,
    marginTop: 10,
  },
  imageSwiperContainer: {
    height: 300,
  },
  swiperSlide: {

  },
  slideImage: {
    width: deviceWidth,
    height: 300,
  },
  sticky: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  divider: {
    backgroundColor: "#eee",
    width: deviceWidth,
    height: 10,
    marginTop: 15,
  },
  textDefault: {
    fontFamily: "Roboto",
  },
  stokIndicator: {
    fontSize: 14,
  },
  bold: {
    fontWeight: "700",
  },
  semiBold: {
    fontWeight: "500",
  },
  itemName: {
    fontSize: 28,
  },
  itemPrice: {
    fontSize: 18,
  },
  kurirBox: {
    marginTop: 15,
    borderColor: "#eee",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
  }
});

export default class DetailBarangScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state;

    return {
      title: params.title,
      headerStyle: {
        backgroundColor: Colors.primary,
      },
      headerTintColor: '#fff',
    }
  }

  constructor() {
    super();
    this.state = {
      idDocument: '',
      token: '',
      getBarang: {},
      imageIndex: 0,
      isImageViewVisible: false,
      key: '',
      isLoading: true
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const boardKey = params ? params.boardKey : null;

    const ref = firebase.firestore().collection('boards').doc(`${JSON.parse(boardKey)}`);
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

  _doPayment = () => {
    if (this.state.token == '') {
      Alert.alert(
        'Gagal',
        'Silakan Login Terlebih Dahulu',
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => this.props.navigation.navigate("SignIn") },
        ],
        { cancelable: false }
      );
    }
    else {
      this.props.navigation.navigate("PesanBarang", {
        barang: [{id: this.state.key, jumlah: 1}]
      })
    }
  }

  addToCart = async () => {
    let cart = JSON.parse(await AsyncStorage.getItem('cart'));
    if (! cart) {
      cart = [];
    }

    let founded = false;
    cart.map(val => {
      if (val.id == this.state.key) {
        founded = true;
        val.jumlah++;
      }
    });

    if (! founded) {
      const newItem = {id: this.state.key, jumlah: 1};
      cart.push(newItem);
    }

    await AsyncStorage.setItem('cart', JSON.stringify(cart))
      .then(() => Alert.alert('','Berhasil ditambahkan ke keranjang'))
      .catch(() => Alert.alert('','Gagal ditambahkan ke keranjang'));
  };

  render() {
    const images = [
        {
            source: {
                uri: this.state.getBarang.image,
            },
            title: 'IMG 1',
            width: 806,
            height: 720,
        },
    ];
    const noImages = [
        {
            source: require('../../assets/images/no_img.jpeg'),
            title: 'No Image',
            width: 806,
            height: 720,
        },
    ];
    const {isImageViewVisible, imageIndex} = this.state;

    if (this.state.isLoading)
      return (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );

    return (
      <View style={{ display: 'flex', flex: 1 }}>
        <ScrollView style={styles.scrollview}>
          <View style={styles.imageSwiperContainer}>
            <View style={styles.swiperSlide}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    imageIndex: 0,
                    isImageViewVisible: true,
                  });
              }}>
                <Image
                  style={styles.slideImage}
                  source={this.state.getBarang.image? {uri: this.state.getBarang.image} : require('../../assets/images/no_img.jpeg')}
                />
              </TouchableOpacity>
            </View>
            <ImageView
              images={this.state.getBarang.image? images : noImages}
              imageIndex={imageIndex}
              animationType="fade"
              isVisible={isImageViewVisible}
              onClose={() => this.setState({isImageViewVisible: false})}
            />
            <Button style={{ borderRadius: 50, backgroundColor: '#fff', position: 'absolute', bottom: 10, right: 15, width: 50, height: 50, padding: 0, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
              <Icon
                name='md-heart'
                size={56}
                style={{ color: Colors.divider, marginLeft: 0, marginRight: 0 }}
              />
            </Button>
          </View>
          <View style={styles.main}>
            <Text style={[styles.textDefault, styles.stokIndicator]}>
              Stok tersedia!
            </Text>
            <Text style={[styles.textDefault, styles.itemName, styles.bold]}>
              {this.state.getBarang.title}
            </Text>
            <NumberFormat value={this.state.getBarang.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
              renderText={value =>
              <Text style={[styles.itemPrice]}>{value}</Text>}
            />
          </View>
          <View style={styles.divider}/>
          <View style={styles.main}>
            <Text style={[styles.textDefault, styles.semiBold]}>
              Kategori
            </Text>
            <Text>
              {this.state.getBarang.kategori}
            </Text>
            <Text style={[styles.textDefault, styles.semiBold]}>
              Deskripsi
            </Text>
            <Text style={{ marginBottom: 15 }}>
              { this.state.getBarang.deskripsi ? this.state.getBarang.deskripsi : 'Lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet' }
            </Text>
          </View>
        </ScrollView>
        <View style={{
          elevation: 10,
          backgroundColor: '#fff',
          paddingLeft: 0.05 * deviceWidth,
          paddingRight: 0.05 * deviceWidth,
          paddingVertical: 15,
          display: 'flex', flexDirection: 'row', justifyContent: 'flex-end' }}>
            <Button info
              onPress={this.addToCart}
              style={{ height: 30, marginRight: 10 }}
            >
              <Text style={{ fontSize: 14 }}>Masukkan Keranjang</Text>
            </Button>
            <Button success
              style={{ height: 30 }}
              onPress={this._doPayment}
            >
              <Text style={{ fontSize: 14 }}>Beli Barang {this.state.idDocument}</Text>
            </Button>
        </View>
      </View>
    );
  }
}
