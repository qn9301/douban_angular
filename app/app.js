'use strict';

// Declare app level module which depends on views, and components
angular.module('moviecat', [
	'ngRoute',
	'moviecat.movie_list',
	'moviecat.detail',
]).
config(['$routeProvider', function($routeProvider) {
	$routeProvider
		.otherwise({
			redirectTo: '/in_theaters'
		});
}])