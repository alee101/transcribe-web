var app = angular.module('transcriber', ['textAngular']);

app.factory('getUserDataSvc', function() {
	return {
		getData: function() {
			user = {
				'name': 'John',
				'folders': [
					{'title': 'Folder01',
					 'notes': [
						{'title': 'MyNote01',
						 'preview': 'This is a preview of some note.',
						 'id': 123},
						{'title': 'MyNote02',
						 'preview': 'This is a preview of some note.',
						 'id': 234},
						{'title': 'MyNote03',
						 'preview': 'This is a preview of some note.',
						  'id': 345},
						{'title': 'MyNote04',
						 'preview': 'This is a preview of some note.',
						 'id': 456},
						{'title': 'MyNote05',
						 'preview': 'This is a preview of some note.',
						 'id': 567},
						{'title': 'MyNote06',
						 'preview': 'This is a preview of some note.',
						 'id': 678}
					]},
					{'title': 'Folder02',
					 'notes': [
						{'title': 'MyNote07',
						 'preview': 'This is a preview of some note in folder 2.',
						 'id': 789},
						{'title': 'MyNote08',
						 'preview': 'This is a preview of some note in folder 2.',
						 'id': 987},
						{'title': 'MyNote09',
						 'preview': 'This is a preview of some note in folder 2.',
						  'id': 654},
						{'title': 'MyNote10',
						 'preview': 'This is a preview of some note in folder 2.',
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
	$scope.editContent = '';
	$scope.editView = false;

	$scope.fetchNotes = function(folder) {
		$scope.notes = folder.notes;
	};

	$scope.displayNote = function(note) {
		$scope.editContent = note.preview;
	};

	$scope.enableEdit = function() {
		$scope.editView = true;
	};

	$scope.saveEdit = function() {
		$scope.editView = false;
	};

	$scope.cancelEdit = function() {
		$scope.editView = false;
	};
});
