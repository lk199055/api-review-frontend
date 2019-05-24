(function() {
    'use strict';

    angular
        .module('app', [
            'ui.router',
            'ngCookies',
            'ngPassword',
            'ui.bootstrap',
            'ui.tinymce',
            'dialogs.main',
            'bw.paging',
            'angucomplete-alt',
            'ngTagsInput',
            'app.services',
            'app.filters',
            'app.error',
            'app.header',
            'app.footer',
            'app.login',
            'app.register',
            'app.resetPassword',
            'app.home',
            'app.api',
            'app.apiEditor',
            'app.apiList',
            'app.review',
            'app.reviewEditor',
            'app.reviewList',
            'app.myReviewList',
            'app.userProfile',
            'app.userProfileEditor',
            'app.userList',
            'app.search',
            'app.adminConsole'
        ])
        .run(run);

    function run($rootScope, $state, $cookieStore, authservice, session, toastr, logger) {
        logger.info('Refreshed');
        // keep user logged in after page refresh
        if ($cookieStore.get('currentUser')) {
            session.create($cookieStore.get('currentUser'));
        }
        if ($cookieStore.get('pageSize')) {
            session.setPageSize($cookieStore.get('pageSize'));
        }

        $rootScope.stateIsLoading = false;
        $rootScope.$on('$stateChangeStart', function (evt, toState, toParams) {
            if (toState.data.requireLogin && !authservice.isAuthenticated()) {
                evt.preventDefault();
                $state.go('login');
                toastr.info('Please log in first.');
            } else if (toState.data.authorisedRoles && !authservice.isAuthorised(toState.data.authorisedRoles)) {
                evt.preventDefault();
                $state.go('error', {type: 'forbidden'});
            } else {
                $rootScope.stateIsLoading = true;
            }
        });
        $rootScope.$on('$stateChangeSuccess', function() {
            $rootScope.stateIsLoading = false;
        });
        $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
            $rootScope.stateIsLoading = false;
            evt.preventDefault();
            if (angular.isObject(error)) {
                switch (error.code) {
                    case 401:
                        // go to the login page
                        $state.go('login');
                        toastr.info('Session expired. Please login again.');
                        break;
                    case 403:
                        // go to the error page
                        $state.go('error', {type: 'forbidden'});
                        break;
                    case 404:
                        // go to the error page
                        $state.go('error', {type: 'not-found'});
                        break;
                    case 500:
                        // go to the error page
                        $state.go('error', {type: 'server'});
                        break;
                    default:
                }
                if (error.message) {
                    toastr.error(error.message);
                }
            }
            else {
                // unexpected error
                $state.go('error');
            }
        });
    }
})();
