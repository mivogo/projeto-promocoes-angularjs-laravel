describe('ProfileNotificationsController', function() {
	beforeEach(module('promocoesWebApp'));

	var $controller, $rootScope, CartService;


	beforeEach(inject(function(_$controller_, _$rootScope_, _NotificationService_){
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		NotificationService = _NotificationService_;
	}));

	beforeEach(function() {
		spyOn(NotificationService, 'markAsRead').and.callFake(function(id) {
			NotificationService.markNotificationInList(id);
		});

		NotificationService.addNotificationList([{id:1,read:0},{id:2,read:0}]);
	});

	var scope, controller;

	beforeEach(function() {
		scope = $rootScope.$new();
		controller = $controller('ProfileNotificationsController', { $scope: scope, NotificationService: NotificationService});
	});

	describe('$scope.numberNotifications', function() {
		it('has two notifications', function() {
			var result = scope.numberNotifications();

			expect(result).toEqual(2);
		});

		it('has no notifications', function() {
			scope.notifications = [];

			var result = scope.numberNotifications();

			expect(result).toEqual(0);
		});
	});

	describe('$scope.markAsRead', function() {

		it('notification marked', function() {
			expect(NotificationService.totalNotificationsNotRead()).toEqual(2);

			scope.markAsRead(2);
			expect(NotificationService.markAsRead).toHaveBeenCalled();

			var result = NotificationService.totalNotificationsNotRead();
			expect(result).toEqual(1);
		});
	});
});

