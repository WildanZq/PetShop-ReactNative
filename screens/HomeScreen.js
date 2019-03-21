import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  NetInfo,
  RefreshControl,
  Keyboard
} from "react-native";
import { Input } from 'react-native-elements';
import {
  View,
  Text,
  Content,
  Card,
  CardItem,
  Icon,
  Left,
  Thumbnail
} from "native-base";
import Swiper from 'react-native-swiper';
import Colors from '../constants/Colors';
import firebase from "../Firebase";
import ProductItem from "../components/ProductItem";
import SearchInput from '../components/SearchInput';

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    NetInfo.isConnected.fetch().done((isConnected) => {
        if ( isConnected ) { firebase.firestore().enableNetwork(); }
        else { firebase.firestore().disableNetwork(); }
    });
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      isFetching: false,
      kataKunci: '',
      boards: []
    };
    this.ref = firebase.firestore().collection("boards");
    //firebase.firestore().collection("boards").where('title', '==', this.state.kataKunci)
  }

  static navigationOptions =  ({ navigation }) => {
      const {params = {}} = navigation.state;
       return {
         headerStyle: {
           backgroundColor: Colors.primary,
         },
         headerTitle:
           <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10 }}>
             <View style={{ flex: .125, alignItems: 'center' }}>
               <Image
                 style={{ width: 40, height: 40 }}
                 source={require('../assets/images/icon-transparent.png')}
               />
             </View>
             <View style={{ flex: .95 }} >
               <TouchableOpacity activeOpacity={1} onPress={() => console.log('search clicked')} >
               <SearchInput
               value={params.kataKunci}
               onChange={event => params.handleThis(event.nativeEvent.text) }
               selectTextOnFocus={true}
               onSubmitEditing={event => params.handleThis(event.nativeEvent.text) }
               editable={true} />
               </TouchableOpacity>
             </View>
             <View style={{ flex: .125, alignItems: 'center' }}>
               <TouchableOpacity onPress={() => console.log('cart clicked')} >
                 <Icon
                   name='md-heart'
                   size={50}
                   style={{ color: '#fff' }}
                 />
               </TouchableOpacity>
             </View>
           </View>
       }
    }

    onChangeSearch = (value) => {
      this.setState({
        kataKunci: value,
      });

      if (value.length > 0) {
        this.ref = firebase.firestore().collection('boards').orderBy('title').startAt(value).endAt(value + '\uf8ff');
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }
      else {
        this.ref = firebase.firestore().collection("boards");
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
      }
    };

  onCollectionUpdate = querySnapshot => {
    const boards = [];
    querySnapshot.forEach(doc => {
      const { title, image, kategori, harga } = doc.data();
      boards.push({
        key: doc.id,
        doc, // DocumentSnapshot
        title,
        image,
        kategori,
        harga
      });
    });
    this.setState({
      boards,
      isLoading: false
    });
  };

  componentDidMount() {
    this.props.navigation.setParams({
        handleThis: this.onChangeSearch,
        handleKeyPress: this.handleKeyPress,
    });
    this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  renderHeadLayout() {
    return (
      <View style={{ backgroundColor: '#f5f5f5' }}>
        <View style={{height:160}}>
          <Swiper showsButtons={true} autoplay={true}>
            <View style={styleSlider.slide1}>
            <Text style={styleSlider.text}>PROMOSI ke-1</Text>
            </View>
            <View style={styleSlider.slide2}>
              <Text style={styleSlider.text}>PROMOSI ke-2</Text>
            </View>
            <View style={styleSlider.slide3}>
              <Text style={styleSlider.text}>PROMOSI ke-3</Text>
            </View>
          </Swiper>
        </View>

        <Card
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "auto",
            elevation: 0,
            marginTop: 0,
            marginRight: 0,
            marginBottom: 15,
            marginLeft: 0,
            flexWrap: 'wrap',
            paddingVertical: 16,
            paddingHorizontal: 14
          }}
        >
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'adopsi'
              }
            )}>
              <Icon type="MaterialIcons" name="pets" size={18} style={{ color: '#ffc956' }} />
            </TouchableOpacity>
            <Text style={styles.menuLabel}>Adopsi</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'makanan'
              }
            )}>
              <Icon type="MaterialCommunityIcons" name="food" size={18} style={{ color: "#3ebc42" }} />
            </TouchableOpacity>
            <Text style={styles.menuLabel}>Makanan</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'aksesoris'
              }
            )}>
              <Icon type="MaterialCommunityIcons" name="tshirt-crew" size={18} style={{ color: '#d2e524' }} />
            </TouchableOpacity>
            <Text style={styles.menuLabel}>Aksesoris</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'mainan'
              }
            )}>
              <Icon type="Ionicons" name="ios-baseball" size={18} style={{ color: '#942bb5' }} />
            </TouchableOpacity>
            <Text style={styles.menuLabel}>Mainan</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'kesehatan'
              }
            )}>
              <Icon type="FontAwesome" name="stethoscope" size={18} style={{ color: '#359fa3' }} />
            </TouchableOpacity>
            <Text style={styles.menuLabel}>Kesehatan</Text>
          </View>
          <View>
            <TouchableOpacity style={styles.menuIcon}
            onPress={() =>
              this.props.navigation.navigate("KategoriBarang",
              {
                key: this.props.navigation.state.key,
                refKategori: 'suplemen'
              }
            )}>
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
      </View>
    );
  }

  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.isFetching}
            onRefresh={() => firebase.firestore().enableNetwork()}
          />
        }
        showsVerticalScrollIndicator={false}>
          {this.state.kataKunci? null: this.renderHeadLayout()}
          <View style={{ paddingLeft: 10 }}>
            <Text style={{ color: Colors.primaryText, fontSize: 15, marginTop: 20 }}>
              {this.state.kataKunci? `Hasil Pencarian: "`+this.state.kataKunci+`"`: `Rekomendasi untuk Anda`}
            </Text>
          </View>
          {this.renderProductList()}
      </ScrollView>
    );
  }

  renderProductList() {
    if (this.state.isLoading) {
      return (
        <View style={{ marginTop: 12 }}>
          <ActivityIndicator size='small' color={Colors.primary} />
        </View>
      );
    }

    return (<FlatList
      style={{ padding: 5 }}
      data={this.state.boards}
      renderItem={({ item }) => (
        <ProductItem
          navigation={this.props.navigation}
          data={item} />
      )}
      horizontal={false}
      numColumns={2}
    />);
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
    height: 50,
    fontSize: 12,
    textAlign: 'center',
    color: Colors.secondaryText
  }
});
