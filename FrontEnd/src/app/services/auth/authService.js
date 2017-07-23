/**
* Auth Service
*/
'use strict';

app.service('AuthService', function ($auth, $state, toastr) {

  var service = this;

  service.isAuthenticated = function() {
    return $auth.isAuthenticated();
  }

  service.login = function(response){
    toastr.success('Autenticação realizada com sucesso');
    localStorage.setItem('user', response.name);
    //$location.path('/asdas');
  }

  service.register = function(response){
    $auth.setToken(response.token);
    toastr.success('Registo e autenticação realizados com sucesso');
    localStorage.setItem('user', response.name);
    $state.go('home');
  }

  service.logout = function(){
    $auth.logout()
    .then(function() {
      localStorage.removeItem('user');
      $state.go('home');
    });
  };

  service.currentUser = function(){
    return localStorage.getItem('user');
  }

})