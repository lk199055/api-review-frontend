(function() {
    'use strict';

    angular
        .module('app.userProfile')
        .controller('UserProfileController', UserProfileController);

    /** @ngInject */
    function UserProfileController($state, initData) {
        var vm = this;

        vm.user = initData;
        vm.reload = function () {
            $state.reload();
        }
    }
})();
