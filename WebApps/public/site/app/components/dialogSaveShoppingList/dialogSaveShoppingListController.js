/**
* Dialog Save Shopping List Controller
*/
'use strict';

app.controller('DialogSaveShoppingListController', function ($scope, $state, $uibModal, CartService, ModalService, AuthService, ProfileFactory, FilterbarService) {
	//console.log("Dialog Save Shopping List reporting for duty.");

  $scope.name = CartService.getListName();
  $scope.description = CartService.getListDescription();

  $scope.saveList = function() {
    var data = {
      name: $scope.name
    }

    ProfileFactory.shoppinglistNameTaken(data)            
    .then(function (response) {
      var modal = $uibModal.open({
        size: 'sm',
        template: '<div class="modal-header">\
        <h3 data-ng-bind="title"></h3>\
        </div>\
        <div class="modal-body" >\
        <p class="message" data-ng-bind="message">\
        </div>\
        <div class="modal-footer">\
        <div class="dialog-buttons">\
        <a class="btn btn-primary" data-ng-click="modal.close()">Sim</a>\
        <a class="button-spacer"></a>\
        <a class="btn btn-default" data-ng-click="modal.dismiss()">Não</a>\
        </div>\
        </div>',
        controller: function ($scope, $uibModalInstance) {
         $scope.modal = $uibModalInstance;
         $scope.title = "Aviso";
         $scope.message = "Já existe uma lista com este nome. Deseja modificá-la com estes produtos?"
       }});

      modal.result.then(function () {
        saveListToServer();
      }, function () {

      });
    }, function (error) {
      saveListToServer();
    });

  };

  $scope.cancel = function(){
    ModalService.CloseModalForm();
  };

  function saveListToServer(){
    var items = CartService.getItems();
    var products = [];
    angular.forEach(items, function(item){
      if(item.available){
        products.push({id:item.id,quantity:item.quantity});
      }
    });

    var request = {
      name: $scope.name,
      description: $scope.description,
      retailer_id: FilterbarService.getRetailer().id,
      products: products
    }

    console.log(request);

    ProfileFactory.saveShoppingList(request)            
    .then(function (response) {
      ModalService.CloseModalForm();
      $state.reload();
    }, function (error) {
      console.log('Unable to save list: ' + error);
    });
  }

});