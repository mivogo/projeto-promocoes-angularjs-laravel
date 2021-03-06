<!DOCTYPE html>
<html>
<head>
	<base href="/" />

	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<title>Projeto Promocoes</title>

	<link rel="stylesheet" href="site/assets/css/bootstrap.min.css">
	<link rel="stylesheet" href="site/assets/css/jasny-bootstrap.min.css">
	<link rel="stylesheet" href="site/assets/css/bootstrap-theme.min.css">
	<link rel="stylesheet" href="site/assets/css/font-awesome.min.css">
	<link rel="stylesheet" href="site/assets/css/style.css">
	<link rel="stylesheet" href="site/assets/css/modal-style.css">
	<link rel="stylesheet" href="site/assets/css/angular-toastr.min.css">
	<link rel="stylesheet" href="site/assets/css/select.min.css">
	<link rel="stylesheet" href="site/assets/css/angular-material.min.css">
</head>

<script src="site/assets/libs/jquery.min.js"></script>
<script src="site/assets/libs/bootstrap.min.js"></script>
<script src="site/assets/libs/jasny-bootstrap.min.js"></script>
<script src="site/assets/libs/angular.min.js"></script>
<script src="site/assets/libs/angular-ui-router.min.js"></script>
<script src="site/assets/libs/ui-bootstrap.js"></script>
<script src="site/assets/libs/ui-bootstrap-tpls.js"></script>
<script src="site/assets/libs/satellizer.min.js"></script>
<script src="site/assets/libs/angular-toastr.tpls.min.js"></script>
<script src="site/assets/libs/select.min.js"></script>
<script src="site/assets/libs/angular-cookies.min.js"></script>
<script src="site/assets/libs/ngCart.min.js"></script>
<script src="site/assets/libs/angular-locale_pt-pt.js"></script>
<script src="site/assets/libs/angular-material.min.js"></script>
<script src="site/assets/libs/angular-aria.min.js"></script>
<script src="site/assets/libs/angular-animate.min.js"></script>
<script src="site/assets/libs/angular-consent.js"></script>
<script src="site/assets/libs/pdfmake.js"></script>
<script src="site/assets/libs/vfs_fonts.js"></script>

<script src="site/assets/js/query.js"></script>

<script src="site/app/app.module.js"></script>
<script src="site/app/app.route.js"></script>
<script src="site/app/app.filter.js"></script>

<script src="site/app/components/home/homeController.js"></script>
<script src="site/app/components/404/404Controller.js"></script>
<script src="site/app/components/login/loginController.js"></script>
<script src="site/app/components/register/registerController.js"></script>
<script src="site/app/components/search/searchController.js"></script>
<script src="site/app/components/profile/profileController.js"></script>
<script src="site/app/components/password/passwordController.js"></script>
<script src="site/app/components/product/productController.js"></script>
<script src="site/app/components/cart/cartController.js"></script>
<script src="site/app/components/favoriteProducts/favoriteProductsController.js"></script>
<script src="site/app/components/shoppingLists/shoppingListsController.js"></script>
<script src="site/app/components/shoppingListProducts/shoppingListProductsController.js"></script>
<script src="site/app/components/dialogSaveShoppingList/dialogSaveShoppingListController.js"></script>
<script src="site/app/components/notifications/notificationsController.js"></script>
<script src="site/app/components/productSuggestion/productSuggestionController.js"></script>

<script src="site/app/shared/header/headerController.js"></script>
<script src="site/app/shared/footer/footerController.js"></script>
<script src="site/app/shared/filterbar/filterController.js"></script>
<script src="site/app/shared/menu/menuController.js"></script>
<script src="site/app/shared/notification/notificationController.js"></script>
<script src="site/app/shared/cartinfobar/cartinfobarController.js"></script>
<script src="site/app/shared/comparepanel/comparepanelController.js"></script>

<script src="site/app/services/filterbar/filterService.js"></script>
<script src="site/app/services/auth/authService.js"></script>
<script src="site/app/services/modal/modalService.js"></script>
<script src="site/app/services/search/searchService.js"></script>
<script src="site/app/services/api/apiService.js"></script>
<script src="site/app/services/cart/cartService.js"></script>
<script src="site/app/services/menu/menuService.js"></script>
<script src="site/app/services/notification/notificationService.js"></script>

<script src="site/app/factories/profile/profileRequestFactory.js"></script>
<script src="site/app/factories/auth/authRequestFactory.js"></script>
<script src="site/app/factories/product/productRequestFactory.js"></script>
<script src="site/app/factories/product/productFactory.js"></script>
<script src="site/app/factories/retailer/retailerRequestFactory.js"></script>
<script src="site/app/factories/cart/cartProductFactory.js"></script>
<script src="site/app/factories/pdf/pdfFactory.js"></script>

<body data-ng-app="promocoesWebApp">

	<div id="container">
		<div id="header" header></div>
		<div id="body" ui-view class="view-content"></div>
		<div id="footer" footer></div>
	</div>

</body>

</html>