/**
* Main AngularJS Web Application
*/
var app = angular.module('promocoesWebApp', ['ngRoute','ui.bootstrap']);

app.directive("header", function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/header/headerView.html',
    scope: true,
    transclude : false,
    controller: 'HeaderController'
  };
});

app.directive("footer", function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/footer/footerView.html',
    scope: true,
    transclude : false,
    controller: 'FooterController'
  };
});