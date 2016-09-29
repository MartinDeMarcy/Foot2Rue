app.controller('ProfilCtrl', function ($scope, $state, ionicMaterialInk) {
	firebase.auth().onAuthStateChanged(function(user) {
	  if (user) {
	    console.log(user);
	  } else {
	    console.log('Not log in');
	  }
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