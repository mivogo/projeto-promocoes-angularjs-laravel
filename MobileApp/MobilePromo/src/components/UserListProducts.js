import React, { Component } from 'react';
import { Text, ScrollView, View, Button, AsyncStorage, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductList from './ProductList';

class UserListProducts extends Component {
  static navigationOptions = {
    tabBarLabel: 'Favorite Products',
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons 
        name="format-list-numbered"
        size={24}
        style={{ color: tintColor }}
        >
        </MaterialIcons>
      );
    }
  }

  state = {
    showList: false,
    selectedList: '',
    token: '',
    lists: [],
    products: [],    
    isLoading: false,
    isLoadingList: false,
  }

  userListGet() {
    console.log('RENDER FAVORITE POST');
    this.setState({ isLoading: true });
    const url = 'http://vps415122.ovh.net/api/profile/shoppinglist';
    const auth = 'bearer ' + this.state.token;
    fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    }
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        lists: responseJson, 
        isLoading: false, });
    })
    .catch((error) => {
        console.log('Erro Pedido');
        this.setState({ isLoading: false });
        console.error(error);
    });
  }

  userListPost(id) {
    console.log('RENDER FAVORITE POST');
    this.setState({ isLoadingList: true });
    const url = 'http://vps415122.ovh.net/api/profile/shoppinglist/' + id;
    const auth = 'bearer ' + this.state.token;
    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    }
    }).then((response) => response.json())
    .then((responseJson) => {
      this.setState({ 
        products: responseJson.products, 
        isLoadingList: false, });
    })
    .catch((error) => {
        console.log('Erro Pedido');
        this.setState({ isLoadingList: false });
        console.error(error);
    });
  }

  userListDeletePost(id) {
    console.log('RENDER FAVORITE POST');
    this.setState({ isLoadingList: true });
    const url = 'http://vps415122.ovh.net/api/profile/shoppinglist/delete/' + id;
    const auth = 'bearer ' + this.state.token;
    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    }
    }).then((response) => response.json())
    .then(() => {
        this.userListGet();
    })
    .catch((error) => {
        console.log('Erro Pedido');
        this.setState({ isLoadingList: false });
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
        <TouchableOpacity onPress={() => { this.userListGet(); }}>
          <MaterialIcons 
          name="refresh"
          size={40}
          style={{ color: 'black', padding: 5 }}
          />
        </TouchableOpacity>
        </View>

      </View>);
  }

  componentWillMount() {
    console.log("A MONTAR");
    AsyncStorage.getItem('@Token').then((rtoken) => {
      this.setState({ token: rtoken });
      this.userListGet();
      }, (error) => {
      console.log(error);
    });

  }

  renderListsPreview(){
    if (this.state.lists.length !== 0 && !(this.state.isLoading)) {
      return this.state.lists.map(row =>
        <View
        key={row.id}
        style={{ flex: 1, 
        flexDirection: 'row',
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10
        }}
        >
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold' }}>{row.name}</Text>
          <Text>{row.description}</Text>
        </View>
        <View>
            <Text>{row.total_products} produtos</Text>
            <Text>{row.total_price.toString().replace('.', ',')}€</Text>
          </View>
          <View style={{ width: 10 }} />
          <Button onPress={() => {
            this.userListPost(row.id);
            this.setState({ selectedList: row.name, showList: true });
            }
            } title='Ver' color='green' />
          <View style={{ width: 10 }} />
          <Button onPress={() => {
            this.userListDeletePost(row.id);
            }} title='Apagar' color='red' />
        </View>
       );
      }
      return <ActivityIndicator 
      size='large' 
      style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }} 
      />;
  }

  renderList(){
    return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerStyle}>
        {/* Header Text */}
          <View 
          style={{
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'center',
          flex: 1,
          alignItems: 'center' }}
          >
            <Text style={styles.headerTextStyle}>Lista: {this.state.selectedList}</Text>
          </View>
      </View>
        <ProductList 
        isItLoading={this.state.isLoadingList}
        products={this.state.products}
        />
    </View>
    );
  }

  render() {
    console.log('RENDER FAVORITE PRODUCTS');
    console.log(this.state.token);
    return (
    <View style={{ flex: 1 }}>
      <Modal 
        animationType={'slide'}
        visible={this.state.showList}
        onRequestClose={() => this.setState({ showList: (!this.state.showList) })}
      >
        {this.renderList()}
      </Modal>
    
    {this.renderHeader('Listas Guardadas')}
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      >
      {this.renderListsPreview()}
    </ScrollView>
    {/*<ProductList 
        isItLoading={this.state.isLoading}
        products={this.state.products}
    />*/}
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
  },
  containerStyle: {
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
    marginTop: 10,
  }
};

export default UserListProducts;
