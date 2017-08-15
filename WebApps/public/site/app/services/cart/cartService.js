/**
* Cart Service
*/
'use strict';

app.service('CartService', ['ngCart', function (ngCart) {

  var service = this;

  service.listName = localStorage.getItem('listName');
  service.listDescription = localStorage.getItem('listDescription');
  
  ngCart.setTaxRate(0);
  ngCart.setShipping(0);  

  service.getTotalItems = function(){
    return ngCart.getItems().length;
  }

  service.totalCost = function(){
    return ngCart.totalCost();
  }

  service.getItems = function(){
    return ngCart.getItems();
  }

  service.addItem = function(item){
    ngCart.addItem(item.product_id,item.name,item.price,1,item);
  }

  service.hasItem = function (item){
    var exists = ngCart.getItemById(item.product_id);
    if(exists){
      return true;
    }
    return false;
  }

  service.itemQuantity = function (item){
    var qt;
    
    angular.forEach(ngCart.getItems(), function(value, key) {
      if(value.getId() == item.product_id){
        qt = value.getQuantity();
        return;
      }
    });

    return qt;
  }

  service.updateItemQuantity = function (item,quantity){
    var qt;

    angular.forEach(ngCart.getItems(), function(value, key) {
      if(value.getId() == item.product_id){
        qt = value.getQuantity();
        return;
      }
    });

    qt = qt + quantity;

    if(qt==0){
      ngCart.removeItemById(item.product_id);
    }else{
      ngCart.addItem(item.product_id,item.name,item.price,qt,item);
    }
  }

  service.itemPrice = function (item){  
    var total;

    angular.forEach(ngCart.getItems(), function(value, key) {
      if(value.getId() == item.product_id){
        total = value.getTotal();
        return;
      }
    });

    return total;
  }

  service.replaceCartWithList = function(list){
    ngCart.empty();

    angular.forEach(list, function(value, key) {
      ngCart.addItem(value.product_id,value.name,value.price,value.quantity,value);
    });
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

}]);