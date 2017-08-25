/**
* Notification Service
*/
'use strict';

app.service('NotificationService', function ($rootScope, AuthService, ProfileFactory) {

  var service = this;
  var observerCallbacks = [];

  service.notificationsNotRead = [];
  service.notifications = [];

  service.clearNotificationsNotRead = function() {
    service.notificationsNotRead = [];
  }

  service.clearNotifications = function() {
    service.notifications = [];
  }

  service.addNotificationNotReadList = function(list){
    service.clearNotificationsNotRead();

    angular.forEach(list, function(item){
      service.addNotificationNotRead(item);
    })

    localStorage.setItem('notificationsNotRead', service.notificationsNotRead.length);
    notifyObservers();
  }

  service.addNotificationNotRead = function(item){
    var exists = false;
    angular.forEach(service.notificationsNotRead, function(value, key){
      if(value.id == item.id){
        exists = true;
      }
    });

    if(!exists){
      service.notificationsNotRead.push(item);
      service.notificationsNotRead.sort(function (a, b) { 
        return (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0); 
      });
    }
  }

  service.addNotification = function(item){
    var exists = false;
    angular.forEach(service.notifications, function(value, key){
      if(value.id == item.id){
        exists = true;
      }
    });

    if(!exists){
      service.notifications.push(item);
      service.notifications.sort(function (a, b) { 
        return (a.created > b.created) ? 1 : ((b.created > a.created) ? -1 : 0); 
      });
    }
  }

  service.markAsRead = function(id){
    if (AuthService.isAuthenticated()) {
      ProfileFactory.markNotification(id)            
      .then(function (response) {
        service.addNotificationNotReadList(response.data);
      }, function (error) {
        console.log('Unable to load markd as read notification data: ' + error.data);
      });
    }
  }

  service.markAllAsRead = function(){
    if (AuthService.isAuthenticated()) {
      ProfileFactory.markAllNotifications()            
      .then(function (response) {
        service.addNotificationNotReadList(response.data);
      }, function (error) {
        console.log('Unable to load markd as read notification data: ' + error.data);
      });
    }
  }

  service.getNotifications = function(){
    return service.notifications;
  }

  service.getNotificationsNotRead = function(){
    return service.notificationsNotRead;
  }

  service.totalNotificationsNotRead = function(){
    return service.notificationsNotRead.length;
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