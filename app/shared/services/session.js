(function() {
    'use strict';

    angular
        .module('app.services')
        .service('session', session);

    /** @ngInject */
    function session($cookieStore, logger) {
        this.currentUser = null;
        this.currentAPI = null;
        this.currentReview = null;
        this.pageSize = 10;

        this.create = function (user) {
            this.currentUser = user;
            $cookieStore.put('currentUser', user);
            // logger.info('Session created for user ' + user.email, this.currentUser, 'session.create');
        }

        this.destroy = function () {
            this.currentUser = null;
            this.currentAPI = null;
            this.currentReview = null;
            $cookieStore.remove('currentUser');
            // logger.info('Session destroyed', this.currentUser, 'session.destroy');
        }

        // Current user
        this.getCurrentUser = function () {
            return this.currentUser;
        }

        // for OAuth
        // this.getAuthData = function () {
        //     return this.currentUser ? this.currentUser.auth_data : {};
        // }

        this.getUserRole = function () {
            return this.currentUser ? this.currentUser.role : '';
        }

        // Basic Auth
        this.getBasicAuth = function () {
            if (this.currentUser) {
                return this.currentUser.basicAuth;
            } else {
                return null;
            }
        }

        this.setBasicAuth = function(authData) {
            this.currentUser.basicAuth = authData;
        }

        // Current api
        this.getCurrentAPI = function () {
            return this.currentAPI;
        }

        this.setCurrentAPI = function (api) {
            this.currentAPI = api;
            // logger.info('API stored in session', this.currentAPI, 'session.setCurrentAPI');
        }

        // Current review
        this.getCurrentReview = function () {
            return this.currentReview;
        }

        this.setCurrentReview = function (review) {
            this.currentReview = review;
            // logger.info('Review stored in session', this.currentReview, 'session.setCurrentReview');
        }

        // Page size
        this.getPageSize = function () {
            return this.pageSize;
        }

        this.setPageSize = function (size) {
            this.pageSize = size;
            $cookieStore.put('pageSize', this.pageSize);
        }
    }
}());
