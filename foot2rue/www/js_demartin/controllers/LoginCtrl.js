app.controller('LoginCtrl', function ($scope, $state, $location) {
$scope.data = {};
 
  $scope.login = function(data) {
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(function () {
      $location.path( "#/app/profil" );
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(error);
    });
  };
});