import React, { Component } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import axios from 'axios';
import ProductDetail from './ProductDetail';

class ProductList extends Component {
  state = { products: [], retailerID: 1 };

  componentWillMount() {
    const url = 'http://vps415122.ovh.net/api/productsFromRetailer/' + this.state.retailerID;
    axios.get(url)
      .then(response => this.setState({ products: response.data }));
  }

    width = Dimensions.get('window').width;
  renderProducts() {
    return this.state.products.map(product =>
       <ProductDetail
       key={product.id}
       product={product}
       />
     );
  }

  render() {
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
    alignContent: 'flex-start'
  }
};

export default ProductList;
