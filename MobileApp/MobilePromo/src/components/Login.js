import React, { Component } from 'react';
import { Text, View, Button, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Login extends Component {

  static navigationOptions = {
    tabBarLabel: 'Login',
    drawerLockMode: 'locked-closed',
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons 
        name="change-history"
        size={24}
        style={{ color: tintColor }}
        >
        </MaterialIcons>
      );
    }
  }

  render() {
    return (
    <View style={
      {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
      }
    }>
      <Text style={{fontSize: 30, color: 'blue'}}>
        LOGIN MENU
      </Text>
      <Button
        onPress={() => this.props.navigation.navigate('Pesquisar', { miguel: 'TESTE :D' })}
        title="Open DrawNavigator"
      />
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

export default Login;