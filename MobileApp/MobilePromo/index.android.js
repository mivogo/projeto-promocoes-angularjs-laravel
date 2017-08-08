// Android

// Import  alibrary to help create a Component
import React from 'react';
import { AppRegistry, View } from 'react-native';
import Header from './src/components/Header';
import Footer from './src/components/Footer';
import ProductList from './src/components/ProductList';

// Create a Component
const App = () => (
  <View style={{ flex: 1 }}>
    <Header headerText={'Products'} />
    <ProductList />
    <Footer footerText={'Test'} />
  </View>
);

//Render it to the device
AppRegistry.registerComponent('MobilePromo', () => App);
