import React, { Component } from "react";
import {
  Text,
  View,
  Alert,
  AsyncStorage,
  TextInput,
  ActivityIndicator,
  NetInfo,
  Modal
} from "react-native";
import * as Animatable from "react-native-animatable";
import Button from "apsl-react-native-button";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

class Login extends Component {
  static navigationOptions = {
    tabBarLabel: "Login",
    drawerLockMode: "locked-closed",
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons
          name="account-circle"
          size={24}
          style={{ color: tintColor }}
        />
      );
    }
  };

  state = {
    name: '',
    isConnected: false,
    email: '',
    password: '',
    token: '',
    isLogged: false,
    isLoading: false,
    visibleRegister: false
  };
 

  componentWillMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      this.setState({ isConnected: isConnected});
    });
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleOnline.bind(this)
    );
    const jsonObj = {
      products: []
    };
    
    AsyncStorage.setItem("@Cart", JSON.stringify(jsonObj));
  }

  setRegisterMenuVisible(visible) {
    this.setState({ visibleRegister: visible });
  }
 
  handleOnline(isConnected) {
    
    this.setState({ isConnected: isConnected });
  }

  loginPost() {
    this.setState({ isLoading: true });
    
    let jsonRequest = "";
    const url = "http://vps415122.ovh.net/api/login";
    jsonRequest += '{"email": "' + this.state.email + '",';
    jsonRequest += '"password": "' + this.state.password + '"}';

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonRequest
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.token != null) {
          this.setState({
            token: responseJson.token,
            name: responseJson.name,
            isLogged: true,
            isLoading: false
          });
          AsyncStorage.setItem("@Token", this.state.token);
          AsyncStorage.setItem("@Name", this.state.name);
          AsyncStorage.setItem("@LogMode", "Logged");
          AsyncStorage.setItem("@SelectedRetailer", "1");
          this.props.navigation.navigate("Pesquisar");
        } else {
          Alert.alert(
            'Erro de Login',
            'Os dados inseridos não correspondem a de um utilizador existente ',
            [
              {text: 'OK', onPress: () => {
                this.setState({
                  token: '',
                  isLogged: false,
                  isLoading: false
                });
              } }
            ]
          );
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        
      });
  }

  registerPost() {
    this.setState({ isLoading: true });
    
    let jsonRequest = "";
    const url = "http://vps415122.ovh.net/api/register";
    jsonRequest += '{"name": "' + this.state.name + '",';
    jsonRequest += '"email": "' + this.state.email + '",';
    jsonRequest += '"password": "' + this.state.password + '"}';
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonRequest
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.token != null) {
          this.setState({
            token: responseJson.token,
            isLogged: true,
            isLoading: false
          });
          AsyncStorage.setItem("@Token", this.state.token);
          AsyncStorage.setItem("@Name", this.state.name);
          AsyncStorage.setItem("@LogMode", "Logged");
          AsyncStorage.setItem("@SelectedRetailer", "1");
          this.props.navigation.navigate("Pesquisar");
        } else {
          
          
          if (responseJson.error.email != null) {
          Alert.alert(
            'Erro de Registo',
            'O e-mail não é válido',
            [
              {text: 'OK', onPress: () => {
                this.setState({
                token: responseJson.token,
                isLogged: false,
                isLoading: false
                });
              } }
            ]
          );
          }
          else {
              Alert.alert(
                'Erro de Registo',
                'A password é inválida, tem que conter pelo menos 6 caracteres ',
                [
                  {text: 'OK', onPress: () => {
                    this.setState({
                    token: responseJson.token,
                    isLogged: false,
                    isLoading: false
                    });
                  } }
                ]
              );
        }
        }
      })
      .catch(error => {
        
        
        this.setState({ isLoading: false });
        
      });
  }

  renderRegisterMenu() {
    
    return (
      <View style={styles.modalRegisterStyle}>
        <View
          style={{
            padding: 10,
            backgroundColor: "white"
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Registar:</Text>
          <TextInput
            style={styles.inputRegisterStyle}
            onChangeText={text => this.setState({ name: text })}
            defaultValue={this.state.name}
            placeholder="Nome"
          />

          <TextInput
            style={styles.inputRegisterStyle}
            keyboardType="email-address"
            onChangeText={text => this.setState({ email: text })}
            defaultValue={this.state.email}
            placeholder="Email"
          />

          <TextInput
            style={styles.inputRegisterStyle}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
            defaultValue={this.state.password}
            placeholder="Password"
          />

          <Button
            onPress={() => {
              this.registerPost();
            }}
            isLoading={this.state.isLoading}
          >
            <Text>Registar</Text>
          </Button>
        </View>
      </View>
    );
  }

  render() {
    if(this.state.isConnected){
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* Register Modal */}
        <Modal
          animationType={'fade'}
          visible={this.state.visibleRegister}
          onRequestClose={() =>
            this.setRegisterMenuVisible(!this.state.visibleRegister)}
          transparent={true}
        >
          {this.renderRegisterMenu()}
        </Modal>

        {/* Login */}
        <View
          style={{
            flex: 1,
            alignItems: "flex-start",
            alignSelf: "center",
            justifyContent: "center"
          }}
        >
          {/* Login - Text */}
          <Text style={{ fontSize: 30, alignSelf: "center" }}>PROMOS</Text>

          {/* Login - Animated Logo */}
          <Animatable.View
            animation="pulse"
            iterationCount="infinite"
            style={{ alignSelf: "center" }}
          >
            <MaterialIcons name="shopping-basket" size={200} />
          </Animatable.View>

          {/* Login - Email Input */}
          <TextInput
            style={styles.inputStyle}
            keyboardType="email-address"
            onChangeText={text => this.setState({ email: text })}
            defaultValue={this.state.email}
            placeholder="Email"
          />

          {/* Login - Password Input */}
          <TextInput
            style={styles.inputStyle}
            onChangeText={text => this.setState({ password: text })}
            secureTextEntry={true}
            defaultValue={this.state.password}
            placeholder="Password"
          />

          {/* Login - Login Button */}
          <Button
            style={{ borderColor: "blue" }}
            textStyle={{ color: "blue" }}
            onPress={() => {
              this.loginPost();
            }}
            isLoading={this.state.isLoading}
          >
            Login
          </Button>

          {/* Login - Register Button */}
          <Button
            style={{ borderColor: "red" }}
            textStyle={{ color: "red" }}
            onPress={() => {
              this.setRegisterMenuVisible(!this.state.visibleRegister);
            }}
          >
            Registar
          </Button>

          {/* Login - Visitor Button */}
          <Button
            style={{ borderColor: 'green' }}
            textStyle={{ color: 'green' }}
            onPress={() => {
              AsyncStorage.setItem("@LogMode", "Visitor");
              AsyncStorage.setItem("@SelectedRetailer", "1");
              this.props.navigation.navigate("Pesquisar");
            }}
          >
            Entrar como visitante
          </Button>
        </View>
      </View>
    );
  }
  return <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center"}}>
      <View style={{flex:1, justifyContent: "flex-end", alignItems: "center" }}>
      {/* Login - Text */}
      <Text style={{ fontSize: 30, alignSelf: "center" }}>PROMOS</Text>

      {/* Login - Animated Logo */}
      <Animatable.View animation="pulse" iterationCount="infinite" style={{ alignSelf: "center" }}>
        <MaterialIcons name="shopping-basket" size={200} />
      </Animatable.View>
      </View>
      <View style={{ height: 50 }} />
      <View style={{ flex: 0.7, justifyContent: "flex-start", alignItems: "center" }}>
          <View>
            <MaterialIcons name="warning" size={50} style={{ color: "red" }} />
          </View>

          <View>
            <Text style={{ fontSize: 20, textAlign: "center" }}>
              Não se encontra conectado à Internet
            </Text>
          </View>
        </View>
      </View>
    </View>;
}
}

const styles = {
  inputStyle: {
    width: 300,
    height: 40,
    padding: 10
  },
  inputRegisterStyle: {
    height: 40,
    alignSelf: 'center',
    width: 390,
  },
  modalRegisterStyle: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "stretch",
    justifyContent: "center"
  }
};

export default Login;
