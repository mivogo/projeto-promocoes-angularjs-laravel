/**
* API Service
*/
'use strict';

app.service('APIService', function () {

  var service = this;

  service.apiUrl = function(){
    return 'http://localhost:8000/api';
  }

})