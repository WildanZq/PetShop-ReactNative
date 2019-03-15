import React, { Component } from 'react'
import {
  Animated,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { View, Button, Text } from 'native-base'
import { Icon } from 'react-native-elements'
import firebase from "../Firebase";

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
      backgroundColor: '#29B6F6',
    },
    headerTintColor: '#fff',
  }
  constructor() {
    super();
    this.state = {
      isLoading: true,
      getUser: {},
      key: '',
    };
  }

  _signIn = async () =>  {
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

  _showData = async () =>  {
    await AsyncStorage.getItem('userToken', (error, result) => {
        if (result) {
          const ref = firebase.firestore().collection('user').doc(result);
          ref.get().then((doc) => {
            if (doc.exists) {
              this.setState({
                getUser: doc.data(),
                key: doc.id,
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

  renderDefault = () => {
      return (
        <Button rounded green onPress={this._signIn}><Text> Sign In </Text></Button>
      )
  }

  renderContactHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.userRow}>
          <Image
            style={styles.userImage}
            source={{
              uri: this.state.getUser.foto,
            }}
          />
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
            <Icon
              size={30}
              type="entypo"
              color="#3B5A98"
              name="facebook-with-circle"
              onPress={() => console.log('facebook')}
            />
          </View>
          <View style={styles.socialIcon}>
            <Icon
              size={30}
              type="entypo"
              color="#56ACEE"
              name="twitter-with-circle"
              onPress={() => console.log('twitter')}
            />
          </View>
          <View>
            <Button rounded danger onPress={this._signOutAsync}><Text> Sign Out </Text></Button>
          </View>
        </View>
      </View>
    )
  }

  render() {
    const isLoggedIn = this.state.key;

    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
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
