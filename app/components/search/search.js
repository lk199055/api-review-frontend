(function() {
    'use strict';

    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController($state, apiservice, reviewservice, userservice, tagservice) {
        var vm = this;
        var reviewOptions = [
          {
            val: 'title',
            txt: 'By Title'
          },
          {
            val: 'keyword',
            txt: 'By Keyword'
          },
          {
            val: 'tag',
            txt: 'By Tag'
          }
        ];
        var userOptions = [
          {
            val: 'given_name',
            txt: 'By Given Name'
          },
          {
            val: 'surname',
            txt: 'By Surname'
          },
          {
            val: 'name',
            txt: 'By Name (Given/Surname)'
          },
          {
            val: 'email',
            txt: 'By Email'
          },
          {
            val: 'role',
            txt: 'By Role'
          }
        ];
        var emptyOptions = [];

        vm.searchSubmit = searchSubmit;
        vm.populateAttributes = populateAttributes;

        function searchSubmit() {
          var resultList = '';
          var params = {'search': vm.query, page:1};
          switch(vm.objectType) {
            case 'api':
              resultList = 'api-list';
              break;
            case 'review':
              resultList = 'review-list';
              params['type'] = vm.objectAttr;
              break;
            case 'user':
              resultList = 'user-list';
              params['type'] = vm.objectAttr;
              break;
            case 'tag':
              resultList = 'review-list';
              params['type'] = 'tag';
             break;
          }
          $state.go(resultList, params);
        }

        function populateAttributes() {
          var options;
          switch(vm.objectType) {
            case 'review':
              options = reviewOptions;
              break;
            case 'user':
              options = userOptions;
              break;
            default:
              options = emptyOptions;
              console.log('DEFAULTED');
          }
          vm.objectAttrOptions = options;
          return false;
        }
    }

})();
