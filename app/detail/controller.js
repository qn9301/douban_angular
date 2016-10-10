(function() {
	var module = angular.module('moviecat.detail', ['ngRoute', 'moviecat.service']);
	module.controller('detailCtrl', [
		'$scope',
		'$routeParams',
		'mainServ',
		'$window',
		function($scope, $routeParams, mainServ, $window) {
			$scope.load = false;
			var storage = $window.localStorage;
			var moviecat = {};
			storage.moviecat ? moviecat = JSON.parse('"' + storage.moviecat + '"') : storage['moviecat'] = {};
			mainServ.showMask();
			var id = $routeParams.id
			if (!id) {
				$scope.msg = "参数错误！"
			} else {
				var option = {};
				var url = "http://api.douban.com/v2/movie/subject/" + id;
				mainServ.getJSONP(url, option, function(res) {
					$scope.movie = res
						// 判断是否需要存储缓存
					if ($window.urlCache) {
						console.log("正在储存缓存")
						var data = JSON.stringify(res);
						storage[$window.urlCache] = data;
						storage[$window.urlCache + "cacheTime"] = new Date().getTime();
						console.log("缓存储存完毕")
						$window.urlCache = null
					}
					$scope.load = true;
					mainServ.hideMask();
				})
			}
		}
	])
})(angular)