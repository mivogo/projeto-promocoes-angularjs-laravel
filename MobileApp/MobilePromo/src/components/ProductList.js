import React, { Component } from "react";
import {
  AsyncStorage,
  ScrollView,
  Dimensions,
  View,
  ActivityIndicator
} from "react-native";
import ProductDetail from "./ProductDetail";

class ProductList extends Component {
  state = {
    favorites: []
  };
  
  componentWillMount() {
    AsyncStorage.getItem("@Token").then(
      rtoken => {
        this.getFavorites(rtoken);
      }
      );
  }


  getFavorites(token) {
    const url = "http://vps415122.ovh.net/api/profile/favorites";
    const auth = "bearer " + token;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        this.setState({ favorites: responseJson });
      })
      .catch(error => {});
  }

  width = Dimensions.get("window").width;

  renderProducts() {
    console.log(' ProductList - RenderProducts ');
    const data = this.props.products;
    const retailer = this.props.retailer;
    console.log(data);
    console.log(retailer);
      return data.map(product => (
        <ProductDetail
          retailer={retailer}
          key={product.id}
          product={product}
          favorites={this.state.favorites}
        />
      ));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {this.renderProducts()}
        </ScrollView>
      </View>
    );
  }
}

const styles = {
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  }
};

export default ProductList;
