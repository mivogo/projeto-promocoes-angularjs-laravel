/**
* Profile Notifications Controller
*/

'use strict';

app.controller('ProfileNotificationsController', function ($scope, $state, allNotificationsRequest, NotificationService) {
	console.log("Profile Notification Controller reporting for duty.");

	$scope.notifications = allNotificationsRequest;

	console.log($scope.notifications);

	$scope.markAsRead = function(id){
		NotificationService.markAsRead(id);
	}

	$scope.markAllAsRead = function(){
		NotificationService.markAllAsRead();
	}

	$scope.searchProduct = function(name){
		$state.go('search', {q:name}, {reload:true});
	}

});