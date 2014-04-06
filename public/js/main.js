var app = angular.module('transcriber', []);

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

// app.directive('folderItem', function() {
// 	return {
// 		restrict: 'AE',
// 		replace: true,
// 		scope: {
// 			title: '='
// 		templateUrl: 'folderItem.html'
// 	};
// });

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

app.directive('noteDisplay', function() {
	return {
		restrict: 'AE',
		replace: true,
		scope: {
			mainNote: '='
		},
		templateUrl: 'noteDisplay.html'
	};
});

app.controller("MainCtrl", function($scope, $http, getUserDataSvc) {
	var user = getUserDataSvc.getData();
	$scope.folders = user.folders;
	$scope.notes = user.folders[0].notes;
	$scope.mainNote = {};

	$scope.fetchNotes = function(folder) {
		$scope.notes = folder.notes;
	}

	$scope.displayNote = function(note) {
		$scope.mainNote = note;
		console.log($scope.mainNote);
	}
});
