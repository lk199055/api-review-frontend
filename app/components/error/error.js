(function() {
    'use strict';

    angular
        .module('app.error')
        .controller('ErrorController', ErrorController);

    /** @ngInject */
    function ErrorController($state, $stateParams) {
        var vm = this;

        switch ($stateParams.type) {
            case 'forbidden':
                vm.statusCode = '403 Forbidden';
                vm.description = 'You don\'t have the permission to access this page.';
                break;
            case 'server':
                vm.statusCode = '500 Internal Server Error';
                vm.description = 'Something wrong happened.';
                break;
            default:
                vm.statusCode = '404 Not Found';
                vm.description = 'The requested page was not found.';
                break;
        }
    }
})();
