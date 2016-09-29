app.controller('AppCtrl', function ($scope, $ionicModal, $ionicPopover, $timeout, $location) {
    // Form data for the login modal
    $scope.loginData = {};
    user = localStorage.getItem('profile');
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        firebase.auth().signInWithEmailAndPassword(user.email, user.password).then(function () {
          console.log("User is signed in.");
        });
      } 
      else
        console.log("No user is signed in.");
    });

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    // .fromTemplate() method
    var template = '<ion-popover-view>' +
                    '   <ion-header-bar>' +
                    '       <h1 class="title">My Popover Title</h1>' +
                    '   </ion-header-bar>' +
                    '   <ion-content class="padding">' +
                    '       My Popover Contents' +
                    '   </ion-content>' +
                    '</ion-popover-view>';

    $scope.popover = $ionicPopover.fromTemplate(template, {
        scope: $scope
    });
    $scope.closePopover = function () {
        $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.popover.remove();
    });
    $scope.signOut = function() {
    firebase.auth().signOut().then(function() {
        console.log("asa");
      $location.path( "#/login");
    }, function(error) {
      console.log(error);
    });
  };
});