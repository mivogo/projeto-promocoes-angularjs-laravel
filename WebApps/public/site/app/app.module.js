/**
* Main AngularJS Web Application
*/
'use strict';

var app = angular.module('promocoesWebApp', ['ui.router','ui.bootstrap','ui.select','ngCookies','satellizer','toastr','ngCart']);


app.directive("header", function() {
  return {
    restrict: 'A',
    templateUrl: 'site/app/shared/header/headerView.html',
    scope: true,
    transclude : false,
    controller: 'HeaderController'
  };
});

app.directive("menu", function() {
  return {
    restrict: 'A',
    templateUrl: 'site/app/shared/menu/menuView.html',
    scope: true,
    transclude : false,
    controller: 'MenuController'
  };
});

app.directive("footer", function() {
  return {
    restrict: 'A',
    templateUrl: 'site/app/shared/footer/footerView.html',
    scope: true,
    transclude : false,
    controller: 'FooterController'
  };
});

app.directive("filterbar", function() {
  return {
    restrict: 'A',
    templateUrl: 'site/app/shared/filterbar/filterView.html',
    scope: false,
    replace: true,
    controller: 'FilterController'
  };
});


app.directive('pwstr',['$parse', function ($parse) {
  return {
    require: 'ngModel',
    restrict: 'A',
    link: function(scope, elem, attrs, ctrl) {

      ctrl.$parsers.unshift(function(viewValue) {
        var pwdValidLength, pwdHasLetter, pwdHasNumber;
        
        pwdValidLength = (viewValue && viewValue.length >= 6 ? true : false);
        pwdHasLetter = (viewValue && /[A-z]/.test(viewValue)) ? true : false;
        pwdHasNumber = (viewValue && /\d/.test(viewValue)) ? true : false;
        
        if( pwdValidLength && pwdHasLetter && pwdHasNumber ) {
          ctrl.$setValidity('pwd', true);
        } else {
          ctrl.$setValidity('pwd', false);                    
        }
        return viewValue;
      });
    },
  };
}]);


