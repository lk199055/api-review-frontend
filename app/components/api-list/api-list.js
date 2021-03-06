(function() {
    'use strict';

    angular
        .module('app.apiList')
        .controller('ApiListController', ApiListController);

    /** @ngInject */
    function ApiListController($state, $stateParams, initData, apiservice, session, CONSTANTS, logger) {
        var vm = this;

        vm.currentPage = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
        vm.pageSize = session.getPageSize();
        vm.availablePageSizes = CONSTANTS.AVAILABLE_PAGE_SIZES;
        vm.doPaging = doPaging;
        vm.onPageSizeChange = onPageSizeChange;

        vm.totalNum = initData.count;
        vm.apis = initData.results;

        function doPaging(text, page) {
            $state.go('api-list', {page: page});
        }

        function onPageSizeChange() {
            session.setPageSize(vm.pageSize);
            // go to first page
            if (vm.currentPage != 1) {
                $state.go('api-list', {page: 1});
            } else {
                $state.reload();
            }
        }
    }
})();
