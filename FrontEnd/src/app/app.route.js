/**
* Routes Configuration
*/
app.config(function ($locationProvider, $routeProvider) {
    $locationProvider.html5Mode({enabled:true});
    $routeProvider
// Home

	.when("/", {templateUrl: "app/components/home/homeView.html", controller: "HomeController"})

// Pages
	.when("/about", {templateUrl: "app/components/404/404View.html", controller: "404Controller"})
	.when("/search", {templateUrl: "app/components/search/searchView.html", controller: "SearchController"})
	.when("/404", {templateUrl: "app/components/404/404View.html", controller: "404Controller"})

// else 404
	.otherwise("/404", {templateUrl: "app/components/404/404View.html", controller: "404Controller"});

});