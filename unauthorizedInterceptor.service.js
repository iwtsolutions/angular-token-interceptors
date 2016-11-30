(function UnauthInterceptorFactory(module) {

  function UnauthorizedInterceptor(
    $rootScope,
    $q,
    jwtHelper,
    httpBuffer,
    localStorageService
  ) {

    return {
      responseError: function responseError(rejection) {
        var deferred = $q.defer();
        if (!rejection.config.ignoreAuthModule) {
          switch (rejection.status) {
            case 401:
              httpBuffer.append(rejection.config, deferred);
              $rootScope.$broadcast("event:auth-refreshRequired", rejection.status);
              break;
            case 403:
              $rootScope.$broadcast("event:auth-forbidden", rejection.status);
              break;
          }
        }
        deferred.reject(rejection);
        return deferred.promise;
      }
    };
  }

  module.factory('unauthorizedInterceptor', [
    "$rootScope",
    "$q",
    "jwtHelper",
    "httpBuffer",
    "localStorageService",
    UnauthorizedInterceptor
  ]);

})(angular.module("angular.token.interceptors"));
