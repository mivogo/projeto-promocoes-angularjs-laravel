import React, { Component } from "react";
import {
  Text,
  View,
  AsyncStorage,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Button from "apsl-react-native-button";
import ProductList from "./ProductList";

class Notifications extends Component {
  static navigationOptions = {
    tabBarLabel: "Notifications",
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons
          name="notifications"
          size={24}
          style={{ color: tintColor }}
        />
      );
    }
  };

  state = {
    token: "",
    logMode: "",
    noNotifications: false,
    notifications: [],
    isLoading: false
  };

  componentWillMount() {
    AsyncStorage.getItem("@LogMode").then(logMode => {
      this.setState({ logMode: logMode });
      if (logMode != "Visitor") {
        AsyncStorage.getItem("@Token").then(
          rtoken => {
            this.setState({ token: rtoken });
            this.notificationsGet();
          },
          error => {}
        );
      }
    });
  }

  notificationsGet() {
    this.setState({ isLoading: true });
    const url = "http://vps415122.ovh.net/api/profile/notificationNotRead";
    const auth = "bearer " + this.state.token;
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth
      }
    })
      .then(response => response.json())
      .then(responseJson => {
        if (responseJson.length == 0) {
          this.setState({
            notifications: responseJson,
            isLoading: false,
            noNotifications: true,
          });
        } else {
        this.setState({
          notifications: responseJson,
          isLoading: false,
          noNotifications: false
        });
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }

  removeNotificationsPost(id) {
    this.setState({ isLoading: true });
    const url = "http://vps415122.ovh.net/api/profile/notification/" + id;
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
        this.notificationsGet();
      })
      .then(() => {})
      .catch(error => {

        this.setState({ isLoading: false });
      });
  }

  removeAllNotificationsPost() {
    this.setState({ isLoading: true });
    const url = "http://vps415122.ovh.net/api/profile/notificationMarkAll";
    const auth = "bearer " + this.state.token;
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth
      }
    })
      .then(response => response.json())
      .catch(error => {
        this.setState({ isLoading: false });
      });
  }

  renderHeader(headerName) {
    return (
      <View style={styles.headerStyle}>
        {/* Menu icon and click action */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("DrawerOpen")}
        >
          <MaterialIcons
            name="menu"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "center"
          }}
        >
          <Text style={styles.headerTextStyle}>{headerName}</Text>
        </View>

        {/* Search Menu */}
        <View>
          <TouchableOpacity
            onPress={() => {
              this.notificationsGet();
            }}
          >
            <MaterialIcons
              name="refresh"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFooter() {
    return (
      <View style={styles.footerStyle}>
        <Button
          style={{
            borderColor: "darkred",
            marginLeft: 2,
            marginRight: 2,
            flex: 1
          }}
          textStyle={{ color: "darkred" }}
          onPress={() => {
            this.removeAllNotificationsPost();
            this.notificationsGet();
          }}
        >
          Apagar Todos
        </Button>
      </View>
    );
  }

  renderNotifications() {
      return this.state.notifications.map(row => (
        <View
          key={row.id}
        >
          <View style={{ 
            padding: 10,
            backgroundColor: 'white',
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
             }}>
             <View>
               <Text style={{ color: 'gray' }}>{row.created}</Text>
             </View>
             <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text>
                  <Text style={{ fontWeight: 'bold', color: 'rgb(51, 122, 183)' }}>
                  {row.product_name}
                  </Text>
                  <Text> no </Text>
                  <Text>{row.retailer_name}</Text>
                  <Text> encontra-se com </Text>
                  <Text>{row.percentage}%</Text>
                  <Text> de desconto: </Text>
                 </Text>
                </View>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ textDecorationLine: 'line-through' }}>{row.base_price} €</Text>
                <View style={{ flex: 1 }} />
                <Text style={{ fontWeight: 'bold', color: 'red', fontSize: 20 }} >{row.price} €</Text>
              </View>
              <View style={{ height: 10 }} />
                <View>
                  <Button
                    style={{
                      borderColor: 'red',
                      marginLeft: 2,
                      marginRight: 2,
                      flex: 1
                    }}
                    textStyle={{ color: 'red' }}
                    onPress={() => {
                      this.removeNotificationsPost(row.id);
                    }}
                  >
                  Apagar
                  </Button>
                </View>
        </View>
        </View>
        
      ));
  }

  render() {
    const logMode = AsyncStorage.getItem('@LogMode');
    if (this.state.logMode == "Visitor") {
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader('Notificações')}
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View>
              <MaterialIcons
                name='warning'
                size={24}
                style={{ color: 'red' }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>
                Funcionalidade apenas disponível para utilizadores loggados
              </Text>
            </View>
          </View>
        </View>
      );
    }
    if (this.state.noNotifications) {
        return (
          <View style={{ flex: 1 }}>
            {this.renderHeader('Notificações')}
            <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <View>
              <MaterialIcons
                name="warning"
                size={24}
                style={{ color: 'red' }}
              />
            </View>
            <View>
              <Text style={{ fontSize: 20, textAlign: 'center' }}>
                Não há notificações para mostrar.
              </Text>
            </View>
          </View>
            {this.renderFooter()}
          </View>
        );
      }
      if(this.state.isLoading){
        return (
          <View style={{ flex: 1 }}>
          {this.renderHeader('Notificações')}
          <ActivityIndicator
            size="large"
            style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }}
          />
          {this.renderFooter()}
          </View>
      );
      }
        return (
          <View style={{ flex: 1 }}>
            {this.renderHeader('Notificações')}
            <ScrollView>{this.renderNotifications()}</ScrollView>
            {this.renderFooter()}
          </View>
        );
    }
}

const styles = {
  footerStyle: {
    backgroundColor: "#F8F8F8",
    alignSelf: "center",
    flexDirection: "row",
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: "relative"
  },
  headerStyle: {
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: "relative"
  },
  headerTextStyle: {
    fontSize: 20
  }
};

export default Notifications;
