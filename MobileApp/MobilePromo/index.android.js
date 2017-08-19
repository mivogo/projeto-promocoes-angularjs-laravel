import React from 'react';
import { AppRegistry } from "react-native";
import { DrawerNavigator } from "react-navigation";
import SearchScreen from './src/components/SearchScreen';
import SecondScreen from './src/components/Screen2';

const DrawerExample = DrawerNavigator(
  {
    Pesquisar: {
        path: '/',
        screen: SearchScreen
    },
    Second: {
        path: '/sent',
        screen: SecondScreen
    },
    Lol: {
        path: '/sent',
        screen: SecondScreen
    },
    Fourth: {
        path: '/sent',
        screen: SecondScreen
    }
  },
  {
      initialRouteName: 'Pesquisar',
      drawerPosition: 'left',
      contentOptions: {
        activeTintColor: 'red',
      }
  }
);

//Render it to the device
AppRegistry.registerComponent('MobilePromo', () => DrawerExample);
