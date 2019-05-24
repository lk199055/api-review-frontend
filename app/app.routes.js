(function() {
    'use strict';

    angular.module('app')
        .config(stateConfig)
        .config(urlConfig)
        .controller('AppController', AppController);

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function unCapitalizeFirstLetter(string) {
        return string.charAt(0).toLowerCase() + string.slice(1);
    }

    function getControllerName(name) {
        return name.split('-').map(function(item){
            return capitalizeFirstLetter(item);
        }).join('');
    }

    function getControllerAlias(name) {
        return unCapitalizeFirstLetter(getControllerName(name));
    }

    function getSubCompObj(component, resolveObj) {
        return {
            templateUrl: 'app/components/' + component + '/' + component + '.html',
            controller: getControllerName(component) + 'Controller',
            controllerAs: getControllerAlias(component) + 'Ctrl',
            resolve: resolveObj
        };
    }

    function getUICompObj(main, header, footer, resolveObj) {
        main = typeof main !== 'undefined' ? main : 'main';
        header = typeof header !== 'undefined' ? header : 'header';
        footer = typeof footer !== 'undefined' ? footer : 'footer';
        return {
            'header': getSubCompObj(header),
            'footer': getSubCompObj(footer),
            'main': getSubCompObj(main, resolveObj)
        };
    }

    function stateConfig($locationProvider, $stateProvider, $uiViewScrollProvider, USER_ROLES) {
        $locationProvider.html5Mode({
            enabled: false, // set to true to remove hash. Don't want to set it now because it
                            // doesn't allow access to pages by typing url directly
            requireBase: false
        });
        $uiViewScrollProvider.useAnchorScroll();
        $stateProvider
            .state('home', {
                url: '/',
                data: {
                    requireLogin: false
                },
                views: getUICompObj('home'),
            })
            .state('login', {
                url: '/login',
                data: {
                    requireLogin: false
                },
                views: getUICompObj('login'),
            })
            .state('register', {
                url: '/register',
                data: {
                    requireLogin: false
                },
                views: getUICompObj('register'),
            })
            .state('reset-password', {
                url: '/reset-password',
                data: {
                    requireLogin: false
                },
                views: getUICompObj('reset-password'),
            })
            .state('review-item-new', {
                url: '/reviews/new?api',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.REVIEWER]
                },
                views: getUICompObj('review-editor', undefined, undefined, {
                    initData: function () {
                        return {
                            'title': '',
                            'content': '',
                            'description': '',
                            'api': {},
                            'tags': []
                        };
                    }
                }),
            })
            .state('review-item-view', {
                url: '/reviews/:id',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                views: getUICompObj('review', undefined, undefined, {
                    initData: function ($q, $stateParams, reviewservice, commentservice) {
                        var review = {};
                        return reviewservice.getById($stateParams.id)
                            .then(function (result) {
                                review = result;
                                return commentservice.getByReview($stateParams.id);
                            }, getReviewFailed)
                            .then(function (result) {
                                review.comments = result.results;
                                return review;
                            }, getCommentsFailed);

                        function getReviewFailed(error) {
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }

                        function getCommentsFailed(error) {
                            return $q.reject(error);
                        }
                    }
                }),
            })
            .state('review-item-edit', {
                url: '/reviews/:id/edit',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.REVIEWER]
                },
                views: getUICompObj('review-editor', undefined, undefined, {
                    initData: function ($q, $stateParams, authservice, reviewservice, session) {
                        var review = session.getCurrentReview();
                        if (review == null || review.id != $stateParams.id) {
                            var deferred = $q.defer();
                            reviewservice.getById($stateParams.id)
                                .then(getReviewSuccessful, getReviewFailed);
                            return deferred.promise;
                        } else {
                            // check if the current user is the author
                            if (authservice.belongsTo(review.author.id)) {
                                return review;
                            } else {
                                return $q.reject({
                                    code: 403,
                                    message: 'No permission to edit the review.'
                                });
                            }
                        }

                        function getReviewSuccessful(result) {
                            // check if the current user is the author
                            if (authservice.belongsTo(result.author.id)) {
                                deferred.resolve(result);
                            } else {
                                deferred.reject({
                                    code: 403,
                                    message: 'No permission to edit the review.'
                                });
                            }
                        }

                        function getReviewFailed(error) {
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('review-list', {
                url: '/reviews?page',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                params: {search: null, type: null},
                views: getUICompObj('review-list', undefined, undefined, {
                    initData: function ($q, $stateParams, reviewservice, tagservice, session) {
                        var page = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
                        var pageSize = session.getPageSize();
                        if($stateParams.search) {
                          if($stateParams.type == 'title') {
                            return reviewservice.searchByTitle($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getReviewListSuccessful, getReviewListFailed);
                          } else if ($stateParams.type == 'keyword') {
                            return reviewservice.searchByKeyword($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getReviewListSuccessful, getReviewListFailed);
                          } else if ($stateParams.type == 'tag') {
                            return reviewservice.searchByTag($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getReviewListSuccessful, getReviewListFailed);
                          }
                        } else {
                            return reviewservice.getPage((page - 1) * pageSize, pageSize)
                                .then(getReviewListSuccessful, getReviewListFailed);
                        }

                        function getReviewListSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getReviewListFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('my-review-list', {
                url: '/my-reviews?page',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.REVIEWER]
                },
                params: {search: null, type: null},
                views: getUICompObj('my-review-list', undefined, undefined, {
                    initData: function ($q, $stateParams, reviewservice, session) {
                        var page = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
                        var pageSize = session.getPageSize();
                        return reviewservice.getByReviewer(session.getCurrentUser().id)
                                .then(getReviewListSuccessful, getReviewListFailed);

                        function getReviewListSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getReviewListFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('api-item-new', {
                url: '/apis/new',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN, USER_ROLES.EDITOR, USER_ROLES.REVIEWER]
                },
                views: getUICompObj('api-editor'),
            })
            .state('api-item-view', {
                url: '/apis/:id',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                views: getUICompObj('api', undefined, undefined, {
                    initData: function ($q, $state, $stateParams, apiservice) {
                        return apiservice.getById($stateParams.id)
                            .then(getApiSuccessful, getApiFailed);

                        function getApiSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getApiFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('api-item-edit', {
                url: '/apis/:id/edit',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN, USER_ROLES.EDITOR]
                },
                views: getUICompObj('api-editor'),
            })
            .state('api-list', {
                url: '/apis?page',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                params: {search: null},
                views: getUICompObj('api-list', undefined, undefined, {
                    initData: function ($q, $stateParams, apiservice, session) {
                        var page = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
                        var pageSize = session.getPageSize();
                        if($stateParams.search) {
                            return apiservice.search($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getApiListSuccessful, getApiListFailed);
                        } else {
                            return apiservice.getPage((page - 1) * pageSize, pageSize)
                                .then(getApiListSuccessful, getApiListFailed);
                        }

                        function getApiListSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getApiListFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            // .state('user-profile-edit', {
            //     url: '/users/my-profile',
            //     data: {
            //         requireLogin: true,
            //         authorisedRoles: [USER_ROLES.ALL]
            //     },
            //     views: getUICompObj('user-profile-editor'),
            // })
            .state('user-profile-view', {
                url: '/users/:id',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                views: getUICompObj('user-profile', undefined, undefined, {
                    initData: function ($q, $stateParams, userservice) {
                        return userservice.getById($stateParams.id)
                            .then(getUserSuccessful, getUserFailed);

                        function getUserSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getUserFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('user-list', {
                url: '/users?page',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ALL]
                },
                params: {search: null, type: null},
                views: getUICompObj('user-list', undefined, undefined, {
                    initData: function ($stateParams, $q, userservice, session) {
                        var page = typeof $stateParams.page !== 'undefined' ? $stateParams.page : 1;
                        var pageSize = session.getPageSize();
                        if ($stateParams.type == 'given_name') {
                            return userservice.searchByGivenName($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getUserListSuccessful, getUserListFailed);
                        } else if ($stateParams.type == 'surname') {
                            return userservice.searchBySurname($stateParams.search,
                              (page - 1) * pageSize, pageSize)
                              .then(getUserListSuccessful, getUserListFailed);
                        } else if ($stateParams.type == 'name') {
                            return userservice.searchByName($stateParams.search,
                              (page - 1) * pageSize, pageSize)
                              .then(getUserListSuccessful, getUserListFailed);
                        } else if ($stateParams.type == 'email') {
                            return userservice.searchByEmail($stateParams.search,
                              (page - 1) * pageSize, pageSize)
                              .then(getUserListSuccessful, getUserListFailed);
                        } else if ($stateParams.type == 'role') {
                            return userservice.searchByRole($stateParams.search,
                                (page - 1) * pageSize, pageSize)
                                .then(getUserListSuccessful, getUserListFailed);
                        } else {
                            return userservice.getPage((page - 1) * pageSize, pageSize)
                                .then(getUserListSuccessful, getUserListFailed);
                        }

                        function getUserListSuccessful(result) {
                            return $q.resolve(result);
                        }

                        function getUserListFailed(error){
                            return $q.reject({
                                code: error.status,
                                message: error.data.detail
                            });
                        }
                    }
                }),
            })
            .state('search', {
              url: '/search',
              data: {
                requireLogin: false
              },
              views: getUICompObj('search')
            })
            .state('admin-console', {
                url: '/admin-console',
                data: {
                    requireLogin: true,
                    authorisedRoles: [USER_ROLES.ADMIN]
                },
                views: getUICompObj('admin-console'),
            })
            .state('error', {
                url: '/error',
                data: {
                    requireLogin: false
                },
                params: { type: null },
                views: getUICompObj('error'),
            })
            .state('test', {
                url: '/test',
                data: {
                    requireLogin: false
                },
                views: getUICompObj('test'),
            });
    }

    function urlConfig($urlRouterProvider) {
        $urlRouterProvider
            .when('', '/')
            .otherwise('/error');
    }

    /** @ngInject */
    function AppController () {}
})();
