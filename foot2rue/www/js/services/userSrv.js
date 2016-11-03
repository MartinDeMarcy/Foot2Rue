'use strict'; 

angular.module('app.services.userSrv', [])

.factory('userSrv', function($state, $q){
	return {
		register: function(user) {
			var errorMsg;
			if (angular.isDefined(user) && angular.isDefined(user.last_name) && angular.isDefined(user.email) && angular.isDefined(user.first_name) && angular.isDefined(user.password) && angular.isDefined(user.password2))
			{
				if (angular.equals(user.password, user.password2))
				{
					firebase.auth().createUserWithEmailAndPassword(user.email, user.password).then(function() {
		                var userId = firebase.auth().currentUser.uid;
		                var file = document.getElementById('file').files[0];
		                firebase.database().ref('users/' + userId).set({
		                    id: userId,
		                    last_name: user.last_name,
		                    first_name: user.first_name,
		                    nick: user.nick,
		                    email: user.email,
		                    city: user.city,
		                    cp: user.cp,
		                    team_id: 0
		                });
		                if (angular.isDefined(file))
		                {
			                var ref = firebase.storage().ref().child('profil/' + userId);
			                ref.put(file);
			            }
		                $state.go('login');
		            }).catch(function(error) {
		            	//console.log(error);
		              	if (angular.equals(error.code, "auth/weak-password"))
		              	{
		              		errorMsg = "Le mot de passe doit contenir au moins 6 caractères !";
		              		console.log(errorMsg);
		              	}
		              	else if (angular.equals(error.code, "auth/invalid-email"))
		              	{
		              		errorMsg = "L'addresse mail est invalide !";
		              		console.log(errorMsg);
		              	}
		              	else if (angular.equals(error.code, "auth/email-already-in-use"))
		              	{
		              		errorMsg = "L'addresse mail est déjà utilisée par un autre compte !";
		              		console.log(errorMsg);
		              	}
		            });
				}
				else
				{
					errorMsg = "Les mots de passe sont différents !";
					console.log(errorMsg);
				}
			}
			else
			{
				errorMsg = "Des champs du formulaire sont vide !";
				console.log(errorMsg);
			}
		},

		login: function(user) {
			var errorMsg;
			firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function () {
	            $state.go('app.profile');
	        }).catch(function(error) {
	          //console.log(error);
			if (angular.equals(error.code, "auth/user-not-found"))
			{
				errorMsg = "Aucun utilisateur ne corresponds à cette adresse .";
				console.log(errorMsg);
			}
			else if (angular.equals(error.code, "auth/wrong-password"))
			{
				errorMsg = "Le mot de passe ne corresponds pas à cette addresse !";
				console.log(errorMsg);
			}
	        });
		},

		update: function(data) {
			this.isSigned(function(user) {
				if (user)
				{
					if (angular.isDefined(data.last_name) && angular.isDefined(data.first_name))
					{
						firebase.database().ref('users/' + user.uid).update({
		                    last_name: data.last_name,
		                    first_name: data.first_name,
		                    nick: data.nick,
		                    city: data.city,
		                    cp: data.cp
		                });
					}
				}
			});
		},

		logout: function() {
			firebase.auth().signOut().then(function() {
	          $state.go("login");
	        }, function(error) {
	          console.log(error);
	        });
		},

		loginWithGoogle: function() {
			var provider = new firebase.auth.GoogleAuthProvider();
	        firebase.auth().signInWithPopup(provider).then(function(result) {
	          // This gives you a Google Access Token. You can use it to access the Google API.
	          var token = result.credential.accessToken;
	          // The signed-in user info.
	          var user = result.user;
	          console.log(user);
	          $state.go('app.profile');

	        }).catch(function(error) {
	          var errorCode = error.code;
	          var errorMessage = error.message;
	          // The email of the user's account used.
	          var email = error.email;
	          // The firebase.auth.AuthCredential type that was used.
	          var credential = error.credential;
	          console.log(error);
	        });
		},

		isSigned: function(callback) {
			firebase.auth().onAuthStateChanged(function(user) {
				if (user)
					callback(user);
				else
					callback(false);
			});
		},

		getUserPhoto: function(id) {
			var deferred = $q.defer();
			var pathPhoto = "profil/" + id;
	        var imgRef = firebase.storage().ref().child(pathPhoto);

	        imgRef.getDownloadURL().then(function(url) 
	        {
	            //callback(url);
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

		getUserInfos: function() {
			var deferred = $q.defer();
			this.isSigned(function(user) {
				if (user)
				{
					var dbRef = firebase.database().ref('users/' + user.uid);
			        dbRef.on('value', function(snap) {
			            deferred.resolve(snap.val());
			        });
				}
		    });
		    return deferred.promise;
		},

		getUserInfosById: function(id) {
			var deferred = $q.defer();
			var dbRef = firebase.database().ref('users/' + id);
	        dbRef.on('value', function(snap) {
	            deferred.resolve(snap.val());
	        });
	        return deferred.promise;
		},

		getAllUserInfos: function(callback) {
			this.isSigned(function(user) {
				if (user)
				{
					var dbRef = firebase.database().ref('users');
				    dbRef.on('value', function(snap) {
				    	var all = [];
				        angular.forEach(snap.val(), function(value, key) {
				            all.push(value);
				        });
				        callback(all);
				    });
				}
		    });
		}

	}
});
