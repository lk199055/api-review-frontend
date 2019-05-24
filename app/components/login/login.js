(function () {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($state, authservice, toastr) {
        var vm = this;

        vm.login = login;

        (function initController() {
            // reset login status
            if (authservice.isAuthenticated()) {
                authservice.logout();
            }
        })();

        function login() {
            vm.dataLoading = true;
            authservice.login(vm.credentials)
                .then(loginSuccessful, loginFailed);

            function loginSuccessful(result) {
                $state.go('home');
                toastr.success('You have been successfully logged in.', 'Welcome ' + result.given_name + '!');
            }

            function loginFailed(error) {
                vm.dataLoading = false;
                toastr.error('Failed to login. Please try again.');
            }
        };
    }

})();
