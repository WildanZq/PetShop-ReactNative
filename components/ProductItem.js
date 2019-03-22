import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  Text,
  Content,
  Card,
  CardItem,
} from "native-base";
import NumberFormat from 'react-number-format';
import Colors from '../constants/Colors';

const ProductItem = ({ navigation, data }) => {
  return (
    <Content key={data.key} style={{ margin: 5 }}>
      <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetailBarang",
        {
          key: navigation.state.key,
          boardKey:`${JSON.stringify(data.key)}`,
          title: `${data.title}`
        }
      )}>
        <Card style={{ flex: 0, backgroundColor: '#ddd', height: "auto", elevation: 1.8,}}>
          <CardItem cardBody style={{ borderBottomWidth: 1, borderColor: Colors.divider }}>
              <Image
                source={data.image? {uri: data.image} : require('../assets/images/no_img.jpeg')}
                style={{height: 140, width: null, flex: 1}}/>
            </CardItem>
            <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start', paddingTop: 8, paddingBottom: 8, paddingLeft: 10 }}>
              <Text>{data.title}</Text>
              <NumberFormat value={data.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} 
              renderText={value => <Text note>{value}{"\n"}</Text>} />
            </CardItem>
        </Card>
      </TouchableOpacity>
    </Content>
  );
};

export default ProductItem;
