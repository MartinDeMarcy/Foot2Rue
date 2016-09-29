app.controller('RegisterCtrl', function ($scope, AuthService, $location) {
	$scope.user = {};

	/*var bigOne = document.getElementById('bigOne');
    var dbRef = firebase.database().ref().child('text');
    dbRef.on('value', snap => bigOne.innerText = snap.val());*/
	$scope.create = function(user) {
		console.log(user);
		e = user.email;
		p = user.password;
		firebase.auth().createUserWithEmailAndPassword(e, p).then(function() {
			var userId = firebase.auth().currentUser.uid;
			console.log(userId);
			firebase.database().ref('users/' + userId).set({
				id: userId,
			    last_name: user.last_name,
			    first_name: user.first_name,
			    email: user.email,
			    citu: user.city,
			    cp: user.cp
			});
			$location.path( "#/login");
		}).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  console.log(error);
		});
			
	};
});