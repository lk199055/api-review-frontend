(function() {
    'use strict';

    angular
        .module('app')
        .directive('access', ['authservice', function(authservice) {
            return {
                restrict: 'A',
                link: function(scope, element, attrs) {
                    // hide by default
                    element.addClass('hidden');

                    var authorisedGroup = attrs.access.split(/\s*,\s*/);
                    if (authorisedGroup.length > 0) {
                        // show if user is authorised, remove element otherwise
                        if (authservice.isAuthorised(authorisedGroup) || authservice.belongsTo(authorisedGroup)) {
                            element.removeClass('hidden');
                        } else {
                            element.context.parentNode.removeChild(element.context);
                        }
                    }
                }
            };
        }]);
})();
