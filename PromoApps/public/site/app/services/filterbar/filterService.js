/**
* Filterbar Service
*/
'use strict';

app.service('FilterbarService', function () {

  var service = this;

  // on startup, no menu items are defined. Modules can use addSidebar to add their sidebaritems
  service.filterbarItems = [];
  service.brandListItems = [];
  service.categoryListItems = [];
  service.brand = '';
  service.category = '';

  // remove all menu bar items
  service.clearFilterbarItems = function() {
    service.filterbarItems = [];
  }

  // add a menu item
  service.addFilterbarItem = function(item) {

    service.filterbarItems.push(item);

    // sort by order parameter
    service.filterbarItems.sort(function (a, b) { 
      return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); 
    });
  }

  service.addBrandListItem = function(item){
    var exists = false;
    angular.forEach(service.brandListItems, function(value, key){
      if(value.brand == item.brand){
        exists = true;
      }
    });

    if(!exists){
      service.brandListItems.push(item);
    }
  }

  service.addCategoryListItem = function(item){
    var exists = false;
    angular.forEach(service.categoryListItems, function(value, key){
      if(value.category == item.category){
        exists = true;
      }
    });

    if(!exists){
      service.categoryListItems.push(item);
    }
  }

  service.setBrand = function(brand){
    service.brand = brand;
  }

  service.setCategory = function(category){
    service.category = category;
  }

  service.getBrand = function(){
    return service.brand;
  }

  service.getCategory = function(){
    return service.category;
  }

});