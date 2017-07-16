/**
* Search Controller
*/
app.controller('SearchController', function ($scope, $location, $http, $rootScope, $state,FilterbarService) {
	console.log("Search Controller reporting for duty.");

	FilterbarService.clearFilterbarItems();
	FilterbarService.addFilterbarItem({Title:$state.params.q});
});