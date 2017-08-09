/**
* Cart Controller
*/

'use strict';

app.controller('CartController', function ($scope, $location, $http, ngCart) {
	console.log("Cart Controller reporting for duty.");

	$scope.ngCart = ngCart; 
});