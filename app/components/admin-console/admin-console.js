(function () {
    'use strict';

    angular
        .module('app.adminConsole')
        .controller('AdminConsoleController', AdminConsoleController);

    /** @ngInject */
    function AdminConsoleController($state, userservice, USER_ROLES, toastr) {
        var vm = this;
        vm.USER_ROLES = [];
        for (var index in USER_ROLES) {
            if (USER_ROLES[index] !== '*') {
                vm.USER_ROLES.push(USER_ROLES[index]);
            }
        }

        vm.changeRole = changeRole;

        function changeRole() {
            vm.dataLoading = true;
            userservice.update(vm.userId, {role: vm.role})
                .then(updateSuccessful, updateFailed);

            function updateSuccessful(result) {
                vm.dataLoading = false;
                toastr.success('You have successfully changed the role.');
            }

            function updateFailed(error) {
                vm.dataLoading = false;
                toastr.error('Failed to update. Please try again.');
            }
        };
    }

})();
