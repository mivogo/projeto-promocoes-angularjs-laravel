/**
* Cart Service
*/
'use strict';

app.service('CartService', ['RetailerFactory','CartProduct', function (RetailerFactory, CartProduct) {

  var service = this;
  var observerCallbacks = [];

  service.listName = localStorage.getItem('listName');
  service.listDescription = localStorage.getItem('listDescription');

  service.carts = JSON.parse(localStorage.getItem('carts'));
  if(service.carts == null){
    service.carts = new Array();
  }

  service.activeCart = service.carts[localStorage.getItem('activeCart')]; 

  service.initRetailerCart = function(id){
    if(service.carts[id-1] == null) {
      service.carts[id-1] = new Array();

      if(service.activeCart == null){
        service.activateCart(id);
      }

      updateLocalStorageCarts();
    }
  }

  service.activateCart = function(id){
    service.activeCart = service.carts[id-1];
    updateLocalStorageActiveCart(id-1);
    notifyObservers();
  }

  service.getActiveCart = function(){
    return service.activeCart;
  }

  service.getTotalItems = function(){
    if(service.activeCart == null){
      return 0;
    }

    return service.activeCart.length;
  }

  service.totalCost = function(){
    var totalCost = 0;
    var arr = service.activeCart;

    if(arr == null){
      return totalCost;
    }

    totalCost = calculateTotalCost(arr);

    return totalCost;
  }

  service.getItems = function(){
    return service.activeCart;
  }

  service.addItem = function(item){
    RetailerFactory.productAvailability(item.product_id)            
    .then(function (response) {
      var result = response.data;

      angular.forEach(result, function(value, key) {
        var cartp = null;
        var product = null;
        var suggestions = null;
        var quantity = 1;

        if(value.available){
          product = value.product;
          suggestions = [];
        }

        if(!value.available){
          product = item;
          suggestions = value.suggestions;
        }

        if(item.quantity){
          quantity = item.quantity;
        }

        var data = {
          id: product.product_id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          data: product,
          suggestions: suggestions,
          available: value.available
        };

        cartp = CartProduct.build(data);
        
        addProductToCart(value.retailer_id,cartp);
      });
    }, function (error) {
      console.log('Unable to remove favorite product: ' + error);
    });
  }

  service.removeItemById = function(id){
    var arr = service.activeCart;
    var index = null;

    for(var i = 0; i < arr.length; i++) {
      if (arr[i].id == id) {
        index = i;
        break;
      }
    }
    
    if(index != null){
      removeProductFromCarts(index);
    }

    updateLocalStorageCarts();
  }

  service.hasItem = function (item){
    var arr = service.activeCart;
    var exists = false;

    if(arr == null){
      return exists;
    }

    for(var i = 0; i < arr.length; i++) {
      if(arr[i].id == item.product_id){
        exists = true;
        break;
      }
    }

    return exists;
  }

  service.itemQuantity = function (item){
    var qt = 0;
    var arr = service.activeCart;

    if(arr == null){
      return qt;
    }

    for(var i = 0; i < arr.length; i++) {
      if(arr[i].id == item.product_id){
        qt = arr[i].quantity;
        break;
      }
    }

    return qt;
  }

  service.updateItemQuantity = function (item, quantity){
    var qt;
    var index;
    var arr = service.activeCart;

    for(var i = 0; i < arr.length; i++) {
      if (arr[i].id == item.product_id) {
        qt = arr[i].quantity+quantity;
        index = i;

        break;
      }
    }

    updateCartsProductQuantity(index, quantity);

    if(qt == 0){
      removeProductFromCarts(index);
    }

    updateLocalStorageCarts();
    notifyObservers();
  }

  service.itemPrice = function (item){  
    var total = 0;
    var arr = service.activeCart;

    if(arr == null){
      return total;
    }

    for(var i = 0; i < arr.length; i++) {
      if(arr[i].id == item.product_id){
        total = arr[i].price * arr[i].quantity
        break;
      }
    }

    return total;
  }

  service.hasUnavailableProducts = function(id){
    var arr = service.carts[id-1];

    for(var i = 0; i < arr.length; i++) {
      if (arr[i].available == false) {
        return true;
      }
    }

    return false;
  }

  service.replaceItemWithSuggestion = function (index, product){
    var arr = service.activeCart;
    var quantity = arr[index].quantity;
    var cartp;

    var data = {
      id: product.product_id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      data: product,
      suggestions: [],
      available: true
    };

    cartp = CartProduct.build(data);
    arr.splice(index, 1, cartp);

    updateLocalStorageCarts();
    notifyObservers();
  }

  service.replaceCartWithList = function(list){
    service.emptyCarts();

    var info = list.list;
    var products = list.products;

    service.activeCart = null;

    service.setListName(info.name);
    service.setListDescription(info.description);

    angular.forEach(products, function(value, key) {
      service.addItem(value);
    });

    service.activateCart(info.retailer_id);
  }

  service.emptyCarts = function(){
    angular.forEach(service.carts, function(arr) {
      arr.splice(0,arr.length);
    });

    updateLocalStorageCarts();
    notifyObservers();
  }

  service.retailerTotalCost = function(id){
    var arr = service.carts[id-1];
    var totalCost = 0;

    if(arr == null){
      return totalCost;
    }

    totalCost = calculateTotalCost(arr);
    return totalCost;
  }

  service.setListName = function(name){
    service.listName = name;
    localStorage.setItem('listName', name);
  }

  service.getListName = function(){
    return service.listName;
  }

  service.setListDescription = function(description){
    service.listDescription = description;
    localStorage.setItem('listDescription', description);
  }

  service.getListDescription = function(){
    return service.listDescription;
  }

  service.registerObserverCallback = function(callback){
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };

  function updateLocalStorageCarts(){
    localStorage.setItem('carts', JSON.stringify(service.carts));
  }

  function updateLocalStorageActiveCart(id){
    localStorage.setItem('activeCart', id);
  }

  function updateCartsProductQuantity(index, quantity){
    angular.forEach(service.carts, function(arr){
      arr[index].quantity += quantity;
      arr[index].total = arr[index].price * arr[index].quantity;
    });
  }

  function addProductToCart(id, product){
    var found = false;
    var arr = service.carts[id-1];
    for(var i = 0; i < arr.length; i++) {
      if (arr[i].product_id == product.id) {
        arr[i].quantity = product.quantity;
        arr[i].total = arr[i].price * arr[i].quantity;

        found = true;
        break;
      }
    }

    if(!found){
      arr.push(product);
    }

    updateLocalStorageCarts();
  }

  function removeProductFromCarts(index){
    angular.forEach(service.carts, function(arr) {
      arr.splice(index, 1);
    });
  }

  function calculateTotalCost(array){
    var totalCost = 0;

    for(var i = 0; i < array.length; i++) {
      if(array[i].available){
        totalCost += array[i].price * array[i].quantity;
      }
    }

    return totalCost;
  }

}]);