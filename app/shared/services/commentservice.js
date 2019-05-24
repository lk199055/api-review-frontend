(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('commentservice', commentservice);

    /** @ngInject */
    function commentservice($http, $q, APISERVICE, logger) {
        var service = {
            create: createComment,
            getById: getById,
            getByReview: getByReview,
            getPage: getPage,
            getAll: getAll,
            update: updateComment,
            delete: deleteComment
        };

        return service;
        /////////////////////

        /**
         * Creates a new comment
         * @param comment a comment object that captures all details the API needs
         */
        function createComment(reviewId, comment) {
            return $http({
                url: APISERVICE.reviewUrl + reviewId + '/comments/',
                method: 'POST',
                dataType: 'json',
                data: comment,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves a comment
         * @param id the id of the comment to be retrieved
         */
        function getById(id) {
            return $http({
                url: APISERVICE.commentUrl + id + '/',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves all comments of a review
         */
        function getByReview(reviewId) {
            return $http({
                url: APISERVICE.reviewUrl + reviewId + '/comments/',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves a page of comments
         * @param offset the starting index of comments returned
         * @param limit the number of comments returned
         */
        function getPage(offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : 20;
            return $http({
                url: APISERVICE.commentUrl + '?offset=' + offset + '&limit=' + limit,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves all comments
         */
        function getAll() {
            return $http({
                url: APISERVICE.commentUrl,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Updates a comment
         * @param comment the comment object with updated information
         */
        function updateComment(comment) {
            return $http({
                url: APISERVICE.commentUrl + comment.id + '/',
                method: 'PUT',
                dataType: 'json',
                data: comment,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Deletes a comment
         * @param id the id of the comment to be deleted
         */
        function deleteComment(id) {
            return $http({
                url: APISERVICE.commentUrl + id + '/',
                method: 'DELETE',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(response) {
            logger.success('API call successful', response, 'commentservice');
            return $q.resolve(response.data);
        }

        function handleError(response) {
            logger.error('API call unsuccessful', response, 'commentservice');
            return $q.reject(response);
        }
    }
}());
