import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  NetInfo,
  RefreshControl
} from "react-native";
import {
  View,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Icon,
  Left,
  Thumbnail
} from "native-base";

import Colors from '../constants/Colors';
import firebase from "../Firebase";
import SearchInput from '../components/SearchInput';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: Colors.primary,
    },
    headerTitle:
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
        <View style={{ flex: .125, alignItems: 'center' }}>
          <Image
            style={{ width: 35, height: 35 }}
            source={require('../assets/images/icon-transparent.png')}
          />
        </View>
        <View style={{ flex: .75 }} >
          <TouchableOpacity activeOpacity={1} onPress={() => console.log('search clicked')} >
            <SearchInput editable={false} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: .125, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => console.log('cart clicked')} >
            <Icon
              name='md-cart'
              size={50}
              style={{ color: '#fff' }}
            />
          </TouchableOpacity>
        </View>
      </View>
  };

  constructor() {
    super();
    this.ref = firebase.firestore().collection("boards");
    NetInfo.isConnected.fetch().done((isConnected) => {
        if ( isConnected ) { firebase.firestore().enableNetwork(); }
        else { firebase.firestore().disableNetwork(); }
    });
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      isFetching: false,
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

  componentWillUnmount() {
    this.isCancelled = true;
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
          <Text note>{item.key}</Text>
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
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isFetching}
            onRefresh={() => firebase.firestore().enableNetwork()}
          />
        }
        showsVerticalScrollIndicator={false} >
          <Card
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: "auto",
              marginTop: 0,
              marginRight: 0,
              marginLeft: 0,
              flexWrap: 'wrap',
              paddingVertical: 16,
              paddingHorizontal: 14
            }}
          >
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialIcons" name="pets" size={18} style={{ color: '#ffc956' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Adopsi</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialCommunityIcons" name="food" size={18} style={{ color: "#3ebc42" }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Makanan</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialCommunityIcons" name="tshirt-crew" size={18} style={{ color: '#d2e524' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Aksesoris</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="Ionicons" name="ios-baseball" size={18} style={{ color: '#942bb5' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Mainan</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="FontAwesome" name="stethoscope" size={18} style={{ color: '#359fa3' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Kesehatan</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialCommunityIcons" name="pill" size={18} style={{ color: '#c62121' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Suplemen</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialCommunityIcons" name="lightbulb-on-outline" size={18} style={{ color: '#147cd1' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Tips</Text>
            </View>
            <View>
              <TouchableOpacity style={styles.menuIcon}>
                <Icon type="MaterialCommunityIcons" name="dog-side" size={18} style={{ color: '#a58c0b' }} />
              </TouchableOpacity>
              <Text style={styles.menuLabel}>Terlantar</Text>
            </View>
          </Card>

          <View>
            <Text>{"\n\n"} Recommended for you{"\n"}</Text>
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
    borderColor: Colors.divider,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    width: 50,
    height: 50,
    marginTop: 10,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 0
  },
  menuLabel: {
    marginTop: 2,
    marginBottom: 10,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.secondaryText
  }
});
