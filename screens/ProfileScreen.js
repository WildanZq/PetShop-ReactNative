import React, { Component } from 'react'
import {
  Image,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator,
  FlatList
} from 'react-native'
import { View, Button, Text } from 'native-base'
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
      penjualan: []
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

  onCollectionUpdate = querySnapshot => {
    const penjualan = [];

    querySnapshot.forEach(doc => {
      let newItem = doc.data();
      newItem.id = doc.id;

      if (newItem.barang != null) {
        newItem.barang.get()
          .then(res => {
            newItem.barangData = res.data()

            if (newItem.barangData != null) {
              penjualan.push(newItem);
              this.setState({
                penjualan: penjualan
              })
              console.log(newItem.barangData.title)
            }
          })
          .catch(err => console.error(err));
      } else {
        penjualan.push(newItem);
      }
    });
  };

  _showData = async () =>  {
    await AsyncStorage.getItem('userToken', (error, result) => {
        if (result) {
          const userRef = firebase.firestore().collection('user').doc(result);

          this.dataNya = firebase.firestore().collection('penjualan').where('pembeli', '==', userRef);
          this.unsubscribe = this.dataNya.onSnapshot(this.onCollectionUpdate);

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

        <FlatList
            data={this.state.penjualan}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <Text>{ item.barangData.title }</Text>
            )}
        />
      </View>
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
