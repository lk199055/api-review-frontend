(function() {
    'use strict';

    angular
        .module('app.services')
        .factory('authservice', authservice);

    /** @ngInject */
    function authservice($http, $q, session, USER_ROLES, APISERVICE, logger) {
        var service = {
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            isAuthorised: isAuthorised,
            belongsTo: belongsTo
        };

        return service;
        /////////////////////

        /**
         * Logs the user in
         * @param credentials object required by the API for login
         */
        function login(credentials) {
            return $http({
                // url: APISERVICE.userUrl + 'login/',
                url: 'https://jsonstub.com/users/login/',
                method: 'POST',
                data: credentials,
                headers: {
                    'Content-Type': 'application/json',
                    'JsonStub-User-Key': '51ec5e27-c872-4a8e-8070-dec92f5fca8f',
                    'JsonStub-Project-Key': 'deeec676-1dad-4086-a1f0-ead970151994'
                }
            }).then(loginComplete, loginFailed);

            function loginComplete(response) {
                var user = response.data;
                session.create(user);
                var authdata = Base64.encode(credentials.email + ':' + credentials.password);
                session.setBasicAuth('Basic ' + authdata);
                logger.success(
                    'User ' + user.email + ' successfully logged in',
                    response,
                    'authservice.login');
                return $q.resolve(user);
            }

            function loginFailed(response) {
                logger.error(
                    'Failed to login',
                    response,
                    'authservice.login');
                return $q.reject(response);
            }
        }

        /**
         * Logs the user out
         */
        function logout() {
            session.destroy();
            $http.defaults.headers.common.Authorization = 'Basic ';
            logger.success(
                'authservice: Successfully logged out',
                {},
                'authservice.logout');
            return $q.resolve();

            // No logout on server side
            // return $http({
            //     url: APISERVICE.url + '/logout',
            //     method: 'POST',
            //     dataType: 'json',
            //     data: '',
            //     headers: APISERVICE.headers
            // }).then(logoutComplete, logoutFailed);

            // function logoutComplete(response) {
            //     session.destroy();
            //     $http.defaults.headers.common.Authorization = 'Basic ';
            //     logger.success(
            //         'authservice: Successfully logged out',
            //         response,
            //         'authservice.logout');
            //     return $q.resolve(response);
            // }

            // function logoutFailed(response) {
            //     logger.error(
            //         'Failed to logout',
            //         response,
            //         'authservice.logout');
            //     return $q.reject(response);
            // }
        }

        /**
         * Checks if the current user is logged in
         */
        function isAuthenticated() {
            return !!session.getCurrentUser();
        }

        /**
         * Checks if the current user's role belongs to a set of roles
         * @param roles an array of user roles
         */
        function isAuthorised(roles) {
            if (roles == USER_ROLES.ALL) {
                return true;
            }
            if (!angular.isArray(roles)) {
              roles = [roles];
            }
            return service.isAuthenticated()
                && roles.indexOf(session.getUserRole()) !== -1;
        }

        /**
         * Checks if the current user belongs to a list of users
         * @param users an array of user ids
         */
        function belongsTo(users) {
            if (!angular.isArray(users)) {
                users = [users];
            }
            return service.isAuthenticated()
                && (users.indexOf(session.getCurrentUser().id) !== -1
                    || users.indexOf('' + session.getCurrentUser().id) !== -1);
        }
    }

    // Base64 encoding service used by authservice
    var Base64 = {

        keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

        encode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt(i++);
                chr2 = input.charCodeAt(i++);
                chr3 = input.charCodeAt(i++);

                enc1 = chr1 >> 2;
                enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                enc4 = chr3 & 63;

                if (isNaN(chr2)) {
                    enc3 = enc4 = 64;
                } else if (isNaN(chr3)) {
                    enc4 = 64;
                }

                output = output +
                    this.keyStr.charAt(enc1) +
                    this.keyStr.charAt(enc2) +
                    this.keyStr.charAt(enc3) +
                    this.keyStr.charAt(enc4);
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while (i < input.length);

            return output;
        },

        decode: function (input) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if (base64test.exec(input)) {
                window.alert("There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding.");
            }
            input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

            do {
                enc1 = this.keyStr.indexOf(input.charAt(i++));
                enc2 = this.keyStr.indexOf(input.charAt(i++));
                enc3 = this.keyStr.indexOf(input.charAt(i++));
                enc4 = this.keyStr.indexOf(input.charAt(i++));

                chr1 = (enc1 << 2) | (enc2 >> 4);
                chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                chr3 = ((enc3 & 3) << 6) | enc4;

                output = output + String.fromCharCode(chr1);

                if (enc3 != 64) {
                    output = output + String.fromCharCode(chr2);
                }
                if (enc4 != 64) {
                    output = output + String.fromCharCode(chr3);
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while (i < input.length);

            return output;
        }
    };
}());
