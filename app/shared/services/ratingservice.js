(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('ratingservice', ratingservice);

    /** @ngInject */
    function ratingservice($http, $q, APISERVICE, logger) {
        var service = {
            upvote: upvote,
            downvote: downvote
        };

        return service;
        /////////////////////

        /**
         * Upvote a review
         * @param reviewId the id of the review
         */
        function upvote(reviewId) {
            return $http({
                url: APISERVICE.reviewUrl + reviewId + '/upvote/',
                method: 'POST',
                dataType: 'json',
                data: {},
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Downvote a review
         * @param reviewId the id of the review
         */
        function downvote(reviewId) {
            return $http({
                url: APISERVICE.reviewUrl + reviewId + '/downvote/',
                method: 'POST',
                dataType: 'json',
                data: {},
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(response) {
            logger.success('API call successful', response, 'ratingservice');
            return $q.resolve(response.data);
        }

        function handleError(response) {
            logger.error('API call unsuccessful', response, 'ratingservice');
            return $q.reject(response);
        }
    }
}());
