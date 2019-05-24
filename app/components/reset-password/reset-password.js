(function () {
    'use strict';

    angular
        .module('app.resetPassword')
        .controller('ResetPasswordController', ResetPasswordController);

    /** @ngInject */
    function ResetPasswordController($state, userservice, toastr) {
        var vm = this;

        vm.resetPassword = resetPassword;

        function resetPassword() {
            vm.dataLoading = true;
            userservice.resetPassword(vm.email)
                .then(resetPasswordSuccessful, resetPasswordFailed);

            function resetPasswordSuccessful(response) {
                $state.go('home');
                toastr.success('A temporary password has been sent to your email.', 'Reset Password');
            }

            function resetPasswordFailed(response) {
                vm.dataLoading = false;
            }
        };
    }

})();
