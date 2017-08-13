import React from 'react';
import { AppRegistry, View } from "react-native";
import { DrawerNavigator } from "react-navigation";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Header from './src/components/header';
import Footer from './src/components/Footer';
import ProductList from './src/components/ProductList';
import FirstScreen from './src/components/SearchScreen';
import SecondScreen from './src/components/Screen2';

const DrawerExample = DrawerNavigator(
  {
    First: {
        path: '/',
        screen: FirstScreen
    },
    Second: {
        path: '/sent',
        screen: SecondScreen
    }
  },
  {
      initialRouteName: 'First',
      drawerPosition: 'left',
      contentOptions: {
        activeTintColor: 'red',
      }
  }
);

//Render it to the device
AppRegistry.registerComponent('MobilePromo', () => DrawerExample);
