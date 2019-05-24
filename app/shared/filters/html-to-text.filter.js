(function() {
    'use strict';

    angular
        .module('app.filters')
        .filter('htmlToPlaintext', htmlToPlaintext);

    function htmlToPlaintext() {
        return function(html) {
            return html ? String(html).replace(/<[^>]+>/gm, '') : '';
        };
    }

})();