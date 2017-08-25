/**
* API Service
*/
'use strict';

app.service('APIService', function () {

  var service = this;

  service.apiUrl = function(){
    return 'http://vps415122.ovh.net/api';
  }

});