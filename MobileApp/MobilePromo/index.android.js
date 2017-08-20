import React, { Component } from 'react';
import { AppRegistry, Button } from "react-native";
import { DrawerNavigator } from "react-navigation";
import SearchScreen from './src/components/SearchScreen';
import SecondScreen from './src/components/Screen2';
import Login from './src/components/Login';


const DrawerExample = DrawerNavigator(
  {
    'Login/Logout': {
        path: '/',
        screen: Login
    },
    Pesquisar: {
        path: '/',
        screen: SearchScreen
    },
    Second: {
        path: '/',
        screen: SecondScreen
    },
    Lol: {
        path: '/',
        screen: SecondScreen
    },
    Fourth: {
        path: '/',
        screen: SecondScreen
    }
  },
  {
      initialRouteName: "Login/Logout",
      initialRouteParams: { miguel: 'LOL' },
      drawerPosition: 'left',  
      contentOptions: {
        activeTintColor: 'red',
      }
  }
);

//Render it to the device
AppRegistry.registerComponent('MobilePromo', () => DrawerExample);
