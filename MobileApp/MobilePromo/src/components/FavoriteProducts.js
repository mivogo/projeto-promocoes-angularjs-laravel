import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductList from "./ProductList";

class FavoriteProducts extends Component {
  static navigationOptions = {
    tabBarLabel: "Favorite Products",
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons name="favorite" size={24} style={{ color: tintColor }} />
      );
    }
  };

  state = {
    lodMode: "",
    products: [],
    favorites: [],
    isLoading: false
  };


  favoritePost(favs,token) {
    this.setState({ isLoading: true });
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
        this.setState({
          products: responseJson,
          favorites: favs,
          isLoading: false
        });
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }


  getFavorites(token) {
    this.setState({ isLoading: true });
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
        this.favoritePost(responseJson, token);
      });
  }

  componentWillMount() {
    AsyncStorage.getItem("@LogMode").then(logMode => {
      this.setState({ logMode: logMode });
      AsyncStorage.getItem("@Token").then(
        rtoken => {
          this.getFavorites(rtoken);
        },
        error => {}
      );
    });
  }

  renderHeader(headerName) {
    return (
      <View style={styles.headerStyle}>
        {/* Menu icon and click action */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("DrawerOpen")}
        >
          <MaterialIcons
            name="menu"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "center"
          }}
        >
          <Text style={styles.headerTextStyle}>{headerName}</Text>
        </View>

        {/* Search Menu */}
        <View>
          <TouchableOpacity
            onPress={() => {
              this.componentWillMount();
            }}
          >
            <MaterialIcons
              name="refresh"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader("Produtos Favoritos")}
          <ActivityIndicator
            size="large"
            style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}
          />
        </View>
      );
    }
    if (this.state.logMode == "Visitor") {
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader("Produtos Favoritos")}
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <View>
              <MaterialIcons
                name="warning"
                size={24}
                style={{ color: "red" }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 20, textAlign: "center" }}>
                Funcionalidade apenas disponível para utilizadores loggados
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader("Produtos Favoritos")}
          <ProductList
            products={this.state.products}
            favorites={this.state.favorites}
          />
        </View>
      );
    }
  }
}

const styles = {
  headerStyle: {
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: "relative"
  },
  headerTextStyle: {
    fontSize: 20
  }
};

export default FavoriteProducts;
