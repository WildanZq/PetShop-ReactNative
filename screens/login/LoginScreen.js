import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
  Alert,
} from 'react-native';
import { Facebook } from 'expo';
import firebase from "../../Firebase";

export default class LoginScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('user');
  }
  static navigationOptions = {
    title: 'Please sign in',
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this._signInFacebook} />
      </View>
    );
  }

  _signInFacebook = async () => {
    const appId = '2160043080729166';

    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync(appId, {
      permissions: ['public_profile', 'user_gender', 'user_birthday'],
    });

    switch (type) {
      case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);// Set persistent auth state

        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);
        const graphApi = `https://graph.facebook.com/v3.2/me?fields=id,name,birthday,email,gender&access_token=${token}`;
        const alertPrint = await fetch(graphApi);

        await AsyncStorage.setItem('userToken', token); //set Token disimpan di AsyncStorage
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            const dataUser = firebase.firestore().collection('user').doc(user.uid);//ngambil data document by user id Auth
            dataUser.get().then((doc) => {
              //buat ngecek data dari documentnya ada ga atau sama ga dengan user id Auth
              if (!doc.exists) {
                //kalo datanya ga ada, berarti jadinya sign up. kalo datanya ada berarti di skip bagian ini
                fetch(graphApi)
                .then(response => response.json())
                .then((response) => {
                    this.ref.doc(`${user.uid}`).set({
                      email: user.email,
                      nama: `${response.name}`,
                      foto: user.photoURL,
                      gender: `${response.gender}`,
                      tgl_lahir: `${response.birthday}`,
                    })
                    .catch((error) => {
                      console.error("Error adding user: ", error);
                    });
                })
                .catch(error => console.log(error));
              }
            });
          }
       });

        Alert.alert('Logged in!', `Hi ${(await alertPrint.json()).name}!`);
        this.props.navigation.navigate('AuthLoading');
      }
      case 'cancel': { }
    }
  };
}
