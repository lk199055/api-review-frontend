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
            'app.userProfile',
            'app.userProfileEditor',
            'app.userList'
        ])
        .run(run);

    function run($rootScope, $state, $cookieStore, authservice, session, toastr) {
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
                toastr.info('Please sign in first.');
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
            if (angular.isObject(error) && angular.isString(error.code)) {
                switch (error.code) {
                    case 'NOT_AUTHENTICATED':
                        // go to the login page
                        $state.go('login');
                        break;
                    default:
                        // go to error page
                        $state.go('error', {type: 'not-found'});
                }
                toastr.error(error.message);
            }
            else {
                // unexpected error
                $state.go('error', {type: 'unknown'});
            }
        });
    }
})();
