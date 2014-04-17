var app = angular.module('transcriber', ['textAngular', 'ngTagsInput']);

app.factory('noteService', function ($http) {
	return {
		saveNote: function(note) {
			return $http.put('/api/note', note);
		},

		deleteNote: function(noteId) {
			return $http.delete('/api/note/delete/'+noteId);
		},

		refreshNotes: function() {
			return $http.get('/api/notes');
		},

		saveTags: function(note) {
			return $http.put('/api/note/tags', note);
		}
	}
});


app.directive('noteItem', function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			note: '='
		},
		templateUrl: 'noteItem.html',
		link: function($scope, element, attrs) {
			$scope.previewFilter = function(text) {
				return text.substring(0, 80);
			};

			$scope.deleteNote = function(note) {
				var confirmation = confirm('Delete this note?');
				if (confirmation) {
					// remove from sidebar
					var index = $scope.$parent.notes.indexOf(note);
					$scope.$parent.notes.splice(index, 1);

					// delete note
					$scope.$parent.deleteNote(note);
				}
			};
		}
	};
});


app.controller("MainCtrl", function ($scope, noteService) {
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

	$scope.deleteNote = function(note) {
		noteService.deleteNote(note._id)
		.success(function (data) {
			console.log(data);
			if ($scope.mainNote === note) { // if note to delete in main view
				$scope.mainNote = {};
				$scope.editContent = '';
				$scope.editView = false;
			}
		})
		.error(function (data) {
			console.log('Error deleting note');
		});
	};

	$scope.refreshNotes = function() {
		console.log('Refreshing note');
		noteService.refreshNotes()
		.success(function (notes) {
			$scope.notes = notes;			
		})
		.error(function (data) {
			console.log('Error refreshing notes');
		});
	};

	$scope.enableEdit = function() {
		$scope.editView = true;
	};

	$scope.saveEdit = function() {
		$scope.mainNote.text = $scope.editContent;
		$scope.editView = false;

		noteService.saveNote($scope.mainNote)
		.success(function (data) {
			console.log(data);
		})
		.error(function (data) {
			console.log('Error saving note');
		});
	};

	$scope.cancelEdit = function() {
		$scope.editContent = $scope.mainNote.text
		$scope.editView = false;
	};

	$scope.addTag = function() {
		console.log('Adding');
		noteService.saveTags($scope.mainNote)
		.error(function (data) {
			console.log('Error adding tag');
		});
	};

	$scope.removeTag = function() {
		console.log('Removing');
		noteService.saveTags($scope.mainNote)
		.error(function (data) {
			console.log('Error removing tag');
		});
	};
});
