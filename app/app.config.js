(function() {
    'use strict';

    angular.module('app')
        .value('config', {
            appTitle: 'API Review',
            version: '1.0.0'
        })
        .config(httpInterceptorConfig)
        .config(toastrConfig)
        .config(logConfig);

    /* @ngInject */
    function httpInterceptorConfig($httpProvider) {
        $httpProvider.interceptors.push(function($q, $injector, session, toastr) {
            return {
                // request interceptor
                request: function(request) {
                    request.headers.Authorization = session.getBasicAuth();
                    return request;
                },
                // responseError interceptor
                // responseError: function(rejection) {
                //     var $state = $injector.get('$state');
                //     switch(rejection.status) {
                //         case 400:
                //             break;
                //         case 401:
                //             $state.go('login');
                //             toastr.info('Session expired. Please login again.');
                //             break;
                //         case 403:
                //             $state.go('error', {type: 'forbidden'});
                //             break;
                //         case 404:
                //             $state.go('error', {type: 'not-found'});
                //             break;
                //         case 409:
                //             break;
                //         case 500:
                //             $state.go('error', {type: 'server'});
                //             break;
                //         default:
                //             $state.go('error');
                //     }
                //     if (rejection.data.message) {
                //         toastr.error(rejection.data.message);
                //     }
                //     return $q.reject(rejection);
                // }
            };
        });
    }

    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.closeButton = true;
        toastr.options.timeOut = 4000;
        toastr.options.extendedTimeOut = 500;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    /* @ngInject */
    function logConfig($logProvider) {
        // turn debugging off/on (no info or warn)
        if ($logProvider.debugEnabled) {
            $logProvider.debugEnabled(true);
        }
    }
})();
