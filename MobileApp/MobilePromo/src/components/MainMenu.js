import React, { Component } from "react";
import { AppRegistry, Button } from "react-native";
import { DrawerNavigator } from "react-navigation";
import SearchScreen from "./SearchScreen";
import SecondScreen from "./src/components/Screen2";

const DrawerExample = DrawerNavigator(
  {
    Pesquisar: {
      path: "/",
      screen: SearchScreen
    },
    Second: {
      path: "/",
      screen: SecondScreen
    },
    Lol: {
      path: "/",
      screen: SecondScreen
    },
    Fourth: {
      path: "/",
      screen: SecondScreen
    }
  },
  {
    initialRouteName: "Pesquisar",
    drawerPosition: "left",
    contentOptions: {
      activeTintColor: "red"
    }
  }
);
