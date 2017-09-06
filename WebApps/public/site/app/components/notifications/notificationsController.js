/**
* Profile Notifications Controller
*/

'use strict';

app.controller('ProfileNotificationsController', function ($scope, $state, FilterbarService, allNotificationsRequest, NotificationService) {
	//console.log("Profile Notification Controller reporting for duty.");

	$scope.notifications = allNotificationsRequest;


	$scope.numberNotifications = function(){
		return $scope.notifications.length;
	}

	$scope.markAsRead = function(id){
		NotificationService.markAsRead(id);
	}

	$scope.markAllAsRead = function(){
		NotificationService.markAllAsRead();
	}

	$scope.searchProduct = function(data){
		FilterbarService.setRetailerWithName(data.retailer_name);
		$state.go('search', {q:data.product_name,brand:data.brand_name}, {reload:true});
	}

});