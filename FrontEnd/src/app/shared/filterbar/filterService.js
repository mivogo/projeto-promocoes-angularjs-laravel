/**
* Filterbar Service
*/
'use strict';

app.service('FilterbarService', function () {

  var service = this;

  // on startup, no menu items are defined. Modules can use addSidebar to add their sidebaritems
  service.filterbarItems = [];

  // remove all menu bar items
  service.clearFilterbarItems = function() {
    service.filterbarItems = [];
  }

  // add a menu item
  service.addFilterbarItem = function(item) {

    service.filterbarItems.push(item);

    console.log("FILTERBAR SERVICE RECEIVED: " + item);

    // sort by order parameter
    service.filterbarItems.sort(function (a, b) { 
      return (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0); 
    });
  };
})