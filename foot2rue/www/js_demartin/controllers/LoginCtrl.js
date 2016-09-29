app.controller('LoginCtrl', function ($scope, $state, $location) {
$scope.data = {};
 console.log($location.path());
  $scope.login = function(data) {
    firebase.auth().signInWithEmailAndPassword(data.email, data.password).then(function () {
      $location.path("/app/profil");
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      alert(error.message);
    });
  };
});