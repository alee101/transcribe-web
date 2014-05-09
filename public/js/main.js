var app = angular.module('transcriber', ['textAngular', 'ngTagsInput']);

app.factory('noteService', function ($http) {
	return {
		addNote: function(note) {
			return $http.post('/api/note', note);
		},

		saveNote: function(note) {
			return $http.put('/api/note', note);
		},

		shareNote: function(note) {
			return $http.put('/api/note/share', note);
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

app.directive('resizable', function($window) {
	return function($scope) {
		$scope.initializeWindowSize = function() {
			$scope.windowHeight = $window.innerHeight - 50;
		};
		$scope.initializeWindowSize();
		return angular.element($window).bind('resize', function() {
			$scope.initializeWindowSize();
			$scope.$apply();
		});
	};
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
				return String(text).replace(/<[^>]+>/gm, '').substring(0, 60);
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
	$scope.uname = user.uname;
	$scope.notes = user.notes;
	$scope.mainNote = {};
	$scope.editContent = '';
	$scope.editView = false;
	$scope.shareText = 'Share';

	$scope.displayNote = function(note) {
		var changeNote;
		if ($scope.editView) { // if navigating to new note with unsaved note open
			changeNote = confirm('Are you sure you want to cancel editing?');
		} else {
			changeNote = true;
		}
		if (changeNote) {
			$scope.editView = false;
			$scope.mainNote = note;
			$scope.editContent = note.text;
			$scope.shareText = note.shareUrl ? ('Share url: ' + note.shareUrl) : 'Share';
		}
	};

	$scope.deleteNote = function(note) {
		noteService.deleteNote(note._id)
		.success(function (data) {
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

	$scope.addNote = function() {
		$scope.notes.unshift({ text: 'New note' });
		noteService.addNote($scope.notes[0])
		.success(function (data) {
			console.log(data);
			$scope.notes[0] = data.note;
		})
		.error(function (data) {
			console.log('Error saving new note');
		});
	};

	$scope.shareNote = function() {
		console.log('sharing');
		if (!$scope.mainNote.shareUrl) {
			noteService.shareNote($scope.mainNote)
			.success(function (data) {
				console.log(data);
				$scope.mainNote.shareUrl = data.path;
				$scope.shareText = 'Share url: ' + data.path;
			})
			.error(function (data) {
				console.log('Error sharing note');
			});
		}
	};

	$scope.showShare = function() {
		$scope.sharebar = true;
	};

	$scope.hideShare = function() {
		$scope.sharebar = false;
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

	$scope.multiWordFilter = function(note) {
		if (!$scope.searchText) 
			return true;

		var queries = $scope.searchText.split(' ').map(function (query) { return query.toLowerCase(); });
		if (searchSub(note.text.toLowerCase(), queries)) 
			return true;

		for (var i = 0; i < note.tags.length; i++) {
			if (searchSub(note.tags[i].text.toLowerCase(), queries)) 
				return true;
		}
		return false;
	};

	function searchSub(txt, queries) {
		for (var i = 0; i < queries.length; i++) {
			if (txt.indexOf(queries[i]) === -1)
				return false;
		}
		return true;
	}
});
