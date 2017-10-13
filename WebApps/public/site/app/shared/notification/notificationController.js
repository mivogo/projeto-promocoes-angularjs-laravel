/**
* Notification Controller
*/

'use strict';

app.controller('NotificationController', function ($scope, $state, FilterbarService, NotificationService) {
	//console.log("Notification Controller reporting for duty.");

	var updateNotifications = function(){
		$scope.notifications = NotificationService.getNotificationsNotRead();
	};

	NotificationService.registerObserverCallback(updateNotifications);

	$scope.notifications = NotificationService.getNotificationsNotRead();

	$scope.markAsRead = function(id){
		NotificationService.markAsRead(id);
	}

	$scope.markAllAsRead = function(){
		NotificationService.markAllAsRead();
	}

	$scope.totalNotifications = function(){
		return NotificationService.totalNotificationsNotRead();
	}

	$scope.searchProduct = function(data){
		FilterbarService.setRetailerWithName(data.retailer_name);
		$state.go('search', {q:data.product_name,brand:data.brand_name}, {reload:true});
	}

});