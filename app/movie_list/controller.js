(function(angular) {
	"use strict";
	// 创建正在热映的电影
	var module = angular.module('moviecat.movie_list', ['ngRoute', 'moviecat.service'])
	module.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when("/detail/:id", {
				templateUrl: 'detail/view.html',
				controller: 'detailCtrl'
			})
			.when('/:cate/:page?', {
				templateUrl: "movie_list/view.html",
				controller: "MovieListCtrl"
			})
	}])

	module.controller('MovieListCtrl', [
		'$scope',
		'mainServ',
		"$routeParams",
		"$rootScope",
		"$window",
		function($scope, mainServ, $routeParams, $rootScope, $window) {
			// 控制器 分为两步：1.设计暴露的数据，2.设计暴露的行为
			var cate = $routeParams.cate;
			$rootScope.ctrl = cate;
			var storage = $window.localStorage;
			var moviecat = {};
			storage.moviecat ? moviecat = JSON.parse('"' + storage.moviecat + '"') : storage['moviecat'] = {};
			$scope.load = false;
			mainServ.showMask()
			var url = "http://api.douban.com/v2/movie/" + cate;
			var page = parseInt($routeParams.page ? $routeParams.page : 1);
			var count = 10;
			var option = {
				start: (page - 1) * count,
				count: count
			}
			$scope.preve = page > 1 ? page - 1 : false;
			$scope.nextt = page * count
			$scope.title = "";

			mainServ.getJSONP(url, option, function(res) {
				$scope.movies = res;
				$scope.title = res.title;
				// 判断是否需要存储缓存
				if ($window.urlCache) {
					console.log("正在储存缓存")
					var data = JSON.stringify(res);
					storage[$window.urlCache] = data;
					storage[$window.urlCache + "cacheTime"] = new Date().getTime();
					console.log("缓存储存完毕")
					$window.urlCache = null
				}
				$scope.preve = page > 1 ? page - 1 : false;
				$scope.nextt = page * count < res.total ? page + 1 : false;
				$scope.load = true;
				mainServ.hideMask()
			})
		}
	])
})(angular)