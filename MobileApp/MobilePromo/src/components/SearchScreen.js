import React, { Component } from 'react';
import { Text, View, Button, Image, Dimensions, TouchableOpacity, TextInput } from 'react-native';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './header';
import Footer from './Footer';
import ProductList from './ProductList';

class SearchScreen extends Component {

  state = {
    isModalVisible: false,
    searchQuery: ""
  }

  _showModal = () => this.setState({ isModalVisible: true })

  _hideModal = () => this.setState({ isModalVisible: false })

  static navigationOptions = {
    tabBarLabel: 'Search',
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

  renderHeader(headerName){
     return (<View style={styles.headerStyle}>

        {/* Menu icon and click action */}
        <TouchableOpacity onPress={() => this.props.navigation.navigate('DrawerOpen')}>
          <MaterialIcons 
          name="menu"
          size={50}
          style={{color: 'black'}}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <View style={{
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'center',
          flex:1,
          alignItems: 'center'}}>
          <Text style={styles.headerTextStyle}>{headerName}</Text>
        </View>

        {/* Filter Menu */}
        <View>
          <TouchableOpacity onPress={this._showModal}>
          <MaterialIcons 
          name="search"
          size={50}
          style={{color: 'black'}}
          />
        </TouchableOpacity>
        </View>
      </View>);
  }

  renderFilterMenu(){
    return (
        <View style={styles.modalStyle}>
          <View style={{padding:10, borderColor: 'blue', borderWidth:1 }}>
            <Text>Termos a pesquisar:</Text>
            <TextInput
            style={{height: 40, borderColor: 'gray', borderWidth: 1}}
            onChangeText={(searchQuery) => this.setState({searchQuery})}
            value={this.state.searchQuery}
            />
          </View>
        </View>
    );
  }

  render() {
    return (
    <View style={{ flex: 1 }}>
      <Modal 
        isVisible={this.state.isModalVisible}>
        {this.renderFilterMenu()}
      </Modal>
      {this.renderHeader("Resultados")}
      <ProductList />
    </View>
    );
  }
};

const styles = {
  modalStyle:{
    alignSelf: "center",
    backgroundColor: "white",
    alignSelf: "stretch",
    flex:1
  },
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
  }
};

export default SearchScreen;
