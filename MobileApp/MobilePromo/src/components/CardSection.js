import React from 'react';
import { View, Dimensions } from 'react-native';

const CardSection = (props) => {
  return (
    <View style={styles.containerStyle}>
      {props.children}
    </View>
  );
};

const styles = {
  containerStyle: {
    flex: 1,
    borderBottomWidth: 0,
    padding: 5,
    backgroundColor: '#fff',
    //justifyContent: 'flex-start',
    flexDirection: 'column',
    borderColor: '#ddd',
    position: 'relative'
  }
};

export default CardSection;
