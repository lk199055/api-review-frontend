(function() {
    'use strict';

    angular
        .module('app.review')
        .controller('ReviewController', ReviewController);

    /** @ngInject */
    function ReviewController($state, initData, dialogs, reviewservice, commentservice,
        ratingservice, session, USER_ROLES, toastr) {
        var vm = this;
        vm.USER_ROLES = USER_ROLES;

        vm.review = initData;
        session.setCurrentReview(vm.review);

        vm.submitComment = submitComment;
        vm.upvote = upvote;
        vm.downvote = downvote;
        vm.showDialog = showDialog;
        vm.reload = reload;
        vm.clickTag = clickTag;

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

        function upvote() {
            ratingservice.upvote(vm.review.id)
                .then(upvoteSuccessful, upvoteFailed);

            function upvoteSuccessful(result) {
                vm.review.upvotes++;
            }

            function upvoteFailed(error) {
                if (error.status == 400 && error.data.detail == 'already rated') {
                    toastr.info('You have already rated this review.');
                } else {
                    toastr.error('Failed to upvote. Please try again.');
                }
            }
        }

        function downvote() {
            ratingservice.downvote(vm.review.id)
                .then(downvoteSuccessful, downvoteFailed);

            function downvoteSuccessful(result) {
                vm.review.downvotes++;
            }

            function downvoteFailed(error) {
                if (error.status == 400 && error.data.detail == 'already rated') {
                    toastr.info('You have already rated this review.');
                } else {
                    toastr.error('Failed to downvote. Please try again.');
                }
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

        function clickTag(tagName) {
          $state.go('review-list', {'search': tagName, type: 'tag', page: 1});
        }
    }
})();
