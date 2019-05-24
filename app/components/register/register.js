(function () {
    'use strict';

    angular
        .module('app.register')
        .controller('RegisterController', RegisterController);

    /** @ngInject */
    function RegisterController($state, userservice, toastr) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            userservice.register(vm.user)
                .then(registerSuccessful, registerFailed);

            function registerSuccessful(response) {
                $state.go('login');
                toastr.success('An email has been sent to you for verification.', 'Registration Successful!');
            }

            function registerFailed(response) {
                vm.dataLoading = false;
            }
        };
    }

})();
