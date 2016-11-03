'use strict'; 

angular.module('app.services.teamSrv', [])

.factory('teamSrv', function(userSrv, $state, $q){

	return {
			getTeamByUser: function(user) {
				var deferred = $q.defer();
				var ref = firebase.database().ref('teams/' + user.team_id);
				ref.on('value', function(snapshot) {
					deferred.resolve(snapshot.val());
				});
				return deferred.promise;
			},

			getTeamById: function(id) {
				var deferred = $q.defer();
				var ref = firebase.database().ref('teams/' + id);
				ref.on('value', function(snapshot) {
					deferred.resolve(snapshot.val());
				});
				return deferred.promise;
			},

			getAllTeams: function() {
				var deferred = $q.defer();
				var dbRef = firebase.database().ref('teams');
				dbRef.on('value', function(snapshot) {
					deferred.resolve(snapshot.val());
				});
				return deferred.promise;
			},

			getTeamPhoto: function(id, callback) {
				var deferred = $q.defer();
				var pathPhoto = "team/" + id;
		        var imgRef = firebase.storage().ref().child(pathPhoto);

		        imgRef.getDownloadURL().then(function(url) 
		        {
		            deferred.resolve(url);
		        }).catch(function(error) 
		        {
		            switch (error.code) 
		            {
		                case 'storage/object_not_found':
		                    break;

		                case 'storage/unauthorized':
		                    break;

		                case 'storage/canceled':
		                    break;

		                case 'storage/unknown':
		                    break;
		            }
		            deferred.reject(error);
		            console.log(error);
	        	});
	        	return deferred.promise;
			},

			create: function(team) {
				userSrv.isSigned(function(user) {
					if (user)
					{
						if (angular.isDefined(team) && angular.isDefined(team.name))
						{
							var file = document.getElementById('file').files[0];
							
							var ref = firebase.database().ref('teams/').push();
							ref.set({
								id: ref.key,
								name: team.name,
								nick: team.nick,
								captain: user.uid,
								players: {
									player0: user.uid,
									player1: 0,
									player2: 0,
									player3: 0,
									player4: 0
								}
							});
				            ref.on('value', function(snapshot) {
				            	firebase.database().ref('users/' + user.uid).update({
				            		team_id: snapshot.key
				                });
				                if (angular.isDefined(file))
				                {
					                var photoRef = firebase.storage().ref().child('team/' + snapshot.key);
					                photoRef.put(file);
					            }
				            });
				            $state.go('app.profile');
						}
						else
						{
							console.log("Champs incomplets");
						}
					}
				});
			},

			

		}
});
