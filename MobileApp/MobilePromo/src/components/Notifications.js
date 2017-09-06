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
    token: '',
    logMode: '',
    notifications: [],
    isLoading: false
  };

  componentWillMount() {
    AsyncStorage.getItem("@LogMode").then(logMode => {
    this.setState({ logMode: logMode});
    if (logMode != "Visitor") {
    AsyncStorage.getItem("@Token").then(
      rtoken => {
        this.setState({ token: rtoken });
        this.notificationsGet();
      },
      error => {
        console.log(error);
      }
    );
    }
    });
  }

  notificationsGet() {
    console.log("RENDER NOTIFICATIONS GET");
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
        this.setState({
          notifications: responseJson,
          isLoading: false
        });
      })
      .catch(error => {
        console.log("Erro Pedido");
        this.setState({ isLoading: false });
        console.error(error);
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
      .then(() => {})
      .catch(error => {
        console.log("Erro Pedido");
        this.setState({ isLoading: false });
        console.error(error);
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
        console.log("Erro Pedido");
        this.setState({ isLoading: false });
        console.error(error);
      });
  }

  renderHeader(headerName) {
    console.log("Render Header Menu");
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
          <Text style={styles.headerTextStyle}>
            {headerName}
          </Text>
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
    console.log("Render Footer Menu");
    return (
      <View style={styles.footerStyle}>
        <Button
          style={{
            borderColor: "red",
            marginLeft: 2,
            marginRight: 2,
            flex: 1
          }}
          textStyle={{ color: "red" }}
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
    console.log(this.state.notifications.length);
    if (this.state.notifications.length !== 0 && !this.state.isLoading) {
      return this.state.notifications.map(row =>
        <View
          key={row.id}
          style={{
            flex: 1,
            flexDirection: "row",
            marginLeft: 5,
            marginRight: 5,
            marginTop: 10
          }}
        >
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "bold" }}>
              {row.product_name} no {row.retailer_name} encontra-se com{" "}
              {row.percentage}% de desconto: {row.base_price} -> {row.price}
            </Text>
          </View>
          <View style={{ width: 10 }} />
          <Button
            onPress={() => {
              this.removeNotificationsPost(row.id);
              this.notificationsGet();
            }}
            title="Apagar"
            color="red"
          />
        </View>
      );
    }
    return (
      <ActivityIndicator
        size="large"
        style={{ flex: 1, alignSelf: "center", justifyContent: "center" }}
      />
    );
  }

  render() {
    console.log("RENDER NOTIFICATIONS");
    const logMode = AsyncStorage.getItem("@LogMode");

    if (this.state.logMode == "Visitor") {
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader("Notificações")}
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
            <MaterialIcons
              name="warning"
              size={24}
              style={{ color: 'red' }}
            />
            </View>
            <View>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>Funcionalidade apenas disponível para utilizadores loggados</Text>
            </View>
          </View>
        </View>
      );
    }
    else{
      return (
        <View style={{ flex: 1 }}>
          {this.renderHeader("Notificações")}
          <ScrollView>
            {this.renderNotifications()}
          </ScrollView>
          {this.renderFooter()}
        </View>
      );
    }
  }
}

const styles = {
  footerStyle: {
    borderWidth: 1,
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
    borderWidth: 1,
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
  },
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  }
};

export default Notifications;
