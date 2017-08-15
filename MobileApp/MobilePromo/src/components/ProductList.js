import React, { Component } from 'react';
import { ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import ProductDetail from './ProductDetail';

class ProductList extends Component {
  state = { products: [], retailerID: 1 };

  componentWillMount() {
    const url = 'http://vps415122.ovh.net/api/productsFromRetailer/' + this.state.retailerID;
    fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
     	order: "price",
	    item_amount: "15",
	    search: "coca cola"
      })
    }).then((response) => response.json())
    .then((responseJson) => {
       this.setState({products: responseJson.products})
    })
  }

  width = Dimensions.get('window').width;
  
  renderProducts() {
    const data = this.state.products.data;
    if(this.state.products.length != 0){
    return data.map(product =>
      <ProductDetail
       key={product.id}
       product={product}
      />
     );
    }
     else{
       return <ActivityIndicator size='large' style={{flex:1, alignSelf:'center', justifyContent:'center'}} />;
     }
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
    justifyContent: 'space-around'
  }
};

export default ProductList;
