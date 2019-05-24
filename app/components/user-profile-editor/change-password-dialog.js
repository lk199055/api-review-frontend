(function() {
    'use strict';

    angular
        .module('app.userProfileEditor')
        .controller('ChangePasswordDialogController', ChangePasswordDialogController);

    /** @ngInject */
    function ChangePasswordDialogController($scope, $modalInstance) {
        //-- Variables --//
        $scope.passwords = {
            'currentPassword': '',
            'newPassword': '',
            'confirmPassword': ''
        };

        //-- Methods --//
        $scope.cancel = function() {
            $modalInstance.dismiss('Canceled');
        };

        $scope.save = function() {
            $modalInstance.close($scope.passwords);
        };

        $scope.hitEnter = function(evt) {
            if (angular.equals(evt.keyCode, 13)
                && !angular.equals($scope.passwords.newPassword, '')
                && angular.equals($scope.passwords.newPassword, $scope.passwords.confirmPassword)) {
                $scope.save();
            }
        };
    }
})();
