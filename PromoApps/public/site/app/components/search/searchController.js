/**
* Search Controller
*/
'use strict';

app.controller('SearchController', function ($scope, $location, $http, $rootScope, $state, $filter, FilterbarService) {
	console.log("Search Controller reporting for duty.");

	FilterbarService.clearFilterbarItems();
	//FilterbarService.addFilterbarItem({Title:$state.params.q});

	$scope.currentPage = 0;
	$scope.pageSize = {
		"type": "select", 
		"name": "pageSize",
		"value": 10, 
		"values": [10, 20, 40] 
	};

	$scope.data = [];
	$scope.q = '';

	$scope.orderOptions = [
	{ name: "Ordenar por Relevancia", value:"relevancia"},
	{ name: "Ordenar por Marca", value:"marca"}, 
	{ name: "Ordenar por Preço: mais caro", value:"-preco"},
	{ name: "Ordenar por Preço: mais barato", value:"preco"},
	{ name: "Ordenar por A-Z", value:"name"}
	];
	$scope.orderSelectedOption = $scope.orderOptions[0];

	for (var i=0; i<65; i++) {
		if(i%9==0){
			$scope.data.push({name:"Item "+i,marca:"asda",categoria:"cenas",id:i});
		}else if(i%5==0){
			$scope.data.push({name:"Item "+i,marca:"nestle",categoria:"doces",id:i});
		}else{
			$scope.data.push({name:"Item "+i,marca:"compal",categoria:"bebidas",id:i});
		}
		FilterbarService.addFilterbarItem($scope.data[i]);
		FilterbarService.addBrandListItem({brand:$scope.data[i].marca});
		FilterbarService.addCategoryListItem({category:$scope.data[i].categoria});
	}

	$scope.getData = function () {
		var arrayData = $filter('filter')($scope.data, $scope.q);
		var arrayBrand = $filter('filter')($scope.data, FilterbarService.getBrand());
		var arrayCategory = $filter('filter')($scope.data, FilterbarService.getCategory());

		var arrayAux = arrayData.filter(function(n) {
			return arrayBrand.indexOf(n) != -1
		});

		var result = arrayAux.filter(function(n) {
			return arrayCategory.indexOf(n) != -1
		});

		return result.length;
	}

	$scope.brandFilter = function(){
		return FilterbarService.getBrand();
	}

	$scope.categoryFilter = function(){
		return FilterbarService.getCategory();
	}

	$scope.numberOfPages = function(){
		return Math.ceil($scope.getData()/$scope.pageSize.value);                
	}

	$scope.resetCurrentPage = function(){
		$scope.currentPage = 0;
	}

	$scope.$on('resetSearchCurrentPage', resetCurrentPage)

	function resetCurrentPage($event){
		$scope.currentPage = 0;
	}

	function sortDropDownListByText(selectId) {
		var foption = $('#'+ selectId + ' option:first');
		var soptions = $('#'+ selectId + ' option:not(:first)').sort(function(a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
		});
		$('#' + selectId).html(soptions).prepend(foption);              
	}

});