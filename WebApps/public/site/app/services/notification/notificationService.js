/**
* Notification Service
*/
'use strict';

app.service('NotificationService', function ($rootScope, AuthService, ProfileFactory) {

  var service = this;
  var observerCallbacks = [];

  service.notifications = [];

  service.clearNotifications = function() {
    service.notifications = [];
  }

  service.addNotificationList = function(list){
    service.clearNotifications();

    angular.forEach(list, function(item){
      service.addNotification(item);
    })

    localStorage.setItem('notificationsNotRead', service.totalNotificationsNotRead());
    notifyObservers();
  }

  service.addNotification = function(item){
    var exists = false;
    angular.forEach(service.notifications, function(value){
      if(value.id == item.id){
        exists = true;
      }
    });

    if(!exists){
      service.notifications.push(item);
      service.notifications.sort(function (a, b) { 
        return (a.read < b.read) ? 1 : ((b.read < a.read) ? -1 : 0); 
      });
      service.notifications.sort(function (a, b) { 
        return (a.created < b.created) ? 1 : ((b.created < a.created) ? -1 : 0); 
      });
    }
  }

  service.markAsRead = function(id){
    if (AuthService.isAuthenticated()) {
      ProfileFactory.markNotification(id)            
      .then(function (response) {
        service.markNotificationInList(id);
      }, function (error) {
        console.log('Unable to load markd as read notification data: ' + error.data);
      });
    }
  }

  service.markNotificationInList = function(id){
    var arr = service.notifications;

    for(var i = 0; i < arr.length; i++){
      if(arr[i].id == id){
        arr[i].read = 1;
        break;
      }
    }

    localStorage.setItem('notificationsNotRead', service.totalNotificationsNotRead());
    notifyObservers();
  }

  service.markAllAsRead = function(){
    if (AuthService.isAuthenticated()) {
      ProfileFactory.markAllNotifications()            
      .then(function (response) {
        service.markAllNotificationsInList();
      }, function (error) {
        console.log('Unable to load markd as read notification data: ' + error.data);
      });
    }
  }

  service.markAllNotificationsInList = function(){
    var arr = service.notifications;
    for(var i = 0; i < arr.length; i++){
      if(arr[i].read == false){
        arr[i].read = 1;
      }
    }

    localStorage.setItem('notificationsNotRead', service.totalNotificationsNotRead());
    notifyObservers();
  }

  service.getNotifications = function(){
    return service.notifications;
  }

  service.getNotificationsNotRead = function(){
    var notReadArr = [];

    angular.forEach(service.notifications, function(value){
      if(value.read == false)
        notReadArr.push(value);
    });

    return notReadArr;
  }

  service.totalNotificationsNotRead = function(){
    return service.getNotificationsNotRead().length;
  }

  service.registerObserverCallback = function(callback){
    observerCallbacks.push(callback);
  };

  var notifyObservers = function(){
    angular.forEach(observerCallbacks, function(callback){
      callback();
    });
  };
  
});