/* global angular, document, window */
'use strict';

angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopover, $timeout, $state, userSrv) {
    // Form data for the login modal
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.signOut = function() {
        userSrv.logout();
    };

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})

.controller('LoginCtrl', function($scope, userSrv) {
    $scope.$on('$ionicView.enter', function () {
        $scope.login = function(data) {
            userSrv.login(data);
        };

        $scope.signWithGoogle = function() {
            console.log("Building");
        };
    });
})

.controller('RegisterCtrl', function($scope, userSrv) {
    $scope.$on('$ionicView.enter', function () {
        $scope.user = {nick: "", city: "", cp: ""};

        $scope.create = function(user) {
            userSrv.register(user);
        };
    });
})

.controller('TeamCtrl', function($scope, $stateParams, teamSrv, userSrv) {
    $scope.$on('$ionicView.enter', function () {
        teamSrv.getTeamById($stateParams.teamId).then(function(data) {
            $scope.data = data;
            $scope.players = [];
            angular.forEach(data.players, function(value, key) {
                userSrv.getUserInfosById(value).then(function(infos) {
                    if (infos != null)
                    {
                        $scope.players.push(infos);
                         userSrv.getUserPhoto(infos.id).then(function(url) {
                            angular.forEach(angular.element(document).find('img'), function(attribut, cle) {
                                if (attribut.id != null && value == attribut.id)
                                {
                                    attribut.src = url;
                                }
                            });
                        });
                    }

                });
            });
        });
        teamSrv.getTeamPhoto($stateParams.teamId).then(function(url) {
            $scope.backgroundUrl = url;
        });
        userSrv.getUserInfos().then(function(user) {
            if (user.team_id == 0)
            {
                $scope.request = false;
            }
            else
            {
                $scope.request = true;
            }
        })
    });
})

.controller('TeamsCtrl', function($scope, $stateParams, teamSrv) {
    $scope.$on('$ionicView.enter', function () {
        teamSrv.getAllTeams().then(function(teams) {
            $scope.teams = teams;
            angular.forEach(teams, function(value, key) {
                teamSrv.getTeamPhoto(value.id).then(function(url) {
                    angular.forEach(angular.element(document).find('img'), function(attribut, cle) {
                        if (value.id == attribut.id)
                        {
                            attribut.src = url;
                        }
                    });
                });
            });
        })
    });
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion, userSrv) {
    // Set Header
    $scope.$on('$ionicView.enter', function () {
        userSrv.getAllUserInfos(function(all) {
            angular.forEach(all, function(value, key) {
                userSrv.getUserPhoto(value.id).then(function(url) {
                    angular.forEach(angular.element(document).find('img'), function(attribut, cle) {
                        if (value.id == attribut.id)
                        {
                            attribut.src = url;
                        }
                    });
                });
            });
            $scope.users = all;
        });

        $scope.$parent.showHeader();

        // Delay expansion
        $timeout(function() {
            $scope.isExpanded = true;
            $scope.$parent.setExpanded(true);
        }, 300);

        /*// Set Motion
        ionicMaterialMotion.fadeSlideInRight();*/

        // Set Ink
        ionicMaterialInk.displayEffect();
    });
})

.controller('ProfileCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, userSrv, teamSrv) {

    $scope.$on('$ionicView.enter', function () {
        userSrv.getUserInfos().then(function(infos) {
            $scope.data = infos;
            $scope.players = [];
            userSrv.getUserPhoto(infos.id).then(function(url) {
                document.querySelector('.imgProfil').src = url;
            });
            if (infos.team_id != 0)
            {
                teamSrv.getTeamByUser(infos).then(function(team) {
                    $scope.team = team;
                    if (team.captain == infos.id)
                    {
                        $scope.isCaptain = true;
                    }
                    angular.forEach(team.players, function(value, key) {
                        if (value != 0)
                        {
                            userSrv.getUserInfosById(value).then(function(player) {
                                $scope.players.push(player);
                                userSrv.getUserPhoto(player.id).then(function(url) {
                                    angular.forEach(angular.element(document).find('img'), function(attribut, cle) {
                                        if (attribut.id != null && value == attribut.id)
                                        {
                                            attribut.src = url;
                                        }
                                    });
                                });
                            });
                        }
                    });
                    teamSrv.getTeamPhoto(infos.team_id).then(function(url) {
                        $scope.backgroundUrl = url;
                    });
                });
                $scope.teamDisplay = false;
            }
            else
            {
                $scope.isCaptain = false;
                $scope.teamDisplay = true;
                $scope.backgroundUrl = "https://firebasestorage.googleapis.com/v0/b/foot2rue-2c890.appspot.com/o/red-geometrical-background_1085-125.jpg?alt=media&token=b24107a4-3289-42ad-b3ca-3405213aa351";
            }
        });

        $scope.changeView = function(index) {
            $scope.pannels = [true, true, true, true];
            $scope.pannels[index] = false;
        };

        $scope.leave = function(team) {
            teamSrv.leaveTeam(team);
        };

        $scope.update = function(data) {
            userSrv.update(data);
        };

        $scope.changeView(1);
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        // Set Motion
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        /*$timeout(function() {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);*/

        // Set Ink
        ionicMaterialInk.displayEffect();
    });
})

.controller('PlayerCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk, userSrv, teamSrv) {
    
    $scope.$on('$ionicView.enter', function () {
            userSrv.getUserInfosById($stateParams.playerId).then(function(infos) {
            $scope.data = infos;
            $scope.players = [];
            userSrv.getUserPhoto($stateParams.playerId).then(function(url) {
                document.querySelector('.imgProfil').src = url;
            });
            if (infos.team_id != 0)
            {
                teamSrv.getTeamByUser(infos).then(function(team) {
                    angular.forEach(team.players, function(value, key) {
                        if (value != 0)
                        {
                            userSrv.getUserInfosById(value).then(function(player) {
                                $scope.players.push(player);
                                userSrv.getUserPhoto(player.id).then(function(url) {
                                    angular.forEach(angular.element(document).find('img'), function(attribut, cle) {
                                        if (attribut.id != null && value == attribut.id)
                                        {
                                            attribut.src = url;
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
                teamSrv.getTeamPhoto(infos.team_id).then(function(url) {
                    $scope.backgroundUrl = url;
                });
                $scope.teamDisplay = false;
            }
            else
            {
                $scope.teamDisplay = true;
                $scope.backgroundUrl = "https://firebasestorage.googleapis.com/v0/b/foot2rue-2c890.appspot.com/o/red-geometrical-background_1085-125.jpg?alt=media&token=b24107a4-3289-42ad-b3ca-3405213aa351";
            }
            
        });

        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = false;
        $scope.$parent.setExpanded(false);
        $scope.$parent.setHeaderFab(false);

        // Set Motion
        $timeout(function() {
            ionicMaterialMotion.slideUp({
                selector: '.slide-up'
            });
        }, 300);

        /*$timeout(function() {
            ionicMaterialMotion.fadeSlideInRight({
                startVelocity: 3000
            });
        }, 700);*/

        // Set Ink
        ionicMaterialInk.displayEffect();
    });
})

.controller('teamCreationCtrl', function($scope, teamSrv) {
    $scope.$on('$ionicView.enter', function () {
        $scope.create = function(team) {
            teamSrv.create(team);
        };
    });
})

.controller('ActivityCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$on('$ionicView.enter', function () {
        $scope.$parent.showHeader();
        $scope.$parent.clearFabs();
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
        $scope.$parent.setHeaderFab('right');

        $timeout(function() {
            ionicMaterialMotion.fadeSlideIn({
                selector: '.animate-fade-slide-in .item'
            });
        }, 200);

        // Activate ink for controller
        ionicMaterialInk.displayEffect();
    });
})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

;
