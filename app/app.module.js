(function() {
    'use strict';

    angular
        .module('app', [
            'ngNewRouter',
            'ngCookies',
            'ui.bootstrap',
            'dialogs.main',
            'app.services',
            'app.header',
            'app.footer',
            'app.login',
            'app.register',
            'app.home',
            'app.api',
            'app.review',
            'app.reviewEditor',
            'app.reviewList',
            'app.user'
        ])
        .run(run);

    function run($rootScope, $location, $cookieStore, authservice, session) {
        // keep user logged in after page refresh
        if ($cookieStore.get('currentUser')) {
            session.create($cookieStore.get('currentUser'));
        }

        // disable for convenience when developing
        // $rootScope.$on('$locationChangeStart', function (event, next, current) {
        //     // redirect to login page if not logged in and trying to access a restricted page
        //     var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/']) === -1;
        //     if (restrictedPage && !authservice.isAuthenticated()) {
        //         $location.path('/login');
        //     }
        // });
    }
})();
