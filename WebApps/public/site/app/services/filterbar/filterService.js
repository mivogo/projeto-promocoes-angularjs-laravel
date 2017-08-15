/**
* Filterbar Service
*/
'use strict';

app.service('FilterbarService', function ($cookies) {

  var service = this;

  service.brandListItems = [];
  service.categoryListItems = [];
  service.retailerListItems = [];
  service.brand = '';
  service.category = '';
  service.retailer = $cookies.getObject('myRetailer');

  service.clearRetailerListItems = function() {
    service.retailerListItems = [];
  }

  service.clearBrandListItems = function() {
    service.brandListItems = [];
  }

  service.clearCategoryListItems = function() {
    service.categoryListItems = [];
  }

  service.deselectBrands = function(){
    angular.forEach(service.brandListItems, function(value, key){
      value.checked = false;
    });
  }

  service.deselectCategories = function(){
    angular.forEach(service.categoryListItems, function(value, key){
      value.checked = false;
    });
  }

  service.addBrandListItem = function(item){
    var exists = false;
    angular.forEach(service.brandListItems, function(value, key){
      if(value.name.toLowerCase() == item.name.toLowerCase()){
        exists = true;
        if(item.checked == true){
          value.checked = true;
        }
      }
    });

    if(!exists){
      if(service.brand.name && item.name.toLowerCase() == service.brand.name.toLowerCase()){
        item.checked = true;
      }
      service.brandListItems.push(item);
      service.brandListItems.sort(function (a, b) { 
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); 
      });
    }
  }

  service.addRetailerListItem = function(item){
    service.retailerListItems.push(item);
  }

  service.addCategoryListItem = function(item){
    var exists = false;
    angular.forEach(service.categoryListItems, function(value, key){
      if(value.name.toLowerCase() == item.name.toLowerCase()){
        exists = true;
        if(item.checked == true){
          value.checked = true;
        }
      }
    });

    if(!exists){
      if(service.category.name && item.name.toLowerCase() == service.category.name.toLowerCase()){
        item.checked = true;
      }
      service.categoryListItems.push(item);
      service.categoryListItems.sort(function (a, b) { 
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); 
      });
    }
  }

  service.setRetailerWithID = function (id){
    var retailer;

    angular.forEach(service.retailerListItems, function(value){
      if(value.id == id){
        retailer = value;
      }
    });

    service.setRetailer(retailer);
  }

  service.setRetailer = function (retailer){
    $cookies.putObject('myRetailer', retailer);
    service.retailer = retailer;
  }

  service.setBrand = function(brand){
    service.brand = brand;
  }

  service.setCategory = function(category){
    service.category = category;
  }

  service.getRetailer = function (){
    return service.retailer;
  }

  service.getBrand = function(){
    return service.brand;
  }

  service.getCategory = function(){
    return service.category;
  }

});