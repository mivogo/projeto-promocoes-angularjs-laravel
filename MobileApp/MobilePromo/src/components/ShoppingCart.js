import React, { Component } from 'react';
import { Text, View, AsyncStorage, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductList from './ProductList';
import Button from 'apsl-react-native-button';

class ShoppingCart extends Component {
  static navigationOptions = {
    tabBarLabel: 'Favorite Products',
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons 
        name="shopping-cart"
        size={24}
        style={{ color: tintColor }}
        >
        </MaterialIcons>
      );
    }
  }

  state = {
    token: '',
    lists: [],
    isLoading: false,
  }


  renderHeader(headerName) {
    console.log('Render Header Menu');
     return (<View style={styles.headerStyle}>

        {/* Menu icon and click action */}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
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
          alignItems: 'center' }}
        >
          <Text style={styles.headerTextStyle}>{headerName}</Text>
        </View>

         {/* Search Menu */}
         <View>
        <TouchableOpacity onPress={() => { this.componentWillMount(); }}>
          <MaterialIcons 
          name="refresh"
          size={40}
          style={{ color: 'black', padding: 5 }}
          />
        </TouchableOpacity>
        </View>

      </View>);
  }

  cleanCart() {
    const jsonObj={
      products: []
    };
    AsyncStorage.setItem('@Cart', JSON.stringify(jsonObj));
    this.componentWillMount();
  }

  renderFooter() {
    console.log('Render Footer Menu');
    return (
      <View style={styles.footerStyle}>
         <Button onPress={() => { this.cleanCart(); }}>Apagar todos</Button>
       </View> 
    );
  }

  componentWillMount() {
    console.log("A MONTAR");
    this.setState({ isLoading: true });    
    AsyncStorage.getItem('@Token').then((rtoken) => {
      this.setState({ token: rtoken });
      }, (error) => {
      console.log(error);
    });

    const jsonObj={
      products: {
        data: []
      }
    };
    console.log(jsonObj);

    AsyncStorage.getItem('@Cart').then((cart) => {
      cart = JSON.parse(cart);
      const json = cart.products;
      console.log(json);
      for (let i = 0; i < json.length; i++) { 
          console.log(json[i].data.name);
          jsonObj.products['data'].push(json[i].data);
      }
      console.log(jsonObj);
      this.setState({ products: jsonObj.products.data, isLoading: false });
      }, (error) => {
        console.log(error);
      });

  }

  render() {
    console.log('RENDER FAVORITE PRODUCTS');
    console.log(this.state.token);
    return (
    <View style={{ flex: 1 }}
    >
    {this.renderHeader('Carrinho')}
    <ProductList 
        isItLoading={this.state.isLoading}
        products={this.state.products}
    />
    {this.renderFooter()}
    </View>
    );
  }
};

const styles = {
  headerStyle: {
    borderWidth: 1,
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
  }
};

export default ShoppingCart;
