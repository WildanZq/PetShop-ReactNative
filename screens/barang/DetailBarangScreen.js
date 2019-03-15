import React from 'react';
import {AsyncStorage, Image, StyleSheet, Dimensions, ScrollView} from "react-native";
import {
  View,
  Card,
  CardItem,
  Icon,
  Item,
  Container,
} from "native-base";
import {
  Input,
  Button,
  Text,
  Divider,
} from 'react-native-elements';
import {
  Grid,
  Row,
  Col
} from 'react-native-easy-grid';
import Swiper from 'react-native-swiper';
import { ExpoConfigView } from '@expo/samples';

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
    };
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    const boardKey = params ? params.boardKey: null;

    this.setState({
      idDocument: `${JSON.parse(boardKey)}`,
    });

    AsyncStorage.getItem('userToken', (error, result) => {
        if (result) {
          this.setState({
            token: result,
          });
        }
    });
  }

  _doSignIn = () => {
      return (
        <Button warning onPress={() => this.props.navigation.navigate('SignIn')}>
            <Text>Login Terlebih Dahulu</Text>
        </Button>
      )
  }
  _doPayment = () => {
      return (
        <Button success onPress={() => this.props.navigation.goBack()}>
            <Text>Beli Barang {this.state.idDocument}</Text>
        </Button>
      )
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
              Stok tersedia!
            </Text>
            <Text style={[styles.textDefault, styles.itemName, styles.bold]}>
              Whiskas Tuna Premium 250g
            </Text>
            <Text style={[styles.textDefault, styles.itemPrice, styles.semiBold]}>
              Rp. 594.000
            </Text>
            <View style={styles.kurirBox}>
              <Text style={styles.textDefault, styles.kurirText}>
                4 Kurir Tersedia
              </Text>
              <View>
                <Text style={styles.textDefault, styles.kurirText}>
                  Dikirim dari Lowokwaru, Malang ke Kab. Sidoarjo
                </Text>
                <Button title="Coba"/>
              </View>
            </View>
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
                <Button title="Masukkan Keranjang"/>
              </Col>
              <Col>
                {this.state.token ? (
                  this._doPayment()
                  ): (
                  this._doSignIn()
                )}
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
