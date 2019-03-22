import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import {
  Text,
  Content,
  Card,
  CardItem,
  Body,
  Left,
  Thumbnail,
  Button,
  Icon,
} from "native-base";
import NumberFormat from 'react-number-format';

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
            <CardItem cardBody>
              <Image
                source={data.image? {uri: data.image} : require('../assets/images/no_img.jpeg')}
                style={{height: 140, width: null, flex: 1}}/>
            </CardItem>
            <CardItem style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Text>{data.title}</Text>
              <NumberFormat value={data.harga} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp'} 
              renderText={value => <Text note>{value}{"\n"}</Text>} />
            </CardItem>

            <Button block small info>
              <Icon
                name='md-cart'
                size={50}
              />
              <Text>Add to Cart</Text>
            </Button>
        </Card>
      </TouchableOpacity>
    </Content>
  );
};

export default ProductItem;
