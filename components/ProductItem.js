import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Thumbnail
} from "native-base";

const ProductItem = ({ navigation, data }) => {
  return (
    <Content key={data.key} style={{ margin: 5 }}>
      <TouchableOpacity
      onPress={() =>
        navigation.navigate("DetailBarang",
        {
          key: navigation.state.key,
          boardKey:`${JSON.stringify(data.key)}`
        }
      )}>
        <Card style={{ flex: 0, backgroundColor: '#ddd', height: "auto", elevation: 1.8,}}>
          <CardItem cardBody>
            <Image
              source={{ uri: 'https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA4OC85MTEvb3JpZ2luYWwvZ29sZGVuLXJldHJpZXZlci1wdXBweS5qcGVn'}}
              style={{height: 140, width: null, flex: 1}}/>
          </CardItem>
          <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text>{data.title}</Text>
            <Text note>Rp 800.000</Text>
          </CardItem>
        </Card>
      </TouchableOpacity>
    </Content>
  );
};

export default ProductItem;
