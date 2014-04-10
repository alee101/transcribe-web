var app = angular.module('transcriber', ['textAngular', 'ngTagsInput']);

app.directive('noteItem', function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			title: '=',
			preview: '='
		},
		templateUrl: 'noteItem.html'
	};
});


app.controller("MainCtrl", function($scope, $http) {
	var user = window.newuser;
	$scope.notes = user.notes;
	$scope.mainNote = {};
	$scope.editContent = '';
	$scope.editView = false;

	$scope.displayNote = function(note) {
		var confirmation;
		if ($scope.editView) { // if navigating to new note with unsaved note open
			confirmation = confirm('Are you sure you want to cancel editing?');
		} else {
			confirmation = true;
		}
		if (confirmation) {
			$scope.editView = false;
			$scope.mainNote = note;
			$scope.editContent = note.text;
		}
	};

	$scope.enableEdit = function() {
		$scope.editView = true;
	};

	$scope.saveEdit = function() {
		$scope.mainNote.text = $scope.editContent;
		$scope.editView = false;

		// save note
		$http.put('/api/note/'+user.id, $scope.mainNote)
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			console.log('Error: ' + data);
		});
	};

	$scope.cancelEdit = function() {
		$scope.editContent = $scope.mainNote.text
		$scope.editView = false;
	};


	function saveTags() {
		console.log($scope.mainNote);
		$http.put('/api/note/tags/'+user.id, $scope.mainNote)
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			console.log('Error: ' + data);
		});		
	}

	$scope.addTag = function() {
		console.log('Adding');
		saveTags();
	};

	$scope.removeTag = function() {
		console.log('Removing');
		saveTags();
	};
});
