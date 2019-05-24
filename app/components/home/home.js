(function() {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeController', HomeController);

    /** @ngInject */
    function HomeController(USER_ROLES) {
        var vm = this;
        vm.USER_ROLES = USER_ROLES;
    }

})();
