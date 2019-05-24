(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('tagservice', tagservice);

    /** @ngInject */
    function tagservice($http, $q, APISERVICE, logger) {
        var service = {
            create: createTag,
            search: search,
            getPage: getPage,
            getAll: getAll,
            update: updateTag,
            delete: deleteTag
        };

        return service;
        /////////////////////

        /**
         * Creates a new tag
         * @param name the name of the tag
         */
        function createTag(tag) {
            return $http({
                url: APISERVICE.tagUrl,
                method: 'POST',
                dataType: 'json',
                data: tag,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves tags whose name contain the query
         * @param query the string being searched
         */
        function search(query) {
            return $http({
                url: APISERVICE.tagUrl + '?attr=name&val=' + query,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves a page of tags
         * @param offset the starting index of tags returned
         * @param limit the number of tags returned
         */
        function getPage(offset, limit) {
            offset = typeof offset !== 'undefined' ? offset : 0;
            limit = typeof limit !== 'undefined' ? limit : 20;
            return $http({
                url: APISERVICE.tagUrl + '?offset=' + offset + '&limit=' + limit,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Retrieves all tags
         */
        function getAll() {
            return $http({
                url: APISERVICE.tagUrl,
                method: 'GET',
                dataType: 'json',
                data: '',
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Updates a tag
         * @param tag the tag object with updated information
         */
        function updateTag(tag) {
            return $http({
                url: APISERVICE.tagUrl + '/' + tag.id,
                method: 'PUT',
                dataType: 'json',
                data: tag,
                headers: APISERVICE.headers
            }).then(handleSuccess, handleError);
        }

        /**
         * Deletes a tag
         * @param id the id of the tag to be deleted
         */
        function deleteTag(id) {
            return $http({
                url: APISERVICE.tagUrl + '/' + id,
                method: 'DELETE',
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
