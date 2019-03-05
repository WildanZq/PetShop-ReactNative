import React, { Component } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList
} from "react-native";

import { Col, Row, Grid } from "react-native-easy-grid";
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Body,
  Icon,
  Left,
  Right,
  Title,
  Button,
  Item,
  Input,
  Thumbnail
} from "native-base";

import { Dimensions } from "react-native";
const DeviceWidth = Dimensions.get("window").width;

import { MonoText } from "../components/StyledText";
import firebase from "../Firebase";
import Swiper from 'react-native-swiper';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    //header: null
    headerTitle:
          <Grid>
            <Row>
            <Col style={{width:80, marginTop:18}}><Text> LOGO</Text></Col>
            <Col style={{}}>
              <Item rounded style={{marginTop:9, width:195, height:36}}>
                <Input placeholder='Search'/>
              </Item>
            </Col>
            <Col style={{marginTop:13, width: 50}}>
              <Icon name='cart' />
            </Col>
            </Row>
          </Grid>,
  };
  constructor() {
    super();
    this.ref = firebase.firestore().collection("boards");
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      boards: []
    };
  }

  onCollectionUpdate = querySnapshot => {
    const boards = [];
    querySnapshot.forEach(doc => {
      const { title, description, author } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        description,
        author
      });
    });
    this.setState({
      boards,
      isLoading: false
    });
  };

  componentDidMount() {
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  _renderItem = ({item}) => (
    <Content>
    <Card style={{ flex: 0, margin: 5, backgroundColor: '#ddd', height: "auto"}}>
      <CardItem>
        <Left>
          <Thumbnail source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}} />
          <Body>
            <Text>{item.title}</Text>
            <Text note>bl4ckck</Text>
          </Body>
        </Left>
      </CardItem>
      <CardItem cardBody>
        <Image source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}} style={{height: 200, width: null, flex: 1}}/>
      </CardItem>
      <CardItem>
        <Left>
        <Body>
          <Text note>{item.title}</Text>
        </Body>
        </Left>
      </CardItem>
    </Card>
    </Content>
  );

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{height:200}}>
            <Swiper showsButtons={true}>
              <View style={styleSlider.slide1}>
              <Image
                  style={{width: 400, height: 300}}
                  source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}}
              />
              </View>
              <View style={styleSlider.slide2}>
                <Text style={styleSlider.text}>Beautiful</Text>
              </View>
              <View style={styleSlider.slide3}>
                <Text style={styleSlider.text}>And simple</Text>
              </View>
            </Swiper>
        </View>

          <Card
            style={{
              flexDirection: "row",
              flex: 0,
              justifyContent: "center",
              alignItems: "center",
              height: "auto"
            }}
          >
            <View style={{marginTop:20}}>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="home" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="adjust" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop:20}}>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="anchor" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="archive" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop:20}}>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="database" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="home" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop:20}}>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="home" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
              <View style={styles.viewIcon}>
                <TouchableOpacity style={styles.menuIcon}>
                  <Icon type="FontAwesome" name="gavel" size={30} color="#01a699" />
                </TouchableOpacity>
              </View>
            </View>
          </Card>

          <View style={styles.footer}>
            <View>
              <Text>{"\n"}Recommended for you{"\n"}</Text>
            </View>
          </View>

          <FlatList
            data={this.state.boards}
            renderItem={this._renderItem} //method to render the data in the way you want using styling u need
            horizontal={false}
            numColumns={2}
          />

      </ScrollView>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use
          useful development tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/development-mode"
    );
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      "https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes"
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 22
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
  activity: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center"
  },
  iconColor1: {
    backgroundColor: "red"
  },
  menuIcon: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 100
  },
  viewIcon: {
    width: DeviceWidth * 0.2,
    height: DeviceWidth * 0.2,
    marginBottom: 10,
    marginLeft: 10
  }
});

const styleSlider = StyleSheet.create({
  wrapper: {
    height: 0,
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#92BBD9',
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  thumb: {
    width: 50,
    height: 50
  }
});

// import React from 'react';
// import {
//   Image,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { WebBrowser } from 'expo';
//
// import { MonoText } from '../components/StyledText';
//
// export default class HomeScreen extends React.Component {
//   static navigationOptions = {
//     //header: null,
//     title: 'Home',
//   };
//
//   render() {
//     return (
//       <View style={styles.container}>
//         <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//           <View style={styles.welcomeContainer}>
//             <Image
//               source={
//                 __DEV__
//                   ? require('../assets/images/robot-dev.png')
//                   : require('../assets/images/robot-prod.png')
//               }
//               style={styles.welcomeImage}
//             />
//           </View>
//
//           <View style={styles.getStartedContainer}>
//             {this._maybeRenderDevelopmentModeWarning()}
//
//             <Text style={styles.getStartedText}>AWE Get started by opening</Text>
//
//             <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
//               <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
//             </View>
//
//             <Text style={styles.getStartedText}>
//               Change this text and your app will automatically reload.
//             </Text>
//           </View>
//
//           <View style={styles.helpContainer}>
//             <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
//               <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
//             </TouchableOpacity>
//           </View>
//         </ScrollView>
//
//         <View style={styles.tabBarInfoContainer}>
//           <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>
//
//           <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
//             <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
//           </View>
//         </View>
//       </View>
//     );
//   }
//
//   _maybeRenderDevelopmentModeWarning() {
//     if (__DEV__) {
//       const learnMoreButton = (
//         <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
//           Learn more
//         </Text>
//       );
//
//       return (
//         <Text style={styles.developmentModeText}>
//           Development mode is enabled, your app will be slower but you can use useful development
//           tools. {learnMoreButton}
//         </Text>
//       );
//     } else {
//       return (
//         <Text style={styles.developmentModeText}>
//           You are not in development mode, your app will run at full speed.
//         </Text>
//       );
//     }
//   }
//
//   _handleLearnMorePress = () => {
//     WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
//   };
//
//   _handleHelpPress = () => {
//     WebBrowser.openBrowserAsync(
//       'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
//     );
//   };
// }
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   developmentModeText: {
//     marginBottom: 20,
//     color: 'rgba(0,0,0,0.4)',
//     fontSize: 14,
//     lineHeight: 19,
//     textAlign: 'center',
//   },
//   contentContainer: {
//     paddingTop: 30,
//   },
//   welcomeContainer: {
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 20,
//   },
//   welcomeImage: {
//     width: 100,
//     height: 80,
//     resizeMode: 'contain',
//     marginTop: 3,
//     marginLeft: -10,
//   },
//   getStartedContainer: {
//     alignItems: 'center',
//     marginHorizontal: 50,
//   },
//   homeScreenFilename: {
//     marginVertical: 7,
//   },
//   codeHighlightText: {
//     color: 'rgba(96,100,109, 0.8)',
//   },
//   codeHighlightContainer: {
//     backgroundColor: 'rgba(0,0,0,0.05)',
//     borderRadius: 3,
//     paddingHorizontal: 4,
//   },
//   getStartedText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     lineHeight: 24,
//     textAlign: 'center',
//   },
//   tabBarInfoContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     ...Platform.select({
//       ios: {
//         shadowColor: 'black',
//         shadowOffset: { height: -3 },
//         shadowOpacity: 0.1,
//         shadowRadius: 3,
//       },
//       android: {
//         elevation: 20,
//       },
//     }),
//     alignItems: 'center',
//     backgroundColor: '#fbfbfb',
//     paddingVertical: 20,
//   },
//   tabBarInfoText: {
//     fontSize: 17,
//     color: 'rgba(96,100,109, 1)',
//     textAlign: 'center',
//   },
//   navigationFilename: {
//     marginTop: 5,
//   },
//   helpContainer: {
//     marginTop: 15,
//     alignItems: 'center',
//   },
//   helpLink: {
//     paddingVertical: 15,
//   },
//   helpLinkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
