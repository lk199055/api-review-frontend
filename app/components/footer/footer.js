(function() {
    'use strict';

    angular
        .module('app.footer')
        .controller('FooterController', FooterController);

    /** @ngInject */
    function FooterController(USER_ROLES) {
        var vm = this;
        vm.USER_ROLES = USER_ROLES;
    }

})();
