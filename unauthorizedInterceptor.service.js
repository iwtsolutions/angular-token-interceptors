(function UnauthInterceptorFactory(module) {

  function UnauthorizedInterceptor(
    $rootScope,
    $q,
    jwtHelper,
    httpBufferSvc
  ) {

    return {
      responseError: function responseError(rejection) {
         if (!rejection.config.ignoreAuthModule) {
            switch (rejection.status) {
               case 401:
                  var deferred = $q.defer();
                  httpBufferSvc.append(rejection.config, deferred);
                  $rootScope.$broadcast('event:auth-refreshRequired', rejection, deferred);
                  return deferred.promise;
               case 403:
                  $rootScope.$broadcast('event:auth-forbidden', rejection);
                  break;
               // no default
            }
         }
         // otherwise, default behaviour
         return $q.reject(rejection);
      }
    };
  }

  module.factory('unauthorizedInterceptor', [
    "$rootScope",
    "$q",
    "jwtHelper",
    "httpBufferSvc",
    UnauthorizedInterceptor
  ]);

})(angular.module("angular.token.interceptors"));
