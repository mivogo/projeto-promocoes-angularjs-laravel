/**
* Profile Controller
*/
'use strict';

app.controller('ProfileController', function ($scope, $location, $http, $rootScope, $state, $auth, toastr, AuthService, ModalService, ProfileFactory, profileRequest) {
	console.log("Profile Controller reporting for duty.");

	$scope.name = profileRequest.name;
	$scope.email = profileRequest.email;
	
	if(profileRequest.location){
		var zipcode = profileRequest.location.split("-");
		$scope.zipone = zipcode[0];
		$scope.ziptwo = zipcode[1];
	}

	$scope.updateProfile = function(){

		var zcode = null;
		if($scope.zipone && $scope.ziptwo){
			zcode = $scope.zipone + '-' + $scope.ziptwo;
		}

		var profile = {
			name: $scope.name,
			zipcode: zcode
		}

		//IMPLEMENTAR MODAL PARA ALTERAR PASSWORD
		if( profile.password ) {
			AuthService.logout();
		}
		
		ProfileFactory.updateProfile(profile)            
		.then(function (response) {
			AuthService.changeUser(response.data.name);
			$state.reload();
		}, function (error) {
			console.log('Unable to load profile data: ' + error);
		});
		
	}

	$scope.changePassword = function(){
		ModalService.changePasswordForm();
	}

	$scope.viewFavoriteProducts = function(){
		$state.go('favoriteProducts');
	}

	$scope.viewShoppingLists = function(){
		$state.go('shoppingLists');
	}

	$scope.viewNotifications = function(){
		$state.go('notifications')
	}

});