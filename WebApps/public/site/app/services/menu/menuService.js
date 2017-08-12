/**
* Menu Service
*/
'use strict';

app.service('MenuService', function () {

  var service = this;

  service.categoryItems = [];
  service.subcategory = '';

  service.clearCategoryItems = function() {
    service.categoryItems = [];
  }

  service.addCategoryItem = function(item){
    var exists = false;
    angular.forEach(service.categoryItems, function(value, key){
      if(value.id == item.id){
        exists = true;
      }
    });

    if(!exists){
      service.categoryItems.push(item);
      service.categoryItems.sort(function (a, b) { 
        return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0); 
      });
    }
  }

  service.setSubcategory = function(subcategory){
    service.subcategory = subcategory;
  }

  service.getSubcategory = function(){
    return service.subcategory;
  }

});