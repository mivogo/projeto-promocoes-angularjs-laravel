import React, { Component } from 'react';
import { ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import ProductDetail from './ProductDetail';

class ProductList extends Component {
  state = { products: [], isLoading: false };

  componentWillReceiveProps(nextProps) {
    if(nextProps.isItLoading){
      this.setState({ isLoading: true });
    }
    else{
      this.setState({ isLoading: false });
    }
    this.setState({ products: nextProps.products });
  }

  width = Dimensions.get('window').width;
  
  renderProducts() {
    console.log(' Render Products ');
    const data = this.state.products;
    console.log(this.state.products);
    if (this.state.products.length !== 0 && !(this.state.isLoading)) {
    return data.map(product =>
      <ProductDetail
       key={product.id}
       product={product}
      />
     );
    }
    return <ActivityIndicator 
    size='large' 
    style={{ flex: 1, alignSelf: 'center', justifyContent: 'center' }} 
    />;
  }

  render() {
    console.log(' RENDER RENDER');
    return (
      <ScrollView
      contentContainerStyle={styles.contentContainer}
      >
        {this.renderProducts()}
      </ScrollView>
    );
  }
}

const styles = {
  contentContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  }
};

export default ProductList;
