import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage, TouchableOpacity } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductList from './ProductList';

class FavoriteProducts extends Component {
  static navigationOptions = {
    tabBarLabel: 'Favorite Products',
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons 
        name="favorite"
        size={24}
        style={{ color: tintColor }}
        >
        </MaterialIcons>
      );
    }
  }

  state = {
    token: '',
    products: [],
    isLoading: false,
  }

  componentWillMount() {
    console.log("A MONTAR");

    AsyncStorage.getItem('@Token').then((rtoken) => {
      this.setState({ token: rtoken });
      this.favoritePost();
      }, (error) => {
      console.log(error);
    });
  }

  favoritePost() {
    console.log('RENDER FAVORITE POST');
    this.setState({ isLoading: true });
    const url = 'http://vps415122.ovh.net/api/profile/favorites';
    const auth = 'bearer ' + this.state.token;
    console.log('Auth');
    console.log(auth);
    fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    }
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log('FavoritePost');
      console.log(responseJson);
      this.setState({ 
        products: responseJson, 
        isLoading: false, });
    })
    .catch((error) => {
        console.log('DEU MERDA');
        this.setState({ isLoading: false });
        console.error(error);
    });
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
        <TouchableOpacity onPress={() => { this.favoritePost(); }}>
          <MaterialIcons 
          name="refresh"
          size={40}
          style={{ color: 'black', padding: 5 }}
          />
        </TouchableOpacity>
        </View>

      </View>);
  }


  render() {
    console.log('RENDER FAVORITE PRODUCTS');
    console.log(this.state.token);
    return (
    <View style={{ flex: 1 }}
    >
    {this.renderHeader('Produtos Favoritos')}
    <ProductList 
        isItLoading={this.state.isLoading}
        products={this.state.products}
    />
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

export default FavoriteProducts;
