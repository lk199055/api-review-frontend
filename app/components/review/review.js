(function() {
    'use strict';

    angular
        .module('app.review')
        .controller('ReviewController', ReviewController);

    /** @ngInject */
    function ReviewController($state, initData, dialogs, reviewservice, commentservice, session, USER_ROLES, toastr) {
        var vm = this;
        vm.USER_ROLES = USER_ROLES;

        vm.review = initData;
        session.setCurrentReview(vm.review);

        vm.submitComment = submitComment;
        vm.showDialog = showDialog;
        vm.reload = reload;

        vm.searchSubmit = searchSubmit;

        function submitComment() {
            vm.dataloading = true;
            var comment = {
                'content': vm.newComment
            };
            commentservice.create(vm.review.id, comment)
                .then(submitCommentSuccessful, submitCommentFailed);

            function submitCommentSuccessful(result) {
                $state.reload();
                toastr.success('Successfully submitted!', 'New Comment');
            }

            function submitCommentFailed(error) {
                vm.dataloading = false;
                toastr.error('Failed to submit comment. Please try again.');
            }
        }

        function showDialog() {
            var dlg = dialogs.confirm(
                'Confirm deletion',
                'Do you really want to delete this review?');
            dlg.result.then(confirmDelete, cancel);

            function confirmDelete(btn) {
                reviewservice.delete(vm.review.id)
                    .then(deleteSuccessful, deleteFailed);

                function deleteSuccessful(result) {
                    $state.go('review-list');
                    toastr.success('Review deleted');
                }

                function deleteFailed(error) {
                    toastr.error('Failed to delete the review. Please try again.');
                }
            }

            function cancel(btn) {
            }
        }

        function reload() {
            $state.reload();
        }

        function searchSubmit() {
          $state.go('review-list', {'search': vm.searchQuery, page:1});
        }
    }
})();
