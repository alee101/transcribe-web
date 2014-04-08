var app = angular.module('transcriber', ['textAngular']);

app.factory('getUserDataSvc', function($http) {
	return {
		getData: function() {
			user = {
				'name': 'John',
				'folders': [
					{'title': 'Folder01',
					 'notes': [
						{'preview': 'This is a preview of some note.',
						 'id': 123},
						{'preview': 'This is a preview of some note.',
						 'id': 234},
						{'preview': 'This is a preview of some note.',
						  'id': 345},
						{'preview': 'This is a preview of some note.',
						 'id': 456},
						{'preview': 'This is a preview of some note.',
						 'id': 567},
						{'preview': 'This is a preview of some note.',
						 'id': 678}
					]},
					{'title': 'Folder02',
					 'notes': [
						{'preview': 'This is a preview of some note in folder 2.',
						 'id': 789},
						{'preview': 'This is a preview of some note in folder 2.',
						 'id': 987},
						{'preview': 'This is a preview of some note in folder 2.',
						  'id': 654},
						{'preview': 'This is a preview of some note in folder 2.',
						 'id': 321}
					]},					
				]
			};
			return user;
		}
	};
});


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


app.controller("MainCtrl", function($scope, $http, getUserDataSvc) {
	var user = getUserDataSvc.getData();
	$scope.folders = user.folders;
	$scope.notes = user.folders[0].notes;
	$scope.mainNote = {};
	$scope.editContent = '';
	$scope.editView = false;

	$scope.fetchNotes = function(folder) {
		$scope.notes = folder.notes;
	};

	$scope.displayNote = function(note) {
		$scope.mainNote = note;
		$scope.editContent = note.preview;
	};

	$scope.enableEdit = function() {
		$scope.editView = true;
	};

	$scope.saveEdit = function() {
		$scope.mainNote.preview = $scope.editContent;
		$scope.editView = false;
	};

	$scope.cancelEdit = function() {
		$scope.editContent = $scope.mainNote.preview;
		$scope.editView = false;
	};
});
