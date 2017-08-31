import React, { Component } from "react";
import { AppRegistry, Button } from "react-native";
import { DrawerNavigator } from "react-navigation";
import SearchScreen from "./src/components/SearchScreen";
import FavoriteProducts from "./src/components/FavoriteProducts";
import UserListsProducts from "./src/components/UserListProducts";
import Notifications from "./src/components/Notifications";
import ShoppingCart from "./src/components/ShoppingCart";
import Login from "./src/components/Login";

const DrawerExample = DrawerNavigator(
  {
    Conta: {
      path: "/",
      screen: Login
    },
    Pesquisar: {
      path: "/",
      screen: SearchScreen
    },
    Carrinho: {
      path: "/",
      screen: ShoppingCart
    },
    "Produtos Favoritos": {
      path: "/",
      screen: FavoriteProducts
    },
    "Listas guardadas": {
      path: "/",
      screen: UserListsProducts
    },
    Notificações: {
      path: "/",
      screen: Notifications
    }
  },
  {
    initialRouteName: "Conta",
    drawerPosition: "left",
    contentOptions: {
      activeTintColor: "red"
    }
  }
);

//Render it to the device
AppRegistry.registerComponent("MobilePromo", () => DrawerExample);
