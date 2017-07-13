/**
* Configure the Routes
*/
app.config(['$routeProvider', function ($routeProvider) {
$routeProvider
// Home

/**
.when("/", {templateUrl: "components/home.html", controller: "HomeController"})

// Pages
.when("/about", {templateUrl: "components/about.html", controller: "AboutController"})
.when("/faq", {templateUrl: "components/faq.html", controller: "FaqController"})

// else 404
.otherwise("/404", {templateUrl: "components/404.html", controller: "PageCtrl"});
*/

}]);