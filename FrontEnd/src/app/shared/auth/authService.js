/**
* Auth Service
*/
'use strict';

app.service('AuthService', function ($auth, $state, toastr) {

  var service = this;

  service.isAuthenticated = function() {
    return $auth.isAuthenticated();
  }

  service.login = function(userEmail){
    toastr.success('Autenticação realizado com sucesso');
    localStorage.setItem('currentUser', userEmail);
    //$location.path('/asdas');
  }

  service.register = function(response,userEmail){
    $auth.setToken(response);
    toastr.success('Registo e autenticação realizados com sucesso');
    localStorage.setItem('currentUser', userEmail);
    $state.go('home');
  }

  service.logout = function(){
    $auth.logout()
    .then(function() {
      localStorage.removeItem('currentUser');
      $state.go('home');
    });
  };

  service.currentUser = function(){
    return localStorage.getItem('currentUser');
  }

})