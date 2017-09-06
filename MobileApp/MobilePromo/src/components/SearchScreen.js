import React, { Component } from "react";
import {
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Picker,
  Modal,
  AsyncStorage
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Button from "apsl-react-native-button";
import ProductList from "./ProductList";

class SearchScreen extends Component {
  static navigationOptions = {
    tabBarLabel: "Search",
    drawerIcon: ({ tintColor }) => {
      return (
        <MaterialIcons name="search" size={24} style={{ color: tintColor }} />
      );
    }
  };

  state = {
    page: 1,
    total_pages: 0,
    noProducts: false,
    isSearchMenuVisible: true,
    isFilterMenuVisible: false,
    isLoading: true,
    retailer: 1,
    searchQuery: "banana",
    searchOrder: "relevance",
    searchBrand: "",
    category: "",
    subcategory: "",
    products: [],
    brands: [],
    categories: []
  };

  productsPost(filterMode, current_page) {
    this.setState({ isLoading: true });
    let jsonRequest = "";
    const url =
      "http://vps415122.ovh.net/api/productsFromRetailer/" +
      this.state.retailer +
      "?page=" +
      current_page;
    jsonRequest += '{"search": "' + this.state.searchQuery + '",';
    jsonRequest += '"order": "' + this.state.searchOrder + '",';
    jsonRequest += '"item_amount": "' + "20" + '",';
    if (filterMode) {
      jsonRequest += '"brand": "' + this.state.searchBrand + '",';
      jsonRequest += '"category": "' + this.state.category + '",';
    }
    jsonRequest += '"subcategory": "' + this.state.subcategory + '"}';

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: jsonRequest
    })
      .then(response => response.json())
      .then(responseJson => {
        if (filterMode) {
          if (responseJson.products.total == 0){
            this.setState({
              noProducts: true,
              products: responseJson.products,
              page: 0,
              total_pages: 0,
              isLoading: false
            });
          } else {
          this.setState({
            noProducts: false,
            products: responseJson.products,
            page: responseJson.products.current_page,
            total_pages: responseJson.products.last_page,
            isLoading: false
          });
          }
        } else {
          if (responseJson.products.total == 0) {
            this.setState({
            noProducts: true,
            products: responseJson.products,
            brands: responseJson.brands,
            categories: responseJson.categories,
            page: 0,
            total_pages: 0,
            isLoading: false
            });
          } else {
            this.setState({
              noProducts: false,
              products: responseJson.products,
              brands: responseJson.brands,
              categories: responseJson.categories,
              page: responseJson.products.current_page,
              total_pages: responseJson.products.last_page,
              isLoading: false
            });
          }
      }
  });
}

  componentWillMount() {
    this.productsPost(false, 1);
  }

  setSearchMenuVisible(visible) {
    this.setState({ isSearchMenuVisible: visible });
  }

  setFilterMenuVisible(visible) {
    this.setState({ isFilterMenuVisible: visible });
  }

  renderHeader(headerName) {
    
    return (
      <View style={styles.headerStyle}>
        {/* Menu icon and click action */}
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("DrawerOpen")}
        >
          <MaterialIcons
            name="menu"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
        </TouchableOpacity>

        {/* Header Text */}
        <View
          style={{
            position: "relative",
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "center"
          }}
        >
          <Text style={styles.headerTextStyle}>
            {headerName}
          </Text>
        </View>

        {/* Filter Menu */}
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setFilterMenuVisible(!this.state.isFilterMenuVisible);
            }}
          >
            <MaterialIcons
              name="filter-list"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
          </TouchableOpacity>
        </View>

        {/* Search Menu */}
        <View>
          <TouchableOpacity
            onPress={() => {
              this.setSearchMenuVisible(!this.state.isSearchMenuVisible);
            }}
          >
            <MaterialIcons
              name="search"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  renderFooter() {
    if(this.state.page == 1){
      return(<View style={styles.footerStyle}>
      {/* Anterior */}
      <TouchableOpacity
        disabled = {true}
        onPress={() => {
          this.productsPost(false, this.state.page - 1);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            flex: 1,
            alignItems: "center"
          }}
        >
          <MaterialIcons
            name="skip-previous"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
          <Text style={styles.footerTextStyle}>Anterior</Text>
        </View>
      </TouchableOpacity>

      {/* Páginas */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flex: 1,
          alignItems: "center"
        }}
      >
        <Text style={styles.footerTextStyle}>
          {this.state.page}
        </Text>

        <Text style={styles.footerTextStyle}>/</Text>

        <Text style={styles.footerTextStyle}>
          {this.state.total_pages}
        </Text>
      </View>

      {/* Próximo */}
      <TouchableOpacity
        onPress={() => {
          this.productsPost(false, this.state.page + 1);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            flex: 1,
            alignItems: "center"
          }}
        >
          <Text style={styles.footerTextStyle}>Próximo</Text>
          <MaterialIcons
            name="skip-next"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
        </View>
      </TouchableOpacity>
    </View>
    );
    }
    if(this.state.page == this.state.total_pages){
      return(
      <View style={styles.footerStyle}>
      {/* Anterior */}
      <TouchableOpacity
        onPress={() => {
          this.productsPost(false, this.state.page - 1);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-start",
            flex: 1,
            alignItems: "flex-start"
          }}
        >
          <MaterialIcons
            name="skip-previous"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
          <Text style={styles.footerTextStyle}>Anterior</Text>
        </View>
      </TouchableOpacity>

      {/* Páginas */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          flex: 1,
          alignItems: "center"
        }}
      >
        <Text style={styles.footerTextStyle}>
          {this.state.page}
        </Text>

        <Text style={styles.footerTextStyle}>/</Text>

        <Text style={styles.footerTextStyle}>
          {this.state.total_pages}
        </Text>
      </View>

      {/* Próximo */}
      <TouchableOpacity
        disabled = {true}
        onPress={() => {
          this.productsPost(false, this.state.page + 1);
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            flex: 1,
            alignItems: "flex-end"
          }}
        >
          <Text style={styles.footerTextStyle}>Próximo</Text>
          <MaterialIcons
            name="skip-next"
            size={40}
            style={{ color: "black", padding: 5 }}
          />
        </View>
      </TouchableOpacity>
    </View>
      );
    }
    else{
    return (
      <View style={styles.footerStyle}>
        {/* Anterior */}
        <TouchableOpacity
          onPress={() => {
            this.productsPost(false, this.state.page - 1);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              flex: 1,
              alignItems: "flex-start"
            }}
          >
            <MaterialIcons
              name="skip-previous"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
            <Text style={styles.footerTextStyle}>Anterior</Text>
          </View>
        </TouchableOpacity>

        {/* Páginas */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flex: 1,
            alignItems: "center"
          }}
        >
          <Text style={styles.footerTextStyle}>
            {this.state.page}
          </Text>

          <Text style={styles.footerTextStyle}>/</Text>

          <Text style={styles.footerTextStyle}>
            {this.state.total_pages}
          </Text>
        </View>

        {/* Próximo */}
        <TouchableOpacity
          onPress={() => {
            this.productsPost(false, this.state.page + 1);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              flex: 1,
              alignItems: "flex-end"
            }}
          >
            <Text style={styles.footerTextStyle}>Próximo</Text>
            <MaterialIcons
              name="skip-next"
              size={40}
              style={{ color: "black", padding: 5 }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
    }
  }

  convertRetailerIDtoName() {
    if (this.state.retailer === 1) {
      return "Continente";
    }
    if (this.state.retailer === 2) {
      return "Jumbo";
    }
    return "Intermarché";
  }

  renderSearchMenu() {
    
    return (
      <View style={styles.modalSearchStyle}>
        <View
          style={{
            padding: 10, 
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 2,
            borderColor: "#ddd",
            borderBottomWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5
          }}
        >
          {/* Pesquisa */}
          <Text style={{ fontSize: 20 }}>Termos a pesquisar:</Text>
          <TextInput
            style={{ height: 40, borderColor: "gray", borderWidth: 0 }}
            onChangeText={text => this.setState({ searchQuery: text })}
            defaultValue={this.state.searchQuery}
          />

          {/* Superfície Comercial */}
          <Text style={{ fontSize: 20 }}>Superfície comercial:</Text>
          <Picker
            selectedValue={this.state.retailer}
            onValueChange={itemValue => this.setState({ retailer: itemValue })}
          >
            <Picker.Item label="Continente" value="1" />
            <Picker.Item label="Jumbo" value="2" />
            <Picker.Item label="Intermarché" value="3" />
          </Picker>

          {/* Botão pesquisar */}
          <Button
            onPress={() => {
              this.setState({ isLoading: true });
              this.productsPost(false, 1);
              this.setSearchMenuVisible(!this.state.isSearchMenuVisible);
            }}
            style={{ borderColor: "blue" }}
            textStyle={{ color: "blue" }}
          >
            Pesquisar
          </Button>
        </View>
      </View>
    );
  }

  renderFilterBrands() {
    
    if (!this.state.isLoading && this.state.brands.length !== 0) {
      
      
      return this.state.brands.map((brand, index) =>
        <Picker.Item key={index} label={brand} value={brand} />
      );
    }
  }

  renderFilterCategories() {
    
    if (!this.state.isLoading && this.state.categories.length !== 0) {
      
      
      return this.state.categories.map((category, index) =>
        <Picker.Item key={index} label={category} value={category} />
      );
    }
  }

  renderFilterMenu() {
    
    return (
      <View style={styles.modalFilterStyle}>
        <View
          style={{
            padding: 10,
            backgroundColor: 'white',
            borderWidth: 1,
            borderRadius: 2,
            borderColor: '#ddd',
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
            marginLeft: 5,
            marginRight: 5,
            marginTop: 5,
            marginBottom: 5

          }}
        >
          {/* Ordenação */}
          <Text style={{ fontSize: 20 }}>Ordernar por:</Text>
          <Picker
            selectedValue={this.state.searchOrder}
            onValueChange={itemValue =>
              this.setState({ searchOrder: itemValue })}
          >
            <Picker.Item label="Relevância" value="relevance" />
            <Picker.Item label="Mais caros primeiro" value="-price" />
            <Picker.Item label="Mais baratos primeiro" value="price" />
            <Picker.Item label="Marca" value="brand" />
            <Picker.Item label="Ordem alfabética" value="name" />
          </Picker>

          {/* Marcas */}
          <Text style={{ fontSize: 20 }}>Filtrar por marca:</Text>
          <Picker
            selectedValue={this.state.searchBrand}
            onValueChange={itemValue =>
              this.setState({ searchBrand: itemValue })}
          >
            <Picker.Item key="-1" label="(Não filtrar)" value="" />
            {this.renderFilterBrands()}
          </Picker>

          {/* Categorias */}
          <Text style={{ fontSize: 20 }}>Filtrar por categoria:</Text>
          <Picker
            selectedValue={this.state.category}
            onValueChange={itemValue => this.setState({ category: itemValue })}
          >
            <Picker.Item key="-1" label="(Não filtrar)" value="" />
            {this.renderFilterCategories()}
          </Picker>

          {/* Botão pesquisar */}
          <Button
            onPress={() => {
              this.setState({ isLoading: true });
              this.productsPost(true, 1);
              this.setFilterMenuVisible(!this.state.isFilterMenuVisible);
            }}
            style={{ borderColor: "blue" }}
            textStyle={{ color: "blue" }}
          >
            Filtrar
          </Button>
        </View>
      </View>
    );
  }

  render() {
    console.log(this.state.noProducts);
    if (this.state.noProducts) {
      return (
      <View style={{ flex: 1 }}>
      <Modal
        animationType={"fade"}
        visible={this.state.isSearchMenuVisible}
        onRequestClose={() =>
          this.setSearchMenuVisible(!this.state.isSearchMenuVisible)}
        transparent={true}
      >
        {this.renderSearchMenu()}
      </Modal>

      <Modal
        animationType={"fade"}
        visible={this.state.isFilterMenuVisible}
        onRequestClose={() =>
          this.setFilterMenuVisible(!this.state.isFilterMenuVisible)}
        transparent={true}
      >
        {this.renderFilterMenu()}
      </Modal>

      {this.renderHeader("Resultados")}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View>
            <MaterialIcons
              name="warning"
              size={24}
              style={{ color: 'red' }}
            />
            </View>
            <View>
            <Text style={{ fontSize: 20, textAlign: 'center' }}>A pesquisa não retornou resultados</Text>
            </View>
      </View>
      {this.renderFooter()}
    </View>
    );
    } else {
    return (
      <View style={{ flex: 1 }}>
        <Modal
          animationType={"fade"}
          visible={this.state.isSearchMenuVisible}
          onRequestClose={() =>
            this.setSearchMenuVisible(!this.state.isSearchMenuVisible)}
          transparent={true}
        >
          {this.renderSearchMenu()}
        </Modal>

        <Modal
          animationType={"fade"}
          visible={this.state.isFilterMenuVisible}
          onRequestClose={() =>
            this.setFilterMenuVisible(!this.state.isFilterMenuVisible)}
          transparent={true}
        >
          {this.renderFilterMenu()}
        </Modal>

        {this.renderHeader("Resultados")}
        <ProductList
          retailer={this.state.retailer}
          isItLoading={this.state.isLoading}
          products={this.state.products.data}
        />
        {this.renderFooter()}
      </View>
    );
  }
  }
}

const styles = {
  modalSearchStyle: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "stretch",
    justifyContent: "center"
  },
  modalFilterStyle: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignSelf: "stretch",
    justifyContent: "center"
  },
  containerStyle: {
    width: Dimensions.get("window").width / 2 - 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10
  },
  headerStyle: {
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    height: 60,
    paddingTop: 5,
    paddingBottom: 5,
    shadowColor: "black",
    shadowOffset: { width: 20, height: 20 },
    shadowOpacity: 0.5,
    elevation: 10,
    position: "relative"
  },
  footerStyle: {
    backgroundColor: "#F8F8F8",
    alignSelf: "center",
    flexDirection: "row",
    height: 60,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: "#ddd",
    borderBottomWidth: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2
  },
  headerTextStyle: {
    fontSize: 20
  },
  footerTextStyle: {
    fontSize: 20,
    alignSelf: "center"
  }
};

export default SearchScreen;
