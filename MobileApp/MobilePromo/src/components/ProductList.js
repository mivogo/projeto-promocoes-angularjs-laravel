import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import axios from 'axios';
import ProductDetail from './ProductDetail';

class ProductList extends Component {

  state = { products: [] };

  componentWillMount() {
    axios.get('http://vps415122.ovh.net/api/productsFromRetailer/2')
      .then(response => this.setState({ products: response.data }));
  }

  renderAlbums() {
    return this.state.products.map(product =>
       <ProductDetail key={product.id} product={product} />
     );
  }

  render() {
    return (
      <ScrollView>
        {this.renderAlbums()}
      </ScrollView>
    );
  }
}

export default ProductList;
