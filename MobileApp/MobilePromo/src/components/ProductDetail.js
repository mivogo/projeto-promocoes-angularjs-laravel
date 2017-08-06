import React from 'react';
import { View, Text, Image, Linking } from 'react-native';
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';

const ProductDetail = ({ product }) => {
  const { name, category, image, link, price, subcategory} = product;
  const {
    thumbnailStyle,
    headerContentStyle,
    thumbnailContainerStyle,
    headerTextStyle,
    imageStyle
  } = styles;

  const newPrice = price.toString().replace('.', ',');

    return (
      <Card>

        <CardSection>
          <View style={thumbnailContainerStyle}>
            <Image
              style={thumbnailStyle}
              source={{ uri: image }}
            />
          </View>
          <View style={headerContentStyle}>
            <Text style={headerTextStyle}>{name}</Text>
            <Text>{category} > {subcategory}</Text>
            <Text>{newPrice}€/un</Text>
          </View>
        </CardSection>

        {/*
        <CardSection>
          <Image
          source={{ uri: image }}
          style={imageStyle}
          />
        </CardSection>

        <CardSection>
          <Button onPress={() => Linking.openURL(link)}>
            Buy Now
          </Button>
        </CardSection>
        */}

      </Card>
    );
};

const styles = {
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 100,
    width: 100
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  imageStyle: {
    height: 300,
    flex: 1,
    width: null
  }
};

export default ProductDetail;
