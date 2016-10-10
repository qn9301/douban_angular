(function(angular) {
	var module = angular.module("moviecat.service", [])
	module.service("mainServ", ["$http", "$window", function($http, $window) {
		var rootUrl = "http://api.douban.com";
		var mask = angular.element(document.querySelector(".mask"));
		var storage = $window.localStorage;
		// 使用localStorage记录缓存
		function checkCache(str) {
			console.log("检测是否存在缓存")
			if (checkTimeout(str) && storage[str]) {
				return JSON.parse(storage[str]);
			} else {
				return false;
			}
		}
		// 清除过期缓存
		function checkTimeout(str) {
			// 缓存一小时
			if (new Date().getTime() - storage[str + "cacheTime"] > 60 * 60 * 1000) {
				storage.removeItem(str);
				storage.removeItem(str + "cacheTime");
				return false;
			}
			return true
		}
		// 解决跨域
		this.getJSONP = function(url, options, callback) {
			// 判断url后面有没有参数
			if (url.indexOf('?') == -1) {
				url += "?";
			} else {
				if (url.indexOf('&') != -1) {
					url += "&";
				}
			}
			for (let i in options) {
				url += i + "=" + options[i] + "&"
			}
			// 在这里判断缓存
			var data = checkCache(url)
			console.log(url)
			if (data) {
				console.log("存在缓存")
				callback(data);
				return;
			}
			console.log("不存在缓存")
			$window.urlCache = url;
			var cbname = "cb_" + Math.random().toString().replace(".", "");
			url += "callback=" + cbname;
			eval("$window." + cbname + "=callback");
			$http.jsonp(url)
		}
		this.showMask = function() {
			mask.css('display', 'block');
		}
		this.hideMask = function() {
			mask.css('display', 'none');
		}

	}])
})(angular)