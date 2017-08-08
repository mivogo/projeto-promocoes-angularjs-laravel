/**
* Modal Service
*/
'use strict';

app.service('ModalService', function ($uibModal) {

  var service = this;

  var modalInstance;

  service.loginForm = function(){
    var modal = $uibModal.open({
      allowAnonymous: true,
      templateUrl: 'site/app/components/login/loginView.html',
      controller: 'LoginController'
    });

    modalInstance = modal;

    modal.result.then(function () {
          // Redirect to the logged-in area of your site
        }, function () {
          // optional function. Do something if the user cancels.
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
            // Redirect to the logged-in area of your site
          }, function () {
            // optional function. Do something if the user cancels.
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
            // Redirect to the logged-in area of your site
          }, function () {
            // optional function. Do something if the user cancels.
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