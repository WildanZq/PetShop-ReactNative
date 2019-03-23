import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  ScrollView,
  Alert
} from 'react-native'
import { View, Button, Text } from 'native-base';
import NumberFormat from 'react-number-format';
import firebase from "../Firebase";
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 10,
    marginTop: 45,
  },
  indicatorTab: {
    backgroundColor: 'transparent',
  },
  scroll: {
    backgroundColor: '#FFF',
  },
  sceneContainer: {
    marginTop: 10,
  },
  socialIcon: {
    marginLeft: 14,
    marginRight: 14,
  },
  socialRow: {
    flexDirection: 'row',
  },
  tabBar: {
    backgroundColor: '#EEE',
  },
  tabContainer: {
    flex: 1,
    marginBottom: 12,
  },
  tabLabelNumber: {
    color: 'gray',
    fontSize: 12.5,
    textAlign: 'center',
  },
  tabLabelText: {
    color: 'black',
    fontSize: 22.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  userBioRow: {
    marginLeft: 40,
    marginRight: 40,
  },
  userBioText: {
    color: 'gray',
    fontSize: 13.5,
    textAlign: 'center',
  },
  userImage: {
    borderRadius: 60,
    height: 120,
    marginBottom: 10,
    width: 120,
  },
  userNameRow: {
    marginBottom: 10,
  },
  userNameText: {
    color: '#5B5A5A',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userRow: {
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cartItemBtn: {
    height: 26,
    width: 26,
    paddingTop: 0,
    paddingBottom: 0,
    justifyContent: 'center'
  }
})

export default class ProfileScreen extends Component {
  static navigationOptions = {
    headerTitle: 'Account',
    headerStyle: {
      backgroundColor: Colors.primary
    },
    headerTintColor: '#fff',
  }
  constructor() {
    super();
    this.state = {
      isLoading: true,
      getUser: {},
      key: '',
      barang: []
    };

    this.unsubscribe = null;
  }

  _signIn = () =>  {
    this.props.navigation.navigate('SignIn');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    firebase.auth().signOut();
    this.setState({
      key: '',
      isLoading: false
    });
  };

  renderBarang = () => {
    return this.state.barang.map(data => {
      return (
        <View style={{ borderWidth: 1, borderColor: Colors.divider, marginVertical: 5, flex: 1, marginHorizontal: 16 }} key={data.key}>
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            <Image
              source={data.image ? { uri: data.image } : require('../assets/images/no_img.jpeg')}
              style={{ height: 100, width: 100 }} />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>{data.title}</Text>
              <NumberFormat value={data.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '}
                renderText={value => <Text>{value}</Text>}
              />
              <View style={{ flexDirection: 'row', marginVertical: 8, alignItems: 'center' }}>
                <Text>Stok: </Text>
                <Button onPress={() => this.subtractItemStock(data.key)} warning style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>-</Text>
                </Button>
                <Text style={{ marginHorizontal: 8 }}>{data.stok}</Text>
                <Button onPress={() => this.addItemStock(data.key)} success style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>+</Text>
                </Button>
                <View style={{ marginLeft: 10 }}></View>
                <Button onPress={() => this.removeItem(data.key)} danger style={styles.cartItemBtn}>
                  <Text style={{ color: '#fff', paddingLeft: 0, paddingRight: 0 }}>x</Text>
                </Button>
              </View>
            </View>
          </View>
        </View>
      );
    });
  };

  addItemStock = key => {
    let data = this.state.barang;
    let newStok = null;
    data.map((val) => {
      if (val.key === key) {
        if (val.stok === 1) return;
        newStok = 1 + val.stok;
      }
    });

    const ref = firebase.firestore().collection('boards').doc(key);
    ref.update({ stok: newStok });
  };

  subtractItemStock = key => {
    let data = this.state.barang;
    let newStok = null;
    data.map((val) => {
      if (val.key === key) {
        if (val.stok === 1) return;
        newStok = val.stok - 1;
      }
    });

    const ref = firebase.firestore().collection('boards').doc(key);
    ref.update({ stok: newStok });
  };

  removeItem = async key => {
    const ref = firebase.firestore().collection('boards').doc(key);
    let img = '';
    await ref.get().then(doc => img = doc.data().image);
    if (img) {
      const pre = 'https://firebasestorage.googleapis.com/v0/b/coba-af1a4.appspot.com/o/images%2Fbarang%2F'.length;
      const imgLoc = img.substring(pre, img.indexOf('?'));
      let refImg = null;
      if (refImg = await firebase.storage().ref().child(`images/barang/${imgLoc}`)) {
        refImg.delete().then(() => 
          ref.delete().then(() => Alert.alert('', 'Produk berhasil dihapus'))
        );
      } else {
        ref.delete().then(() => Alert.alert('', 'Produk berhasil dihapus'));
      }
    } else {
      ref.delete().then(() => Alert.alert('', 'Produk berhasil dihapus'));
    }
  };

  _showData = async () =>  {
    await AsyncStorage.getItem('userToken', (error, result) => {
      if (result) {
        const transaksi = firebase.firestore().collection('boards').where('uid', '==', result);
        transaksi.onSnapshot(doc => {
          this.setState({ barang: [] });
          let newData = [];
          doc.docs.map(data => {
            newData = this.state.barang;
            newData.push({...data.data(), key: data.id});
            this.setState({ barang: newData })
          });
        });

        const ref = firebase.firestore().collection('user').doc(result);

        ref.get().then((doc) => {
          if (doc.exists) {
            this.setState({
              getUser: doc.data(),
              key: result,
              isLoading: false,
            });
          } else {
            console.log("No such document!");
          }
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

  addProduct = () => {
    this.props.navigation.navigate('AddProduct');
  }

  renderDefault = () => {
      return (
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', marginTop: 60 }}>
          <Button rounded green onPress={this._signIn}><Text> Sign In </Text></Button>
        </View>
      )
  }

  renderImg() {
    if (this.state.getUser.foto) {
      return (<Image
        style={styles.userImage}
        source={{
          uri: this.state.getUser.foto
        }}
      />);
    } else {
      return (<Image
        style={styles.userImage}
        source={ require('../assets/images/blank_profile.jpg') }
      />);
    }
  }

  renderContactHeader = () => {
    return (
      <ScrollView>
        <View style={styles.headerContainer}>
          <View style={styles.userRow}>
            {this.renderImg()}
            <View style={styles.userNameRow}>
              <Text style={styles.userNameText}>{this.state.getUser.nama}</Text>
            </View>
            <View style={styles.userBioRow}>
              <Text style={styles.userBioText}>{this.state.getUser.email}</Text>
              <Text style={styles.userBioText}>{this.state.getUser.gender}</Text>
              <Text style={styles.userBioText}>{this.state.getUser.tgl_lahir}</Text>
            </View>
          </View>
          <View style={styles.socialRow}>
            <View>
              <Button style={{ backgroundColor: Colors.accent, marginRight: 10 }} white rounded onPress={this.addProduct}><Text style={{ color: '#000' }}> Tambah Barang </Text></Button>
            </View>
            <View>
              <Button rounded danger onPress={this._signOutAsync}><Text> Sign Out </Text></Button>
            </View>
          </View>

          <Text style={{ marginTop: 18, fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Produk Anda</Text>

          {this.renderBarang()}
        </View>
      </ScrollView>
    )
  }
  
  render() {
    const isLoggedIn = this.state.key;

    if (this.state.isLoading) {
      return (
        <View style={{ marginTop: 60 }}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      );
    }
    return (
        <View style={[styles.container]}>
          <View style={styles.cardContainer}>
          {isLoggedIn ? (
            this.renderContactHeader()
            ): (
              this.renderDefault()
          )}
          </View>
        </View>
    )
  }
}
