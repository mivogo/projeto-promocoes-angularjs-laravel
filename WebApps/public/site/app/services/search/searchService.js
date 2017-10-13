/**
* Search Service
*/
'use strict';

app.service('SearchService', function ($cookies) {

  var service = this;

  service.navigationUrl = null;
  service.search = '';
  
  service.pageSize = {};
  service.pageSize.value = 16;
  service.pageSize.values = [8,16,32,48];
  service.orderOptions = [
  { name: "Ordenar por Relevancia", value:"relevance"},
  { name: "Ordenar por Marca", value:"brand"}, 
  { name: "Ordenar por Preço: mais caro", value:"-price"},
  { name: "Ordenar por Preço: mais barato", value:"price"},
  { name: "Ordenar por A-Z", value:"name"}
  ];
  service.selectedOrderOption = service.orderOptions[0];

  service.productid = null;
  service.productretailerid = null;


  service.clearProductIds = function() {
    service.productid = null;
    service.productretailerid = null;
  }

  service.clearUrl = function() {
    service.navigationUrl = null;
  }

  service.setProductId = function(productid){
    service.productid = productid;
  }

  service.setProductRetailerId = function(productretailerid){
    service.productretailerid = productretailerid;
  }

  service.getProductId = function(){
    return service.productid;
  }

  service.getProductRetailerId = function(){
    return service.productretailerid;
  }

  service.setSearch = function(search){
    service.search = search;
  }

  service.getSearch = function(){
    return service.search;
  }

  service.getSelectedOrderOption = function(){
    return service.selectedOrderOption;
  }

  service.changeSelectedOrderOption = function (option){
    service.selectedOrderOption = option;
  }

  service.pageSizeValue = function(value){
    return service.pageSize.value;
  }

  service.changePageSizeValue = function(value){
    service.pageSize.value = value;
  }

  service.pageSizeValuesList = function(value){
    return service.pageSize.values;
  }

  service.orderOptionsList = function(){
    return service.orderOptions;
  }

  service.changeNavigationUrl = function(url){
    service.navigationUrl = url;
  }

  service.getNavigationUrl = function(){
    return service.navigationUrl;
  }

});