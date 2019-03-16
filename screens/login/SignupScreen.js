import React from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  Dimensions,
  Image
} from 'react-native';
import {
  Input,
  Button,
  Text
} from 'react-native-elements';
import {
  Grid,
  Row
} from 'react-native-easy-grid';
import {
  Container
} from 'native-base'
import firebase from "../../Firebase";
import { LinearGradient } from 'expo';
import Spinner from '../../components/common/Spinner';

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputOutterContainer: {
    marginBottom: 10,
  },
  inputContainer: {
    borderBottomColor: '#A2A2A2',
    height: 25,
    paddingHorizontal: 2,
  },
  inputLabel: {
    fontFamily: "Roboto",
    fontSize: 12,
    fontWeight: "100",
  },
  inputStyle: {
    fontFamily: "Roboto",
    fontSize: 14,
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
  button: {
    marginTop: 15,
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
    marginVertical: 10,
    backgroundColor: '#A2A2A2',
    height: StyleSheet.hairlineWidth,
    width: 0.35 * deviceWidth,
  },
  dividerText: {
    fontFamily: "Roboto",
    color: '#A2A2A2',
    paddingHorizontal: 5,
    fontSize: 10
  },
  signupView: {
    marginTop: 10,
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

export default class SignupScreen extends React.Component {
  constructor() {
    super();
    this.ref = firebase.firestore().collection('user');
    this.state = {
      displayName: null,
      email: null,
      password: null,
      password2: null,
      loading: false
    };
  }

  state = {
    fontLoaded: false,
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
          <Text style={styles.loginText}>Sign Up</Text>
          </Row>
          <Row size={6}  style={ [styles.container, { alignItems: 'flex-start'}] }>
            <View style={[ styles.form, {alignItems: 'center'} ]}>
              <Input
                onChangeText={e => this.setState({ displayName: e })}
                value={this.state.displayName}
                label='Full Name'
                autoCapitalize='words'
                placeholder="John Steve"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={[styles.inputOutterContainer]}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}/>
              <Input
                onChangeText={e => this.setState({ email: e })}
                value={this.state.email}
                label='Email'
                autoCapitalize='none'
                keyboardType='email-address'
                autoComplete='email'
                placeholder="john@example.com"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={[styles.inputOutterContainer]}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}/>
              <Input
                label='Pick a Username'
                autoCapitalize='none'
                placeholder="johnsteve"
                inputContainerStyle={[styles.inputContainer]}
                containerStyle={styles.inputOutterContainer}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]} />
              <Input
                onChangeText={e => this.setState({ password: e })}
                value={this.state.password}
                secureTextEntry={true}
                autoCapitalize='none'
                label='Password'
                placeholder="********"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={styles.inputOutterContainer}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}/>
              <Input
                onChangeText={e => this.setState({ password2: e })}
                value={this.state.password2}
                secureTextEntry={true}
                autoCapitalize='none'
                label='Confirm Password'
                placeholder="********"
                inputContainerStyle={ [styles.inputContainer] }
                containerStyle={[styles.inputOutterContainer, {marginBottom: 0}]}
                inputStyle={styles.inputStyle}
                labelStyle={[styles.inputLabel]}/>
              {this.renderButton()}
              <View flexDirection="row" style={styles.signupView}>
                <Text style={[styles.signupText]}>Already have an account? </Text>
                <Text style={[styles.signupText, styles.createnow]} onPress={() => this.props.navigation.navigate('SignIn')}>Sign In</Text>
              </View>
            </View>
          </Row>
        </Grid>
      </Container>
    );
  }

  renderButton = () => {
    if (this.state.loading) {
      return <Spinner size='small' />;
    }

    return (<Button
      ViewComponent={LinearGradient}
      linearGradientProps={{
        colors: ['#90F7EC', '#32CCBC'],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 0 },
      }}
      title="Sign up"
      buttonStyle={[styles.button]}
      onPress={this._signUp}
    />);
  }

  _signUp = async () => {
    if (this.state.loading) return;
    if (!this.state.displayName || !this.state.email || !this.state.password || !this.state.password2) {
      Alert.alert('Gagal', 'Isi semua inputan');
      return;
    }
    if (this.state.password !== this.state.password2) {
      Alert.alert('Gagal', 'Password tidak sama');
      return;
    }

    this.setState({ loading: true });
    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then((res) => {
        firebase.firestore().collection('user').doc(res.user.uid).set({
          email: this.state.email,
          nama: this.state.displayName,
          foto: null
        });
        this.setState({
          displayName: null,
          email: null,
          password: null,
          password2: null
        });
        Alert.alert('Berhasil', 'Berhasil menambahkan akun');
      })
      .catch((error) => {
        Alert.alert('Gagal', error.message);
      });

    this.setState({ loading: false });
  }
}
