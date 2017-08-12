//Import libraries for making a Component
import React, { Component } from 'react';
import { Text, View, Button, Image, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

//Make a Component
const Header = (props) => {
    return (
      <View style={styles.viewStyle}>
        <Button
          onPress={() => props.navigation.navigate('DrawerOpen')}
          title="Menu"
          style={{ alignSelf: "flex-start", alignSelf: "center" }}
        />
        <View style={{
          position: 'relative',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center'}}>
        <Text style={styles.textStyle}>{props.headerText}</Text>
        </View>
      </View>
    );
};

const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    flexDirection: 'row',
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: 'black',
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20
  }
};
// Make the component available to other parts of the app
export default Header;
