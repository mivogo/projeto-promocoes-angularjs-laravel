import React, { Component } from 'react';
import { Text, View, AsyncStorage, TextInput, ActivityIndicator, Modal } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button from 'apsl-react-native-button';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Login extends Component {


  static navigationOptions = {
    tabBarLabel: 'Login',
    drawerLockMode: 'locked-closed',
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons 
        name="account-circle"
        size={24}
        style={{ color: tintColor }}
        >
        </MaterialIcons>
      );
    }
  }

  state = {
    name: '',
    email: 'pedro@mail.com',
    password: 'kim1414',
    token: '',
    isLogged: false,
    isLoading: false,
    visibleRegister: false
  }

  componentWillMount() {
      const jsonObj={
          products: []
      };
      console.log('A ENVIAR');
    AsyncStorage.setItem('@Cart', JSON.stringify(jsonObj)); 
  }

  setRegisterMenuVisible(visible) {
    this.setState({ visibleRegister: visible });
  }

  loginPost() {
    this.setState({ isLoading: true });
    console.log('MOUNTOU');
    let jsonRequest = '';
    const url = 'http://vps415122.ovh.net/api/login';
    jsonRequest += '{"email": "' + this.state.email + '",';
    jsonRequest += '"password": "' + this.state.password + '"}';

    console.log(url);
    console.log(jsonRequest);
    
    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonRequest
    }).then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.token != null) {
        this.setState({ token: responseJson.token, name: responseJson.name, isLogged: true, isLoading: false });
        AsyncStorage.setItem('@Token', this.state.token);
        AsyncStorage.setItem('@Name', this.state.name);
        AsyncStorage.setItem('@LogMode', 'Logged');
        this.props.navigation.navigate('Pesquisar'); 
        {/*setTimeout(() => { this.props.navigation.navigate('Pesquisar'); }, 10000); */}
        }
        else {
            this.setState({ token: responseJson.token, isLogged: false, isLoading: false });            
            console.log("Erro a loggar");
        }
    })
    .catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
    });
  }

  registerPost() {
    this.setState({ isLoading: true });
    console.log('MOUNTOU');
    let jsonRequest = '';
    const url = 'http://vps415122.ovh.net/api/register';
    jsonRequest += '{"name": "' + this.state.name + '",'
    jsonRequest += '"email": "' + this.state.email + '",';
    jsonRequest += '"password": "' + this.state.password + '"}';

    console.log(url);
    console.log(jsonRequest);
    
    fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonRequest
    }).then((response) => response.json())
    .then((responseJson) => {
        if (responseJson.token != null) {
        this.setState({ token: responseJson.token, isLogged: true, isLoading: false });
        AsyncStorage.setItem('@Token', this.state.token);
        AsyncStorage.setItem('@Name', this.state.name);
        AsyncStorage.setItem('@LogMode', 'Logged');
        this.props.navigation.navigate('Pesquisar');
        }
        else {
            this.setState({ token: responseJson.token, isLogged: false, isLoading: false });            
            console.log("Erro a Registar");
        }
    })
    .catch((error) => {
        this.setState({ isLoading: false });
        console.error(error);
    });
  }

  renderRegisterMenu() {
    console.log('Render Search Menu');
    return (
        <View style={styles.modalRegisterStyle}>
          <View style={{ padding: 10, borderColor: 'blue', borderWidth: 1, backgroundColor: 'white' }}>

            <Text>Registar:</Text>
            <TextInput
            style={styles.inputRegisterStyle}
            onChangeText={(text) => this.setState({ name: text })}
            defaultValue={this.state.name}
            placeholder='Nome'
            />

            <TextInput
            style={styles.inputRegisterStyle}
            keyboardType='email-address'
            onChangeText={(text) => this.setState({ email: text })}
            defaultValue={this.state.email}
            placeholder='Email'            
            />
    
            <TextInput
            style={styles.inputRegisterStyle}
            onChangeText={(text) => this.setState({ password: text })}
            secureTextEntry={true}
            defaultValue={this.state.password}
            placeholder='Password'            
            />

            <Button
            onPress={() => { this.registerPost(); }}
            isLoading={this.state.isLoading}
            >
                <Text>Registar</Text>
            </Button>

          </View>

        </View>

    );
  }

  render() {
    return (
    <View style={
      {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1
      }
    }>
        {/* Register Modal */}
        <Modal 
            animationType={'slide'}
            visible={this.state.visibleRegister}
            onRequestClose={() => this.setRegisterMenuVisible(!this.state.visibleRegister)}
            transparent={true}
        >
            {this.renderRegisterMenu()}
        </Modal>

       {/* Login */}
      <View style={
        {
        flex: 1,
        alignItems:'flex-start',
        alignSelf:'center',
        justifyContent:'center'
        }
      }>

            {/* Login - Text */}
            <Text style={{ fontSize: 30, alignSelf: 'center' }}>
                PROMOS
            </Text>

            {/* Login - Animated Logo */}
            <Animatable.View animation="pulse" iterationCount="infinite" style={{ alignSelf: 'center' }}>
                <MaterialIcons 
                name="shopping-basket"
                size={200}
                />
            </Animatable.View>

             {/* Login - Email Input */}
            <TextInput
                style={styles.inputStyle}
                keyboardType='email-address'
                onChangeText={(text) => this.setState({ email: text })}
                defaultValue={this.state.email}
                placeholder='Email'
            />

            {/* Login - Password Input */}
            <TextInput
                style={styles.inputStyle}
                onChangeText={(text) => this.setState({ password: text })}
                secureTextEntry={true}
                defaultValue={this.state.password}
                placeholder='Password'
            />
        
         {/* Login - Login Button */}
        <Button
        style={{borderColor: 'blue'}}
        textStyle={{color: 'blue'}}
        onPress={() => { this.loginPost(); }}
        isLoading={this.state.isLoading}
        >
        Login
        </Button>
        
        {/* Login - Register Button */}
        <Button
            style={{borderColor: 'red'}}
            textStyle={{color: 'red'}}
            onPress={() => {this.setRegisterMenuVisible(!this.state.visibleRegister);}}
        >
        Registar
        </Button>

        {/* Login - Visitor Button */}
        <Button
        style={{ borderColor: 'green' }}
        textStyle={{ color: 'green' }}
            onPress={() => {
                AsyncStorage.setItem('@LogMode', 'Visitor');
                this.props.navigation.navigate('Pesquisar');
                }
            }
        >
        Entrar como visitante
        </Button>
      </View>
    </View>            
    );
  }
}

const styles = {
    inputStyle: {
        width: 300,
        height: 40,
        padding: 10
    },
    inputRegisterStyle: {
        width: 300,
        height: 40,
        alignSelf: 'center'
    },
    modalRegisterStyle: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.5)',    
        alignSelf: 'stretch',
        justifyContent: 'center'
    }
};

export default Login;