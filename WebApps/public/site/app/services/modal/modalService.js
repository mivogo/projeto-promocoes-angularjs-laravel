/**
* Modal Service
*/
'use strict';

app.service('ModalService', function ($uibModal, SearchService, ProductFactory, ProfileFactory, AuthService) {

  var service = this;

  service.shoppingListId = '';

  var modalInstance = null;

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

  var favoritesRequest = function(){
    if(AuthService.isAuthenticated()){
      return ProfileFactory.favoriteProducts()            
      .then(function (response) {
        return response.data;
      }, function (error) {
        console.log('Unable to load favorite produtcs data: ' + error.data);
      });
    }
    return [];
  }

  var shoppingListProductsRequest = function(){
    if(AuthService.isAuthenticated()){
      return ProfileFactory.shoppingListProducts(service.shoppingListId)            
      .then(function (response) {
        return response.data;
      }, function (error) {
        console.log('Unable to load shopping list products data: ' + error.data);
      });
    }
    return [];
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
      windowClass: 'modal-favoriteproduct',
      resolve: {
        productRequest : productRequest,
        favoritesRequest : favoritesRequest,
      }
    });

    service.CloseModalForm();

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });

  };

  service.shoppingListForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: false,
      templateUrl: 'site/app/components/shoppingListProducts/shoppingListProductsView.html',
      controller: 'ShoppingListProductsController',
      windowClass: 'modal-shoppinglist',
      resolve: {
        shoppingListProductsRequest: shoppingListProductsRequest,
      }
    });

    service.CloseModalForm();

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect
        }, function () {
          service.CloseModalForm();
        });

  };

    service.saveShoppingListForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: false,
      templateUrl: 'site/app/components/dialogSaveShoppingList/dialogSaveShoppingListView.html',
      controller: 'DialogSaveShoppingListController',
      windowClass: 'modal-saveshoppinglist'
    });

    service.CloseModalForm();

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
    if(modalInstance){
      modalInstance.close();
    }
  }

  service.setShoppingListId = function(id){
    service.shoppingListId = id;
  }

});