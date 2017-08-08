import React from 'react';
import { View, Text, Image, Linking, Dimensions } from 'react-native';
import Card from './Card';
import CardSection from './CardSection';
import Button from './Button';

const ProductDetail = ({ product }) => {
  const { name, category, image, link, price, weight, weight_type, price_weight, type_weight, subcategory } = product;
  const {
    thumbnailStyle,
    headerContentStyle,
    thumbnailContainerStyle,
    headerTextStyle,
    buttonStyle
  } = styles;

  const newPrice = price.toString().replace('.', ',');
  const newPriceWeight = price_weight.toString().replace('.', ',');


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
            <Text>{weight}{weight_type}</Text>
            <Text>{newPrice}€/un ({newPriceWeight}€/{type_weight})</Text>
          </View>
        </CardSection>
        <View style={buttonStyle}>
          <CardSection>
            <Button
            onPress={() => Linking.openURL(link)}
            >
              Adicionar ao carrinho
            </Button>
          </CardSection>
        </View>
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
  buttonStyle: {
    justifyContent: 'flex-end'
  },
  headerContentStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 100,
    flex: 1,
    width: (Dimensions.get('window').width / 2) - 20
  },
  thumbnailContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    marginRight: 10
  }
};

export default ProductDetail;
