app.controller('ProfilCtrl', function ($scope, $state, ionicMaterialInk, $location) {
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
    //ionic.material.ink.displayEffect();
    ionicMaterialInk.displayEffect();

    // Toggle Code Wrapper
    var code = document.getElementsByClassName('code-wrapper');
    for (var i = 0; i < code.length; i++) {
        code[i].addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }
});