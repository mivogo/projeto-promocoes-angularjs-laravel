/**
* Auth Service
*/
'use strict';

app.service('AuthService', function ($auth, $state, toastr, CartService) {

  var service = this;

  service.isAuthenticated = function() {
    return $auth.isAuthenticated();
  }

  service.login = function(response){
    toastr.success('Autenticação realizada com sucesso');
    service.changeUser(response.name);
  }

  service.register = function(response){
    $auth.setToken(response.token);
    toastr.success('Registo e autenticação realizados com sucesso');
    service.changeUser(response.name);
    $state.go('home');
  }

  service.logout = function(){
    $auth.logout()
    .then(function() {
      clearLocalStorageData();
      $state.go('home');
    });
  };

  service.currentUser = function(){
    return localStorage.getItem('user');
  }

  service.changeUser = function(user){
    localStorage.setItem('user', user);
  }

  function clearLocalStorageData(){
    localStorage.removeItem('user');    
    localStorage.removeItem('notificationsNotRead');
    CartService.clearListData();
  }

});