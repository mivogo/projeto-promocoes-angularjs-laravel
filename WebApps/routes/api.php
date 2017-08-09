<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
	return $request->user();
});


Route::group(['middleware' => 'cors'], function () {
	Route::post('/login', 'API\AuthController@login');
	Route::post('/register', 'API\AuthController@register');
	Route::post('/password', 'API\AuthController@password');
	
	Route::get('/details', 'API\ProfileController@details');
	Route::post('/update', 'API\ProfileController@update');

	Route::post('/products', 'API\ProductController@createFromList');
	Route::get('/products', 'API\ProductController@showAll');
	Route::get('/products/{id}&pr={prid}', 'API\ProductController@showProduct');
	Route::post('/productsFromRetailer/{id}', 'API\ProductController@showAllFromRetailer');

	Route::post('/profile/favorites/{id}', 'API\FavoriteListController@addFavorite');
	Route::post('/profile/favorites/delete/{id}', 'API\FavoriteListController@deleteFavorite');
	Route::get('/profile/favorites', 'API\FavoriteListController@showFavorites');

	Route::get('/retailers', 'API\RetailerController@showAll');

	Route::get('/categories', 'API\CategoryController@showAll');
});
