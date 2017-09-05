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
  state = { products: [], favorites: [], token: "", retailer: 1, isLoading: false };

  componentWillReceiveProps(nextProps) {
    AsyncStorage.getItem("@Token").then(
      rtoken => {
        this.getFavorites(rtoken);
      },
      error => {
        console.log(error);
      }
    );

    this.getFavorites();

    if (nextProps.isItLoading) {
      this.setState({ isLoading: true });
    } else {
      this.setState({ isLoading: false });
    }
    this.setState({ products: nextProps.products, retailer: nextProps.retailer });
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
        console.log("Recebeu favoritos");
        this.setState({ favorites: responseJson, isLoading: false });
      })
      .catch(error => {
        console.error(error);
      });
  }

  width = Dimensions.get("window").width;

  renderProducts() {
    console.log(" Render Products -------------------------------------");
    const data = this.state.products;
    if (!this.state.isLoading) {
      return data.map(product =>
        <ProductDetail
          retailer={this.state.retailer}
          key={product.id}
          product={product}
          favorites={this.state.favorites}
        />
      );
    }
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
      />
    );
  }

  render() {
    console.log(" RENDER RENDER");
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around"
  }
};

export default ProductList;
