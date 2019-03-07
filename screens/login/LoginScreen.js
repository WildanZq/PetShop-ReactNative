import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { Facebook } from 'expo';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Input,
  Button,
  Text,
  Divider
} from 'react-native-elements';
import {
  Grid,
  Row,
  Col
} from 'react-native-easy-grid';
import {
  Container
} from 'native-base'
import firebase from "../../Firebase";
import { LinearGradient } from 'expo';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    borderBottomColor: '#A2A2A2'
  },
  form: {
    width: 0.85 * deviceWidth,
    maxWidth: 0.95 * deviceWidth,
    height: 0.6 * deviceHeight,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
    	width: 0,
    	height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginText: {
    fontSize: 27,
    fontFamily: 'Roboto',
    fontWeight: '300',
    color: 'white'
  },
  inputLabel: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "100",
  },
  button: {
    marginTop: 20,
    borderRadius: 10,
    width: 200,
    paddingVertical: 10,
  },

  fe: {
    alignItems: 'flex-end',
  },
  dev: {
    borderColor: 'black',
    borderWidth: 1,
  },
  divider: {
    marginVertical: 20,
    backgroundColor: '#A2A2A2',
    height: StyleSheet.hairlineWidth,
    width: 0.35 * deviceWidth,
  },
  dividerText: {
    fontFamily: "Roboto",
    color: '#A2A2A2',
    paddingHorizontal: 5,
    fontSize: 12
  },
  signupView: {
    marginTop: 25,
  },
  signupText: {
    fontFamily: "Roboto",
    fontSize: 12,
    color: '#A2A2A2',
  },
  createnow: {
    fontWeight: 'bold',
  }
});

export default class LoginScreen extends React.Component {
  state = {
    fontLoaded: false,
    enteredText: "",
  };

  static navigationOptions = {
    header: null,
  };

  render() {
    return (
      <Container>
        <View>
        <LinearGradient
            colors={['#32CCBC', '#90F7EC']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: 0.55 * deviceHeight,
            }}
            start={[0,0]}
            end={[1,0]}
        />
        </View>
        <Grid>
          <Row size={2} style={[styles.container, styles.fe]}>
            <Image source={require('../../assets/images/pl-logo.png')} style={{ width: 100, height: 100, borderRadius: 15 }}/>
          </Row>
          <Row size={1} style={[styles.container]}>
          <Text style={styles.loginText}>Sign In</Text>
          </Row>
          <Row size={6}  style={ [styles.container, { alignItems: 'flex-start'}] }>
            <View style={[ styles.form, {alignItems: 'center'} ]}>
              <Input
                label='Username or Email'
                placeholder="john@example.com"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={{marginTop: 10}}
                labelStyle={[styles.inputLabel]}/>
              <Input
                secureTextEntry={true}
                autoCapitalize='none'
                label='Password'
                placeholder="Password"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={{marginTop: 20}}
                labelStyle={[styles.inputLabel]}/>
              <Button
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ['#90F7EC', '#32CCBC'],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 0 },
                }}
                title="Sign in"
                buttonStyle={[styles.button]}
                onPress={this._signInAsync}
              />
              <View flexDirection="row" style={{alignItems: 'center'}}>
                <View style={styles.divider}/>
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.divider}/>
              </View>
              <Button
                ViewComponent={LinearGradient}
                linearGradientProps={{
                  colors: ['#3C8CE7', '#00EAFF'],
                  start: { x: 0, y: 0 },
                  end: { x: 1, y: 0 },
                }}
                title="Sign in with Facebook"
                buttonStyle={[styles.button, {marginTop: 0}]}
                onPress={this._signInFacebook}
              />
              <View flexDirection="row" style={styles.signupView}>
                <Text style={[styles.signupText]}>Don't have an account? </Text>
                <Text style={[styles.signupText, styles.createnow]}>Create Now</Text>
              </View>
            </View>
          </Row>
        </Grid>
      </Container>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    await AsyncStorage.setItem('name', 'awe');
    this.props.navigation.navigate('App');
  };

  _signInFacebook = async () => {
    const appId = '2160043080729166';

    const {
      type,
      token,
      expires,
      permissions,
      declinedPermissions,
    } = await Facebook.logInWithReadPermissionsAsync(appId, {
      permissions: ['public_profile'],
    });

    switch (type) {
      case 'success': {
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);  // Set persistent auth state
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        const facebookProfileData = await firebase.auth().signInAndRetrieveDataWithCredential(credential);  // Si

        const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
        await AsyncStorage.setItem('userToken', token);

        Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);

        this.props.navigation.navigate('AuthLoading');
      }
      case 'cancel': {

      }
    }
  };
}
