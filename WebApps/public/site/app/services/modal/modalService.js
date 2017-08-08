/**
* Modal Service
*/
'use strict';

app.service('ModalService', function ($uibModal, SearchService, ProductFactory) {

  var service = this;

  var modalInstance;

  var productRequest = function(){
    var pid = SearchService.productid;
    var prid = SearchService.productretailerid;

    return ProductFactory.product(pid,prid)            
    .then(function (response) {
      return response.data;
    }, function (error) {
      console.log('Unable to load product data: ' + error.data);
    });
  }


  service.loginForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: true,
      templateUrl: 'site/app/components/login/loginView.html',
      controller: 'LoginController'
    });

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });
  };


  service.registerForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: true,
      templateUrl: 'site/app/components/register/registerView.html',
      controller: 'RegisterController'
    });

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });

  };

  service.changePasswordForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: false,
      templateUrl: 'site/app/components/password/passwordView.html',
      controller: 'PasswordController'
    });

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });

  };

  service.productForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: true,
      templateUrl: 'site/app/components/product/productView.html',
      controller: 'ProductController',
      resolve: {
        productRequest : productRequest,
      }
    });

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });

  };

  service.CallRegisterForm = function(){
    modalInstance.close();
    service.registerForm();
  }

  service.CallLoginForm = function(){
    modalInstance.close();
    service.loginForm();
  }

  service.CloseModalForm = function(){
    modalInstance.close();
  }

})