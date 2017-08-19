/**
* Notification Controller
*/

'use strict';

app.controller('NotificationController', function ($scope, $state, NotificationService) {
	console.log("Notification Controller reporting for duty.");

	$scope.notifications = localStorage.getItem('notificationsNotRead');

	$scope.markAsRead = function(id){
		NotificationService.markAsRead(id);
	}

	$scope.markAllAsRead = function(){
		NotificationService.markAllAsRead();
	}

	$scope.totalNotifications = function(){

		return NotificationService.totalNotificationsNotRead();
	}

	$scope.searchProduct = function(name){
		$state.go('search', {q:name}, {reload:true});
	}

	$scope.$on('notificationService: changed', function() {
		$scope.notifications = NotificationService.getNotificationsNotRead();
	});
});