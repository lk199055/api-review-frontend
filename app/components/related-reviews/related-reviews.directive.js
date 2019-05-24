(function() {
    'use strict';

    angular
        .module('app')
        .directive('arRelatedReviews', ['reviewservice', function(reviewservice) {
            return {
                restrict: 'E',
                scope: {
                    api: '@',
                    reviewer: '@'
                },
                templateUrl: 'app/components/related-reviews/related-reviews.html',
                link: function($scope, $element, $attrs) {
                    if (typeof $scope.api !== 'undefined') {
                        $scope.reviewer = null;
                        reviewservice.getByAPI($scope.api, 0, 10)
                            .then(getRelatedReviewsSuccessful, getRelatedReviewsFailed);
                    } else if (typeof $scope.reviewer !== 'undefined') {
                        $scope.api = null;
                        reviewservice.getByReviewer($scope.reviewer, 0, 10)
                            .then(getRelatedReviewsSuccessful, getRelatedReviewsFailed);
                    }

                    function getRelatedReviewsSuccessful(result) {
                        $scope.relatedReviews = result.results;
                    }

                    function getRelatedReviewsFailed(error) {
                        $scope.relatedReviews = [];
                    }
                }
            };
        }]);
})();
