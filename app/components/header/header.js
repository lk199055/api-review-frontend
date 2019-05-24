(function() {
    'use strict';

    angular
        .module('app.header')
        .controller('HeaderController', HeaderController);

    /** @ngInject */
    function HeaderController($state, authservice, userservice, session, USER_ROLES, toastr) {
        var vm = this;
        vm.USER_ROLES = USER_ROLES;
        vm.authservice = authservice;
        vm.session = session;

        vm.contentMenu = [
            {title: 'APIs', link: 'api-list'},
            {title: 'Reviews', link: 'review-list'},
            {title: 'Reviewers', link: 'user-list({type:\'role\',search:headerCtrl.USER_ROLES.REVIEWER})'}];
        vm.createMenu = [
            {title: 'New API', link: 'api-item-new'},
            {title: 'New Review', link: 'review-item-new'}];
        vm.userMenu = [
            // {title: 'My profile', link: 'user-profile-edit'},
            {title: 'My reviews', link: 'my-review-list'}];
        vm.logout = logout;

        function logout() {
            authservice.logout()
                .then(logoutSuccessful, logoutFailed);

            function logoutSuccessful() {
                $state.go('home');
            }

            function logoutFailed() {
            }
        }

        function becomeReviewer() {
            var patch = {
                role: USER_ROLES.REVIEWER
            };
            userservice.update(session.getCurrentUser().id, patch)
                .then(updateUserSuccessful, updateUserFailed);

            function updateUserSuccessful(result) {
                $state.go('login');
                toastr.info('You are a reviewer now. Please login again.');
            }

            function updateUserFailed(error) {
                toastr.error('Request failed. Please try again.');
            }
        }
    }

})();
