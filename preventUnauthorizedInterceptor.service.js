(function () {
  angular.module('angular.token.interceptors', []);
})();


(function PrevenUnauthInterceptorFactory(module) {

  function PreventUnauthorizedInterceptor($rootScope, $q) {
    return {
      request: function interceptorRequest(config) {

        var isHtmlOrCss = (config.url.indexOf('.html') || config.url.indexOf('.css')) > -1;
        var isOAuthOrLoginLogOut = config.url.indexOf('oauth') > -1 || config.url.indexOf('login') > -1 || config.url.indexOf('logout') > -1;
        if (isHtmlOrCss || isOAuthOrLoginLogOut) {
          return config;
        }

        var deferred = $q.defer();
        $rootScope.$on('checkTokenExpirationComplete', function checkTokenExpirationComplete(data) {
          deferred.resolve(config);
        });

        $rootScope.$broadcast("requestIntercepted");
        return deferred.promise;
      }
    };
  }

  module.factory('preventUnauthorizedInterceptor', [
    "$rootScope",
    "$q",
    PreventUnauthorizedInterceptor
  ]);

})(angular.module("angular.token.interceptors"));
