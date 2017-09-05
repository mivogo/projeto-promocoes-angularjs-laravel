import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Button from 'apsl-react-native-button';

class ShoppingCart extends Component {
  static navigationOptions = {
    tabBarLabel: 'Favorite Products',
    drawerIcon: ({ tintColor }) => (
        <MaterialIcons
          name="shopping-cart"
          size={24}
          style={{ color: tintColor }}
        />
      )
  };

  state = {
    token: '',
    noProducts: false,
    products: '[]',
    productToSubstitute: 0,
    retailer_selected: 1,
    isLoading: false,
    price_1: 0,
    price_2: 0,
    price_3: 0,
    showNameMenu: false,
    showReplaceMenu: false,
    name: '',
    description: ''
  };

  addProduct(product_id, quantity) {
    this.setState({ isLoading: true });
    AsyncStorage.getItem('@Cart').then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        for (let i = 0; i < json.length; i++) {
          if (product_id == json[i].product_id) {
            json[i].quantity = json[i].quantity + 1;
            cart.products = json;
            AsyncStorage.setItem('@Cart', JSON.stringify(cart));
            this.setState({ products: '[]' });
            this.componentWillMount();
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  removeProduct(product_id) {
    this.setState({ isLoading: true });
    AsyncStorage.getItem('@Cart').then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        for (let i = 0; i < json.length; i++) {
          if (product_id != json[i].product_id) {
            json.splice(i,1);
            console.log('Inesremove');
            console.log(json);
            cart.products = json;
            AsyncStorage.setItem('@Cart', JSON.stringify(cart));
            this.setState({ products: '[]' });
            this.componentWillMount();
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  substituteProduct(product_id) {
    this.setState({ isLoading: true });
    AsyncStorage.getItem('@Cart').then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        let repeated = 0;
          for (let i = 0; i < json.length; i++) {
            if (product_id == json[i].product_id) {
              repeated = 1;
              json[i].quantity = json[i].quantity + 1;
              cart.products = json;
              AsyncStorage.setItem('@Cart', JSON.stringify(cart));
              this.removeProduct(this.state.productToSubstitute);
              this.setState({ products: '[]', showReplaceMenu: false });
              this.componentWillMount();
              }
            }
          if (repeated == 0) {
          for (let i = 0; i < json.length; i++) {
            if (this.state.productToSubstitute == json[i].product_id) {
              json[i].product_id = product_id;
              json[i].retailer_id = this.state.retailer_selected;
              cart.products = json;
              AsyncStorage.setItem('@Cart', JSON.stringify(cart));
              this.setState({ products: '[]', showReplaceMenu: false });
              this.componentWillMount();
              }
            }
          }
      },
      error => {
        console.log(error);
      }
    );
  }

  subProduct(product_id, quantity) {
    this.setState({ isLoading: true });
    AsyncStorage.getItem('@Cart').then(
      cart => {
        cart = JSON.parse(cart);
        const json = cart.products;
        for (let i = 0; i < json.length; i++) {
          if (product_id == json[i].product_id) {
            if (quantity > 1) {
              json[i].quantity = json[i].quantity - 1;
              cart.products = json;
              AsyncStorage.setItem('@Cart', JSON.stringify(cart));
              this.setState({ products: '[]' });
              this.componentWillMount();
            } else {
              json.splice(i, 1);
              console.log('Ines');
              console.log(json);
              cart.products = json;
              AsyncStorage.setItem('@Cart', JSON.stringify(cart));
              this.setState({ products: '[]' });
              this.componentWillMount();
            }
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  cleanCart() {
    const jsonObj = {
      products: []
    };
    this.setState({ products: '[]' });
    AsyncStorage.setItem('@Cart', JSON.stringify(jsonObj));
    this.componentWillMount();
  }

  renderRetailerMenu() {
    console.log('Render Header Menu');
    return (
      <View style={{ flexDirection: 'row' }}>
        {/* Picker Retailer */}
        <Button
          style={{ flex: 1, borderColor: 'red', margin: 5 }}
          textStyle={{ color: 'red' }}
          isLoading={this.state.isLoading}
          onPress={() => {
              this.setState({ retailer_selected: 1 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}
          >
            <Image
              style={{ height: 17, width: 100 }}
              resizeMode='contain'
              source={{ uri: 'http://vps415122.ovh.net/images/Continente.png' }}
            />
            <Text>{this.state.price_1.toFixed(2).toString().replace('.', ',')}€</Text>
          </View>
        </Button>
        <Button
          style={{ flex: 1, borderColor: 'green', margin: 5 }}
          textStyle={{ color: 'green' }}
          isLoading={this.state.isLoading}
          onPress={() => {
              this.setState({ retailer_selected: 2 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}
          >
            <Image
              style={{ height: 17, width: 50 }}
              resizeMode='contain'
              source={{ uri: 'http://vps415122.ovh.net/images/Jumbo.png' }}
            />
            <Text>{this.state.price_2.toFixed(2).toString().replace('.', ',')}€</Text>
          </View>
        </Button>
        <Button
          style={{ flex: 1, borderColor: 'black', margin: 5 }}
          textStyle={{ color: 'black' }}
          isLoading={this.state.isLoading}
          onPress={() => {
              this.setState({ retailer_selected: 3 });
            }}
        >
          <View
            style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}
          >
            <Image
            style={{ height: 19, width: 60 }}
            resizeMode='contain'
              source={{
                uri: 'http://vps415122.ovh.net/images/Intermarche.png'
              }}
            />
            <Text>{this.state.price_3.toFixed(2).toString().replace('.', ',')}€</Text>
          </View>
        </Button>
      </View>
    );
  }

  renderHeader(headerName) {
    console.log('Render Header Menu');
    return (
      <View style={styles.headerStyle}>
        {/* Menu icon and click action */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('DrawerOpen')}
        >
          <MaterialIcons
            name="menu"
            size={40}
            style={{ color: 'black', padding: 5 }}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <View
          style={{
            position: 'relative',
            flexDirection: 'row',
            justifyContent: 'center',
            flex: 1,
            alignItems: 'center'
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
              this.setState({ products: '[]' });
              this.componentWillMount();
            }}
          >
            <MaterialIcons
              name="refresh"
              size={40}
              style={{ color: 'black', padding: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderReplace(productId, price, quantity, numberSuggestions) {
    if(numberSuggestions > 0){
    return (
    <View style={{ flex: 1 }}>

    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
      <Button
        style={{ borderColor: 'red', marginLeft: 2, marginRight: 2, flex: 1 }}
        isDisabled={true}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name='warning' size={40} style={{ color: 'red', margin: 2 }} />
          <Text style={{ margin: 2 }}>Indisponível </Text>
        </View>
      </Button>
    </View>

    <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
      <Button
        style={{ borderColor: 'green', marginLeft: 2, marginRight: 2, flex: 1 }}
        onPress={() => {
          this.setState({ productToSubstitute: productId, showReplaceMenu: true });
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name='refresh' size={40} style={{ color: 'green', margin: 2 }} />
          <Text style={{ margin: 2 }}>Trocar </Text>
          </View>
      </Button>

      <Button
        style={{ borderColor: 'darkred', marginRight: 2, flex: 1 }}
        onPress={() => {
          this.removeProduct(productId, quantity);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name='remove' size={40} style={{ color: 'darkred', margin: 2 }} />
          <Text style={{ margin: 2 }}>Remover </Text>
          </View>
      </Button>
    </View>
    </View>);
  }
  return (
  <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
    <Button
      style={{ borderColor: 'red', marginLeft: 2, marginRight: 2, flex: 1 }}
      isDisabled={true}
    >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <MaterialIcons name='warning' size={40} style={{ color: 'red', margin: 2 }} /> 
      <Text>Indisponível </Text>
    </View>
    </Button>
  <Button
        style={{ borderColor: 'darkred', marginRight: 2, flex: 1 }}
        onPress={() => {
          this.addProduct(productId, quantity);
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcons name='remove' size={40} style={{ color: 'darkred' , margin: 2  }} />
          <Text style={{ margin: 2 }}>Remover </Text>
          </View>
      </Button>
  </View>);
  }

  renderQuantity(productId, price, quantity) {
    const multPrice = (price * quantity)
    .toFixed(2)
    .toString()
    .replace('.', ',');
    return (<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
    <Button
      style={{ borderColor: 'green' }}
      onPress={() => {
        this.subProduct(productId, quantity);
      }}
    >
      <MaterialIcons name='remove' size={50} style={{ color: 'green' }} />
    </Button>

    <Button style={{ borderColor: 'green', flex: 1 }}>
      <View
        style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}
      >
        <Text>
          {quantity} uni
        </Text>
        <Text>
          {multPrice} €
        </Text>
      </View>
    </Button>

    <Button
      style={{ borderColor: 'green' }}
      onPress={() => {
        this.addProduct(productId, quantity);
      }}
    >
      <MaterialIcons name='add' size={50} style={{ color: 'green' }} />
    </Button>
  </View>);
  }

  renderNameMenu() {
    console.log("Render Search Menu");
    return (
      <View style={styles.nameMenuStyle}>
        <View
          style={{
            padding: 10,
            borderColor: "blue",
            borderWidth: 1,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontSize: 30 }}>Guardar Lista:</Text>
          <TextInput
            style={styles.inputStyle}
            onChangeText={text => this.setState({ name: text })}
            defaultValue={this.state.name}
            placeholder="Nome"
          />

          <TextInput
            style={styles.inputStyle}
            onChangeText={text => this.setState({ description: text })}
            defaultValue={this.state.description}
            placeholder="Descrição"
          />

          <Button
            onPress={() => {
              this.saveList();
            }}
            style={styles.inputStyle}
            isLoading={this.state.isLoading}
          >
            <Text>Registar</Text>
          </Button>
        </View>
      </View>
    );
  }

  saveList(){
    console.log("SAVE LIST");
    console.log(this.state.products);
    let jsonToSend =  JSON.parse('{ "name": "' + this.state.name + '",' +
    '"description": "' + this.state.description + '",' +
    '"retailer_id": "' + this.state.retailer_selected + '",' +
    '"products": []}');
    console.log(jsonToSend);
    let mountedProducts = JSON.parse(this.state.products);
    for (let i = 0; i < mountedProducts.length; i++) {
      console.log(mountedProducts[i]);
      if (mountedProducts[i][this.state.retailer_selected - 1].available) {
        console.log(mountedProducts[i][this.state.retailer_selected - 1].product.name);
        console.log(mountedProducts[i][this.state.retailer_selected - 1].product.product_id);
        console.log(mountedProducts[i][3].quantity);
        console.log(jsonToSend['products']);
        jsonToSend['products'].push({ id: mountedProducts[i][this.state.retailer_selected - 1].product.product_id, quantity: mountedProducts[i][3].quantity });
      }
    }
    console.log(jsonToSend);
    const url = 'http://vps415122.ovh.net/api/profile/shoppinglist';
    const auth = "bearer " + this.state.token;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth
      },
      body: JSON.stringify(jsonToSend)
    })
      .then(response => response.json())
      .then(responseJson => {
        Alert.alert(
          'Lista guardada',
          'Poderá consultar a lista sempre que quiser na opção "Listas guardadas',
          [
            {text: 'OK', onPress: () => this.setState({showNameMenu: false})},
          ]
        );
      })
      .catch(error => {
        console.log(error);
      });
}

  renderFooter() {
    console.log('Render Footer Menu');
    return (
      <View>
        <View>
        <Button
          style={{ borderColor: "blue" }}
          textStyle={{ color: "blue" }}
          onPress={() => {
            this.setState({ showNameMenu: true });
          }}
        >
          Guardar Lista
        </Button>
        </View>
        <View>
        <Button
          style={{ borderColor: "red" }}
          textStyle={{ color: "red" }}
          onPress={() => {
            this.cleanCart();
          }}
        >
          Limpar Lista
        </Button>
        </View>
      </View>
    );
  }

  componentWillMount() {
    console.log('A MONTAR CARRINHO');
    this.setState({ isLoading: true, price_1: 0, price_2: 0, price_3: 0 });
    AsyncStorage.getItem('@Token').then(
      rtoken => {
        this.setState({ token: rtoken });
      },
      error => {
        console.log(error);
      }
    );

    AsyncStorage.getItem('@Cart').then(
      cart => {
        cart = JSON.parse(cart);
        console.log('SERGIO');
        console.log(cart);
        const json = cart.products;
        console.log('JSON');
        console.log(json);
        if (json.length == 0){
          this.setState({ noProducts: true, isLoading: false });
        } 
        for (let i = 0; i < json.length; i++) {
        const url = 'http://vps415122.ovh.net/api/retailer/productAvailability/' + json[i].product_id;
        
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
          .then(response => response.json())
          .then(responseJson => {
            console.log('Recebeu' + json[i].product_id);
            console.log(responseJson);
            const newState = JSON.parse(this.state.products);
            responseJson.push({ product_id: json[i].product_id, quantity: json[i].quantity, retailer_id: json[i].retailer_id });
            newState.push(responseJson);         
            console.log(newState);
            let newPrice1 = 0;
            let newPrice2 = 0;
            let newPrice3 = 0;
            if (responseJson[0].available) {
              newPrice1 = this.state.price_1 + (responseJson[0].product.price * responseJson[3].quantity);
              this.setState({ price_1: newPrice1 });
            }
            if (responseJson[1].available) {
              newPrice2 = this.state.price_2 + (responseJson[1].product.price * responseJson[3].quantity);
              this.setState({ price_2: newPrice2 });
            }
            if (responseJson[2].available) {
              newPrice3 = this.state.price_3 + (responseJson[2].product.price * responseJson[3].quantity);
              this.setState({ price_3: newPrice3 });
            }
            if (i == (json.length - 1)) {
              newState.sort();
              this.setState({ isLoading: false, products: JSON.stringify(newState) });
            } else {
              newState.sort();
              this.setState({ products: JSON.stringify(newState) });
            }
          })
          .catch(error => {
            console.error(error);
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  renderProducts() {
    const data = JSON.parse(this.state.products);
    console.log('Rendering shit?!?!??!');
    console.log(data);
    console.log(this.state.isLoading);
    console.log(this.state.retailer_selected - 1);
    if (!this.state.isLoading) {
    return data.map(product => {
      console.log('Maia');
      if (product[(this.state.retailer_selected - 1)].available) {
        console.log(product[this.state.retailer_selected - 1].product.image);
        return (
        <View key={product[3].product_id} style={styles.BoxStyle}>
          <View>
            <Image style={styles.thumbnailStyle} source={{ uri: product[this.state.retailer_selected - 1].product.image }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{fontWeight: 'bold'}}>{product[this.state.retailer_selected - 1].product.brand}</Text>
            <Text style={{fontSize: 20}}>{product[this.state.retailer_selected - 1].product.name}</Text>
            <Text>({product[this.state.retailer_selected - 1].product.weight} {product[this.state.retailer_selected - 1].product.weight_type})</Text>
            <Text style={{fontWeight: 'bold', color: 'red'}}>{product[this.state.retailer_selected - 1].product.price} €</Text>
            {this.renderQuantity(product[3].product_id, product[this.state.retailer_selected - 1].product.price, product[3].quantity)}
          </View>
        </View>); 
      }
      return (
        <View key={product[3].product_id} style={styles.BoxStyle}>
          <View>
            <Image style={styles.thumbnailUnavailableStyle} source={{ uri: product[product[3].retailer_id - 1].product.image }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{product[product[3].retailer_id - 1].product.brand}</Text>
            <Text style={{ fontSize: 20 }}>{product[product[3].retailer_id - 1].product.name}</Text>
            <Text>({product[product[3].retailer_id - 1].product.weight} {product[product[3].retailer_id - 1].product.weight_type})</Text>
            <Text style={{ fontWeight: 'bold' }}>{product[product[3].retailer_id - 1].product.price} €</Text>
            {this.renderReplace(product[3].product_id, product[product[3].retailer_id - 1].product.price, product[3].quantity, product[this.state.retailer_selected - 1].suggestions.length)}
          </View>
        </View>); 
      }
    );
  }
  }

  renderReplaceMenu() {
    console.log("RENDERREPLACEMENU");
    const data = JSON.parse(this.state.products);
    console.log(data);
    for (let i = 0; i < data.length; i++) {
      console.log(data[i][3].product_id + ' - ' + this.state.productToSubstitute);
      if (data[i][3].product_id == this.state.productToSubstitute) {
        console.log('Toby222222');
        console.log(data[i][this.state.retailer_selected - 1]);
        console.log(data[i][this.state.retailer_selected - 1].suggestions);
        const suggestions = data[i][this.state.retailer_selected - 1].suggestions;
        return suggestions.map(suggestion => {
        return (
        <View key={suggestion.product_id} style={styles.BoxStyle}>
          <View>
            <Image style={styles.thumbnailStyle} source={{ uri: suggestion.image }} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold' }}>{suggestion.brand}</Text>
            <Text style={{ fontSize: 20 }}>{suggestion.name}</Text>
            <Text>({ suggestion.weight } {suggestion.weight_type})</Text>
            <Text style={{ fontWeight: 'bold', color: 'red' }}>{suggestion.price} €</Text>
            <View style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <Button
                style={{ borderColor: 'green', marginLeft: 2, marginRight: 2, flex: 1 }}
                onPress={() => {
                  this.substituteProduct(suggestion.product_id);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialIcons name='refresh' size={40} style={{ color: 'green', margin: 2 }} />
                  <Text style={{ margin: 2 }}>Trocar </Text>
                  </View>
              </Button>
            </View>
          </View>
        </View>);
        });
      }
    }
  }

  render() {
    console.log('RENDER FAVORITE PRODUCTS');
    console.log(this.state.token);
    if(this.state.noProducts){
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader('Carrinho')}
          {this.renderRetailerMenu()}
          <Text>Não há produtos no carrinho</Text>
          {this.renderFooter()}
        </View>
      );
    }
    return (
      
      <View style={{ flex: 1 }}>
         <Modal
          animationType={'fade'}
          visible={this.state.showNameMenu}
          transparent={true}
          onRequestClose={() =>
            this.setState({ showNameMenu: !this.state.showNameMenu })}
        >
          {this.renderNameMenu()}
        </Modal>
        <Modal
          animationType={'fade'}
          visible={this.state.showReplaceMenu}
          onRequestClose={() =>
            this.setState({ showReplaceMenu: !this.state.showReplaceMenu })}
        >
          <View style={{ flex: 1 }}>
          {this.renderHeader('Carrinho')}
            <ScrollView style={styles.scrollViewStyle} >
              {this.renderReplaceMenu()}
            </ScrollView>
          </View>
        </Modal>
        {this.renderHeader('Carrinho')}
        {this.renderRetailerMenu()}
        <ScrollView style={styles.scrollViewStyle} >
          {this.renderProducts()}
        </ScrollView>
        {this.renderFooter()}
      </View>
    );
  }
}

const styles = {
  thumbnailStyle: {
    height: 100,
    flex: 1,
    width: 100,
    margin: 5
  },
  thumbnailUnavailableStyle: {
    height: 100,
    flex: 1,
    width: 100,
    margin: 5,
    opacity: 0.5
  },
  BoxStyle: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 5,
    marginBottom: 5
  },
  scrollViewStyle: {
    flex: 1
  },
  headerStyle: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: 'black',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: 'relative'
  },
  headerTextStyle: {
    fontSize: 20
  },
  footerStyle: {
    flexDirection: 'row'
  },
  nameMenuStyle: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  inputStyle: {
    width: 300,
    height: 40,
    alignSelf: "center"
  }
};

export default ShoppingCart;
