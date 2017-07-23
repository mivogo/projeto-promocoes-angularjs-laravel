/**
* Main AngularJS Web Application
*/
'use strict';

var app = angular.module('promocoesWebApp', ['ui.router','ui.bootstrap','satellizer','toastr']);


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

app.directive("filterbar", function() {
  return {
    restrict: 'A',
    templateUrl: 'app/shared/filterbar/filterView.html',
    scope: false,
    replace: true,
    controller: 'FilterController'
  };
});
