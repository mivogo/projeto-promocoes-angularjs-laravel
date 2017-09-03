import React, { Component } from "react";
import {
  Dimensions,
  Image,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ProductList from "./ProductList";
import Button from "apsl-react-native-button";

class ShoppingCart extends Component {
  static navigationOptions = {
    tabBarLabel: "Favorite Products",
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons
          name="shopping-cart"
          size={24}
          style={{ color: tintColor }}
        />
      );
    }
  };

  state = {
    token: "",
    products: '[]',
    retailer_selected: 1,
    isLoading: false,
  };

  renderHeader(headerName) {
    console.log("Render Header Menu");
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
          <Text style={styles.headerTextStyle}>
            {headerName}
          </Text>
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

  renderRetailerMenu() {
    console.log("Render Header Menu");
    return (
      <View style={{ flexDirection: "row", flex: 1 }}>
        {/* Picker Retailer */}
        <Button
          style={{ flex: 1, borderColor: "red" }}
          textStyle={{ color: "red" }}
          onPress={() => {
              this.setState({ retailer_selected: 1 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Image
              style={{ alignSelf: "stretch" }}
              source={{ uri: "http://vps415122.ovh.net/images/Continente.png" }}
            />
            <Text>99,99€</Text>
          </View>
        </Button>
        <Button
          style={{ flex: 1, borderColor: "green" }}
          textStyle={{ color: "green" }}
          onPress={() => {
              this.setState({ retailer_selected: 2 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Image
              style={{ alignSelf: "stretch" }}
              source={{ uri: "http://vps415122.ovh.net/images/Jumbo.png" }}
            />
            <Text>99,99€</Text>
          </View>
        </Button>
        <Button
          style={{ flex: 1, borderColor: "black" }}
          textStyle={{ color: "black" }}
          onPress={() => {
              this.setState({ retailer_selected: 3 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: "column", alignItems: "center" }}
          >
            <Image
              style={{ alignSelf: "stretch" }}
              source={{
                uri: "http://vps415122.ovh.net/images/Intermarche.png"
              }}
            />
            <Text>99,99€</Text>
          </View>
        </Button>
      </View>
    );
  }

  cleanCart() {
    const jsonObj = {
      products: []
    };
    AsyncStorage.setItem("@Cart", JSON.stringify(jsonObj));
    this.componentWillMount();
  }

  renderFooter() {
    console.log("Render Footer Menu");
    return (
      <View style={styles.footerStyle}>
        <Button
          onPress={() => {
            this.cleanCart();
          }}
        >
          Apagar todos
        </Button>
      </View>
    );
  }

  componentWillMount() {
    console.log("A MONTAR CARRINHO");
    this.setState({ isLoading: true });
    AsyncStorage.getItem("@Token").then(
      rtoken => {
        this.setState({ token: rtoken });
      },
      error => {
        console.log(error);
      }
    );

    AsyncStorage.getItem("@Cart").then(
      cart => {
        cart = JSON.parse(cart);
        console.log("SERGIO");
        console.log(cart);
        const json = cart.products;
        console.log("JSON");
        console.log(json);

        for (let i = 0; i < json.length; i++) {
        const url = "http://vps415122.ovh.net/api/retailer/productAvailability/"+json[i].product_id;
        
        fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          }
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log("Recebeu" + json[i].product_id);
            console.log(responseJson);
            newState = JSON.parse(this.state.products);
            responseJson.push({ product_id: json[i].product_id, quantity: json[i].quantity });
            newState.push(responseJson);         
            console.log(newState);
            this.setState({ products: JSON.stringify(newState) });
          })
          .catch(error => {
            console.error(error);
          });
        }

        this.setState({ isLoading: false });

      },
      error => {
        console.log(error);
      }
    );


  }

  renderProducts(){
    const data = JSON.parse(this.state.products);
    console.log('Rendering shit?!?!??!');
    console.log(data);
    console.log(this.state.isLoading);
    console.log(this.state.retailer_selected - 1);
    if (!this.state.isLoading) {
    return data.map(product => {
      console.log('Maia');
      if (product[(this.state.retailer_selected - 1)].available) {
        return (
        <View key={product[3].product_id}>
          <Text>{product[3].product_id}</Text>
          <Text>{product[3].quantity}</Text>
          <Text>{product[(this.state.retailer_selected - 1)].retailer_id}</Text>
        </View>); 
      }
      }
    );
  }
  }

  render() {
    console.log("RENDER FAVORITE PRODUCTS");
    console.log(this.state.token);
    return (
      <View style={{ flex: 1 }}>
        {this.renderHeader("Carrinho")}
        {this.renderRetailerMenu()}
        <ScrollView>
          {this.renderProducts()}
        </ScrollView>
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = {
  headerStyle: {
    borderWidth: 1,
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

export default ShoppingCart;
