import React, { Component } from 'react';
import { Text, View, Button, Image, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './header';
import Footer from './Footer';
import ProductList from './ProductList';

class SearchScreen extends Component {

  state = {
    isModalVisible: false
  }

  _showModal = () => this.setState({ isModalVisible: true })

  _hideModal = () => this.setState({ isModalVisible: false })



  static navigationOptions = {
    tabBarLabel: 'Screen 1',
    drawerIcon: ({tintColor}) => {
      return (
        <MaterialIcons 
        name="search"
        size={24}
        style={{color: tintColor}}
        >
        </MaterialIcons>
      );
    }
  }
  render() {
    return (
    <View style={{ flex: 1 }}>
    <TouchableOpacity onPress={this._showModal}>
          <Text>Show Modal</Text>
        </TouchableOpacity>
        <Modal 
          isVisible={this.state.isModalVisible}>
          <View style={{alignSelf: "center", backgroundColor: "white", flex: 1 }}>
              <Text>Hello!</Text>
          </View>
        </Modal>
      <Header headerText={'Pedro'} navigation={this.props.navigation} />
      <ProductList />
    <Footer footerText={'Test'} />
    </View>
    );
  }
};

const styles = {
  containerStyle: {
    width: (Dimensions.get('window').width / 2) - 10,
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

export default SearchScreen;
