import React from 'react';
import {AsyncStorage, Alert, Image, StyleSheet, Dimensions, ScrollView} from "react-native";
import {
  View,
  Card,
  CardItem,
  Icon,
  Item,
  Container,
  Button,
  Text,
} from "native-base";
import {
  Input,
  Divider,
} from 'react-native-elements';
import {
  Grid,
  Row,
  Col
} from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { ExpoConfigView } from '@expo/samples';
import firebase from "../../Firebase";
import NumberFormat from 'react-number-format';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

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
    marginVertical: 15,
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
  static navigationOptions = {
    title: 'Detail Barang',
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

  _doPayment() {
    if(this.state.token=='') {
      Alert.alert(
        'Gagal',
        'Silakan Login Terlebih Dahulu',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
          {text: 'OK', onPress: () => this.props.navigation.navigate("SignIn")},
        ],
        { cancelable: false }
      );
    }
    else {
      this.props.navigation.navigate("PesanBarang", {
        key: this.props.navigation.state.key,
        boardKey: this.state.key
      })
    }
  }

  render() {
    return (
      <ScrollView style={styles.scrollview}>
          <View style={styles.imageSwiperContainer}>
            <Swiper showsButtons={false} autoplay={false}>
              <View style={styles.swiperSlide}>
                <Image
                  style={styles.slideImage}
                  source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}}
                />
              </View>
              <View style={styles.swiperSlide}>
                <Image
                  style={styles.slideImage}
                  source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}}
                />
              </View>
              <View style={styles.swiperSlide}>
                <Image
                  style={styles.slideImage}
                  source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}}
                />
              </View>
            </Swiper>
          </View>
          <View style={styles.main}>
            <Text style={[styles.textDefault, styles.stokIndicator]}>
              Stok tersedia!{"\n"}
              Kategori: {this.state.getBarang.kategori}
            </Text>
            <Text style={[styles.textDefault, styles.itemName, styles.bold]}>
              {this.state.getBarang.title}
            </Text>
            <NumberFormat value={this.state.getBarang.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} 
            renderText={value => 
            <Text style={[styles.textDefault, styles.itemPrice, styles.semiBold]}>{value}{"\n\n"}</Text>} />
          </View>
          <View style={styles.divider}/>
          <View style={styles.main}>
            <Text style={[styles.textDefault, styles.semiBold]}>
              Informasi Produk
            </Text>
            <Text>
              Pemesanan Minimum : 1 pcs
              Kondisi : Baru
              Berat : 100 gram
            </Text>
            <Text style={[styles.textDefault, styles.semiBold]}>
              Deskripsi Produk
            </Text>
            <Text>
              Makanan kucing Whiskas Tuna Premium ukuran 250 gram 100% original jaminan seller. lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet...
            </Text>
            <Text>
            Baca Selengkapnya...
            </Text>
          </View>
          <View style={styles.divider}/>
          <View style={styles.main}>
            <Grid>
              <Col>
                <Button info>
                  <Text>Tambahkan ke Keranjang</Text>
                </Button>
              </Col>
              <Col>
              <Button success 
              onPress={() => this._doPayment() }>
                  <Text>Beli Barang {this.state.idDocument}</Text>
              </Button>
              </Col>
            </Grid>
          </View>
      </ScrollView>
        // {<View>
        //   <Text>{this.state.idDocument}{"\n\n\n"} </Text>
        //
        //   {this.state.token ? (
        //     this._doPayment()
        //     ): (
        //     this._doSignIn()
        //   )}
        // </View>}
    );
  }
}
