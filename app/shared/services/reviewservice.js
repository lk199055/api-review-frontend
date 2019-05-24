(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('reviewservice', reviewservice);

    /** @ngInject */
    function reviewservice($http, $q, APISERVICE, session, logger) {
        var service = {
            create: createReview,
            getById: getById,
            getByAPI: getByAPI,
            getByReviewer: getByReviewer,
            getPage: getPage,
            getAll: getAll,
            update: updateReview,
            delete: deleteReview,
            searchByKeyword: searchByKeyword,
            searchByTitle: searchByTitle,
            searchByTag: searchByTag
        };

        return service;
        /////////////////////

        /**
         * Creates a new review
         * @param review a review object that captures all details the API needs
         */
        function createReview(review) {
            return $http({
                url: APISERVICE.reviewUrl,
                method: 'POST',
                dataType: 'json',
                data: review,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves a review
         * @param id the id of the review to be retrieved
         */
        function getById(id) {
            return $http({
                url: APISERVICE.reviewUrl + id + '/',
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves reviews about an API
         * @param apiId the id of the API
         */
        function getByAPI(apiId, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : session.getPageSize();
            return $http({
                url: APISERVICE.apiUrl + apiId + '/reviews/?offset=' + offset + '&limit=' + limit,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves reviews written by a reviewer
         * @param reviewerId the id of the reviewer
         */
        function getByReviewer(reviewerId, offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : session.getPageSize();
            return $http({
                url: APISERVICE.userUrl + reviewerId + '/reviews/?offset=' + offset + '&limit=' + limit,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves a page of reviews
         * @param offset the starting index of reviews returned
         * @param limit the number of reviews returned
         */
        function getPage(offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : session.getPageSize();
            return $http({
                url: APISERVICE.reviewUrl + '?offset=' + offset + '&limit=' + limit,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves all reviews
         */
        function getAll() {
            return $http({
                url: APISERVICE.reviewUrl,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Updates a review
         * @param review the review object with updated information
         */
        function updateReview(review) {
            return $http({
                url: APISERVICE.reviewUrl + review.id + '/',
                method: 'PUT',
                dataType: 'json',
                data: review,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Deletes a review
         * @param id the id of the review to be deleted
         */
        function deleteReview(id) {
            return $http({
                url: APISERVICE.reviewUrl + id + '/',
                method: 'DELETE',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Searches a review by keyword
         * @param keyword the keyword used to search
         */
        function searchByKeyword(keyword) {
            return $http({
                url: APISERVICE.reviewUrl + '?attr=keyword&val=' + encodeURIComponent(keyword),
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Search Reviews
         * @param query: String with query param
         * @param offset: Int page to start search
         * @param limit: Int number of results per page
         * @return object: Contains pagination info and list of Review objects
         */
        function searchByTitle(query, offset, limit) {
          offset = !_.isUndefined(offset) ? offset : 0;
          limit = !_.isUndefined(limit) ? limit : 10;
          var urlData = '?attr=title&val=' + encodeURIComponent(query)
            + '&limit=' + limit
            + '&offset=' + offset;
          return $http({
            url: APISERVICE.reviewUrl + urlData,
            method: 'GET',
            dataType: 'json',
            data: '',
            headers: APISERVICE.headers
          }).then(handleSuccess, handleError);
        }

        /**
         * Searches a review by tag
         * @param tag the tag used to search
         */
        function searchByTag(tag) {
            return $http({
                url: APISERVICE.reviewUrl + '?attr=tag&val=' + encodeURIComponent(tag),
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        // private functions
        function handleSuccess(response) {
            logger.success('API call successful', response, 'reviewservice');
            return $q.resolve(response.data);
        }

        function handleError(response) {
            logger.error('API call unsuccessful', response, 'reviewservice');
            return $q.reject(response);
        }
    }
}());
