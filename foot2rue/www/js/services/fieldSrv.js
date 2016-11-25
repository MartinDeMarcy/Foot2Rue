'use strict'; 

angular.module('app.services.fieldSrv', [])

.factory('fieldSrv', function(userSrv, $state, $q){
	return {
		create: function(field) {
			userSrv.isSigned(function(user) {
					if (user)
					{
						if (angular.isDefined(field) && angular.isDefined(field.name) && angular.isDefined(field.location))
						{
							var file = document.getElementById('file').files[0];
							
							var ref = firebase.database().ref('fields/').push();
							ref.set({
								id: ref.key,
								name: field.name,
								location: field.location,
								creator: user.uid,
								likes: 0
							});
				            ref.on('value', function(snapshot) {
				                if (angular.isDefined(file))
				                {
					                var photoRef = firebase.storage().ref().child('fields/' + snapshot.key);
					                photoRef.put(file);
					            }
				            });
				            $state.go('app.fields');
						}
						else
						{
							console.log("Champs incomplets");
						}
					}
			});
		},

		getAllFields: function() {
			var deferred = $q.defer();
			var dbRef = firebase.database().ref('fields');
	        dbRef.on('value', function(snap) {
	        	var all = [];
		        angular.forEach(snap.val(), function(value, key) {
		            all.push(value);
		        });
	            deferred.resolve(all);
	        });
	        return deferred.promise;
		}
	}
});