(function () {
  angular.module('angular.request.buffer', []);
})();

(function HttpBufferFactory(module) {

   function HttpBuffer($injector) {
      /** Holds all the requests, so they can be re-requested in future. */
      var buffer = [];

      /** Service initialized later because of circular dependency problem. */
      var $http;

      function retryHttpRequest(config, deferred) {
        function successCallback(response) {
          deferred.resolve(response);
        }
        function errorCallback(response) {
          deferred.reject(response);
        }
        $http = $http || $injector.get("$http");
        $http(config).then(successCallback, errorCallback);
      }

      return {
        /**
        * Appends HTTP request configuration object
        with deferred response attached to buffer.
        */
        append: function append(config, deferred) {
          buffer.push({
            config: config,
            deferred: deferred
          });
        },

        /**
        * Abandon or reject (if reason provided) all the buffered requests.
        */
        rejectAll: function rejectAll(reason) {
          if (reason) {
            for (var i = 0; i < buffer.length; ++i) {
              buffer[i].deferred.reject(reason);
            }
          }
          buffer = [];
        },

        /**
        * Retries all the buffered requests clears the buffer.
        */
        retryAll: function retryAll(updater) {
          for (var i = 0; i < buffer.length; ++i) {
            retryHttpRequest(updater(buffer[i].config), buffer[i].deferred);
          }
          buffer = [];
        }
      };
   }

  module.factory('httpBufferSvc', [
    '$injector',
    HttpBuffer
  ]);

})(angular.module("angular.request.buffer"));
