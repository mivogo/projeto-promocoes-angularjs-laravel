/**
* Search Service
*/
'use strict';

app.service('SearchService', function ($cookies) {

  var service = this;

  service.url = null;
  service.search = '';
  
  service.pageSize = {};
  service.pageSize.value = 10;
  service.pageSize.values = [10,20,40];
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
    service.url = null;
  }

  service.setProductId = function(productid){
    service.productid = productid;
  }

  service.setProductRetailerId = function(productretailerid){
    service.productretailerid = productretailerid;
  }

  service.setSearch = function(search){
    service.search = search;
  }

  service.getSearch = function(){
    return service.search;
  }

});