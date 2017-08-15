import React from 'react';
import { AppRegistry, View } from "react-native";
import { DrawerNavigator } from "react-navigation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './src/components/header';
import Footer from './src/components/Footer';
import ProductList from './src/components/ProductList';
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
    Third: {
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
