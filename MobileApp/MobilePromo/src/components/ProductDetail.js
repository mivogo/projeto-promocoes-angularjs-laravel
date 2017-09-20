import React, { Component } from "react";
import {
  AsyncStorage,
  View,
  Text,
  Image,
  Dimensions
} from "react-native";
import Card from "./Card";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CardSection from "./CardSection";
import Button from "apsl-react-native-button";

class ProductDetail extends Component {
  state = {
    quantity: '0',
    logMode: '',
    isFavorite: false
  };

  addRemoveFavorite() {
    if (this.state.isFavorite) {
      const url =
        "http://vps415122.ovh.net/api/profile/favorites/" +
        this.props.product.product_id;
      const auth = "bearer " + this.state.token;
      
      
      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          
          this.setState({ isFavorite: false });
        })
        .catch(error => {
          
        });
    } else {
      const url =
        "http://vps415122.ovh.net/api/profile/favorites/" +
        this.props.product.product_id;
      const auth = "bearer " + this.state.token;
      
      
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth
        }
      })
        .then(response => response.json())
        .then(responseJson => {
          
          this.setState({ isFavorite: true });
        })
        .catch(error => {
          
        });
    }
  }

  checkIsFavorite(nextProps) {
    for (let i = 0; i < nextProps.favorites.length; i++) {
      if (this.props.product.product_id == nextProps.favorites[i].product_id) {
        
        this.setState({ isFavorite: true });
      }
    }
  }

  checkIsInCart() {
    AsyncStorage.getItem("@Cart").then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        for (let i = 0; i < json.length; i++) {
          if (this.props.product.product_id == json[i].product_id) {
            this.setState({ quantity: json[i].quantity });
          }
        }
      },
      error => {
        
      }
    );
  }

  addProduct() {
    AsyncStorage.getItem("@Cart").then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        for (let i = 0; i < json.length; i++) {
          if (this.props.product.product_id == json[i].product_id) {
            json[i].quantity = json[i].quantity + 1;
            cart.products = json;
            AsyncStorage.setItem("@Cart", JSON.stringify(cart));
            this.setState({ quantity: json[i].quantity });
          }
        }
      },
      error => {
        
      }
    );
  }

  subProduct() {
    AsyncStorage.getItem("@Cart").then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;

        for (let i = 0; i < json.length; i++) {
          if (this.props.product.product_id == json[i].product_id) {
            if (this.state.quantity > 1) {
              json[i].quantity = json[i].quantity - 1;
              cart.products = json;
              AsyncStorage.setItem("@Cart", JSON.stringify(cart));
              this.setState({ quantity: json[i].quantity });
            } else {
              json.splice(i, 1);
              cart.products = json;
              AsyncStorage.setItem("@Cart", JSON.stringify(cart));
              this.setState({ quantity: 0 });
            }
          }
        }
      },
      error => {
        
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.favorites !== "") {
      this.checkIsFavorite(nextProps);
    }
    this.setState({ retailer: nextProps.retailer });
  }

  componentDidMount() {
    AsyncStorage.getItem("@LogMode").then(logMode => {
      this.setState({ logMode: logMode });
    });
    this.checkIsInCart();
  }

  convertRetailer(retailerName){
    if(retailerName == 'Continente'){
      return 1;
    }
    if(retailerName == 'Jumbo'){
      return 2;
    } else {
      return 3;
    }
  }

  renderButtonCart() {
    const newPrice = this.props.product.price.toString().replace(".", ",");
    const multPrice = (this.props.product.price * this.state.quantity)
      .toFixed(2)
      .toString()
      .replace(".", ",");
    if (this.state.quantity == 0) {
      return (
        <Button
          style={{ borderColor: "green" }}
          onPress={() => {
            AsyncStorage.getItem("@Cart").then(
              cart => {
                cart = JSON.parse(cart);
                let products = JSON.parse(
                  '{ "quantity": ' +
                    1 +
                    ', "product_id": "' +
                    this.props.product.product_id + 
                    '", "retailer_id": ' + this.convertRetailer(this.props.product.retailer) +
                    ' }'
                );
                cart['products'].push(products);
                AsyncStorage.setItem("@Cart", JSON.stringify(cart));
                this.setState({ quantity: 1 });
              },
              error => {
                
              }
            );
          }}
        >
          <MaterialIcons
            name="add-shopping-cart"
            size={30}
            style={{ color: "green" }}
          />
        </Button>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
          <Button
            style={{ borderColor: 'green' }}
            onPress={() => {
              this.subProduct();
            }}
          >
            <MaterialIcons name='remove' size={50} style={{ color: 'green' }} />
          </Button>

          <Button style={{ borderColor: 'green', flex: 1 }}>
            <View
              style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}
            >
              <Text>
                {this.state.quantity} uni
              </Text>
              <Text>
                {multPrice}€
              </Text>
            </View>
          </Button>

          <Button
            style={{ borderColor: "green" }}
            onPress={() => {
              this.addProduct();
            }}
          >
            <MaterialIcons name="add" size={50} style={{ color: "green" }} />
          </Button>
        </View>
      );
    }
  }

  renderButtonFavorite() {
    if (this.state.logMode != 'Visitor') {
    if (this.state.isFavorite) {
      return (
        <Button
          style={{ borderColor: "red" }}
          onPress={() => {
            AsyncStorage.getItem("@Token").then(
              rtoken => {
                this.setState({ token: rtoken });
                this.addRemoveFavorite();
              },
              error => {
                
              }
            );
          }}
        >
          <MaterialIcons name="favorite" size={30} style={{ color: "red" }} />
        </Button>
      );
    } else {
      return (
        <Button
          style={{ borderColor: "red" }}
          onPress={() => {
            AsyncStorage.getItem("@Token").then(
              rtoken => {
                this.setState({ token: rtoken });
                this.addRemoveFavorite();
              },
              error => {
                
              }
            );
          }}
        >
          <MaterialIcons
            name="favorite-border"
            size={30}
            style={{ color: "red" }}
          />
        </Button>
      );
    }
  }
  }

  render() {
    const {
      name,
      brand,
      category,
      image,
      link,
      price,
      base_price,
      weight,
      weight_type,
      price_weight,
      type_weight,
      hasDiscount,
      subcategory
    } = this.props.product;
    const {
      thumbnailStyle,
      headerContentStyle,
      thumbnailContainerStyle,
      headerTextStyle,
      buttonStyle
    } = styles;

    const newPrice = price.toString().replace(".", ",");
    const newPriceWeight = price_weight.toString().replace(".", ",");
    const newBasePrice = base_price.toString().replace(".", ",");
    if(hasDiscount == 1){
    return (
      <Card>
        <CardSection>
          <View style={thumbnailContainerStyle}>
            <Image style={thumbnailStyle} source={{ uri: image }}>
              <View style={{ 
                backgroundColor: 'red', 
                borderRadius: 5, 
                borderWidth: 1, 
                borderColor: 'darkred', 
                height: 50, 
                width: 50, 
                alignItems: 'center', 
                justifyContent: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
                marginLeft: 3
                 }}>
                <Text style={{ color: 'white', fontSize: 20 }}>
                  {((1-(price/base_price))*100).toFixed(0)}%
                </Text>
              </View>
              </Image>
          </View>
          <View style={headerContentStyle}>
          <Text style={{ fontWeight: "bold" }}>
                  {brand}
                </Text>
                <Text style={{ fontSize: 20 }}>
                  {name}
                </Text>
                <Text>
                  ({
                    weight
                  }{" "}
                  {
                    weight_type
                  })
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end'}}>
                <View style={{ justifyContent: 'flex-end' }}>
                  <Text style={{ textDecorationLine: 'line-through' }}>
                    {newBasePrice} €</Text>
                  </View>
                  <View style={{ flex: 1 }} />
                </View>
                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>
                    {newPrice} €
                    </Text>
                  </View>
                  
                  <View style={{ flex: 1 }} />

                  <View style={{ justifyContent: 'flex-end' }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {newPriceWeight} €/{type_weight} </Text>
                  </View>
                </View>
          </View>
        </CardSection>
        <View style={buttonStyle}>
          <CardSection>
            {/* Botão de Adicionar */}
            {this.renderButtonCart()}
            {this.renderButtonFavorite()}
          </CardSection>
        </View>
      </Card>
    );
  } else {
    return (
      <Card>
        <CardSection>
          <View style={thumbnailContainerStyle}>
            <Image style={thumbnailStyle} source={{ uri: image }} />
          </View>
          <View style={headerContentStyle}>

          <Text style={{ fontWeight: "bold" }}>
                  {brand}
                </Text>
                <Text style={{ fontSize: 20 }}>
                  {name}
                </Text>
                <Text>
                  ({
                    weight
                  }{" "}
                  {
                    weight_type
                  })
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', alignSelf: 'flex-end'}}>
                  <View style={{ justifyContent: 'flex-end' }}>
                    <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }}>
                    {newPrice} €
                    </Text>
                  </View>
                  
                  <View style={{ flex: 1 }} />
                  <View style={{ justifyContent: 'flex-end' }}>
                  <Text style={{ fontWeight: 'bold' }}>
                   {newPriceWeight} €/{type_weight}</Text>
                  </View>
                </View>
          </View>
        </CardSection>
        <View style={buttonStyle}>
          <CardSection>
            {/* Botão de Adicionar */}
            {this.renderButtonCart()}
            {this.renderButtonFavorite()}
          </CardSection>
        </View>
      </Card>
    );
  }
}
}

const styles = {
  buttonStyle: {
    justifyContent: "flex-end"
  },
  headerContentStyle: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-around"
  },
  headerTextStyle: {
    fontSize: 18
  },
  thumbnailStyle: {
    height: 100,
    flex: 1,
    width: Dimensions.get("window").width / 2 - 20
  },
  thumbnailContainerStyle: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10
  }
};

export default ProductDetail;
