(function() {
    'use strict';

    angular
        .module('app.reviewEditor')
        .controller('ReviewEditorController', ReviewEditorController);

    /** @ngInject */
    function ReviewEditorController($state, $stateParams, initData, dialogs, reviewservice,
        apiservice, userservice, tagservice, ratingservice, session, toastr) {
        var vm = this;

        vm.review = initData;

        vm.isEditMode = ($state.current.name == 'review-item-edit');
        vm.loadTags = loadTags;
        vm.showCreateTagDialog = showCreateTagDialog;
        vm.submit = submitReview;
        vm.cancel = cancelEdit;

        // Get all APIs for autocomplete
        vm.allApis = [];

        apiservice.getAll()
            .then(getAllAPIsSuccess, getAllAPIsFailed);

        function getAllAPIsSuccess(result) {
            vm.allApis = result.results;
        }

        function getAllAPIsFailed(result) {
        }

        // Populate API info
        if (vm.isEditMode) {
            vm.selectedApi = {
                'originalObject': vm.review.api
            };
        } else if (typeof $stateParams.api !== undefined) {
            var api = session.getCurrentAPI();
            if (api != null && api.id == $stateParams.api) {
                vm.review.api = api;
                vm.selectedApi = {
                    'originalObject': api
                };
            }
        }

        function loadTags(query) {
            return tagservice.getAll()
                .then(function (result) {
                    var tags = result.results;
                    return tags.filter(function (tag) {
                        return tag.name.toLowerCase().indexOf(query.toLowerCase()) != -1;
                    });
                });
        }

        function showCreateTagDialog() {
            var dlg = dialogs.create(
                '/app/components/review-editor/create-tag-dialog.html',
                'CreateTagDialogController',
                {});
            dlg.result.then(saveTag, cancel);

            function saveTag(name) {
                var tag = {
                    'name': name
                }
                tagservice.create(tag)
                    .then(createTagSuccessful, createTagFailed);

                function createTagSuccessful(result) {
                    vm.review.tags.push(result);
                    toastr.success('New tag \'' + result.name + '\' added!');
                }

                function createTagFailed(error) {
                    toastr.error('Failed to add the tag. Please try again.');
                }
            }

            function cancel(btn) {
            }
        }

        function submitReview() {
            vm.dataLoading = true;
            var reviewObj = {
                'title': vm.review.title,
                'content': vm.review.content,
                // 'description': vm.review.description,
                'api_id': vm.review.api.id,
                'tag_ids': []
            };
            angular.forEach(vm.review.tags, function(tag) {
                reviewObj.tag_ids.push(tag.id);
            });
            if (vm.isEditMode) {
                reviewObj.id = vm.review.id;
                reviewservice.update(reviewObj)
                    .then(updateReviewSuccessful, submitReviewFailed);
            } else {
                reviewObj.api_id = vm.selectedApi.originalObject.id;
                reviewservice.create(reviewObj)
                    .then(createReviewSuccessful, submitReviewFailed);
            }

            function createReviewSuccessful(result) {
                $state.go('review-item-view', {id: result.id});
                toastr.success('Successfully created!', 'New Review');
            }

            function updateReviewSuccessful(result) {
                $state.go('review-item-view', {id: vm.review.id});
                toastr.success('Review successfully updated!');
            }

            function submitReviewFailed(result) {
                vm.dataLoading = false;
                toastr.error('Failed to submit review. Please try again.');
            }
        }

        function cancelEdit() {
            if (vm.isEditMode) {
                $state.go('review-item-view', {id: vm.review.id});
            } else {
                $state.go('home');
            }
        }
    }
})();
