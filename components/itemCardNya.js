import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  View,
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Thumbnail
} from "native-base";

const DataListNya = ({ navigation, dataNya }) => {
  return (
    <Content>
    <TouchableOpacity
     onPress={() =>
       navigation.navigate("DetailBarang",
       {
         key: navigation.state.key,
         boardKey:`${JSON.stringify(dataNya.key)}`
       }
     )}>
    <Card style={{ flex: 0, margin: 5, backgroundColor: '#ddd', height: "auto", elevation: 1.8,}}>
      <CardItem>
        <Left>
          <Thumbnail source={{uri: 'https://www.barnesandnoble.com/blog/sci-fi-fantasy/wp-content/uploads/sites/4/2017/07/onepiece2.jpg'}} />
          <Body>
            <Text>{dataNya.title}</Text>
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
          <Text note>{dataNya.key}</Text>
        </Body>
        </Left>
      </CardItem>
    </Card>
    </TouchableOpacity>
    </Content>
  );
};

export default DataListNya;
