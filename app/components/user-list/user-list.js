(function() {
    'use strict';

    angular
        .module('app.userList')
        .controller('UserListController', UserListController);

    /** @ngInject */
    function UserListController($state, $stateParams, initData, userservice, session, CONSTANTS) {
        var vm = this;

        vm.currentPage = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
        vm.pageSize = session.getPageSize();
        vm.availablePageSizes = CONSTANTS.AVAILABLE_PAGE_SIZES;
        vm.doPaging = doPaging;
        vm.onPageSizeChange = onPageSizeChange;

        vm.totalNum = initData.count;
        vm.users = initData.results;

        if ($stateParams.search) {
            vm.searchType = $stateParams.type;
            vm.searchStr = $stateParams.search;
        }

        function doPaging(text, page) {
            $state.go('user-list', {role: $stateParams.role, page: page});
        }

        function onPageSizeChange() {
            session.setPageSize(vm.pageSize);
            // go to first page
            if (vm.currentPage != 1) {
                $state.go('user-list', {role: $stateParams.role, page: 1});
            } else {
                $state.reload();
            }
        }
    }
})();
