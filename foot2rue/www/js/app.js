// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'ionic-material', 'ionMdInput', 'app.services'])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})


.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Turn off caching for demo simplicity's sake
    $ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */

    $stateProvider.state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
    })

    .state('app.activity', {
        url: '/activity',
        views: {
            'menuContent': {
                templateUrl: 'templates/activity.html',
                controller: 'ActivityCtrl'
            }
        }
    })

    .state('app.friends', {
        url: '/friends',
        views: {
            'menuContent': {
                templateUrl: 'templates/friends.html',
                controller: 'FriendsCtrl'
            }
        }
    })

    .state('app.teams', {
        url: '/teams',
        views: {
            'menuContent': {
                templateUrl: 'templates/teams.html',
                controller: 'TeamsCtrl'
            }
        }
    })

    .state('app.teamCreation', {
        url: '/team/creation',
        views: {
            'menuContent': {
                templateUrl: 'templates/team_creation.html',
                controller: 'teamCreationCtrl'
            }
        }
    })

    .state('app.fields', {
        url: '/fields',
        views: {
            'menuContent': {
                templateUrl: 'templates/fields.html',
                controller: 'FieldsCtrl'
            }
        }
    })

    .state('app.fieldCreation', {
        url: '/field/creation',
        views: {
            'menuContent': {
                templateUrl: 'templates/field_creation.html',
                controller: 'FieldCreationCtrl'
            }
        }
    })

    .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    })

    .state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'RegisterCtrl'
    })

    .state('app.field', {
        url: "/field/:fieldId",
        views: {
            'menuContent': {
                templateUrl: 'templates/field.html',
                controller: 'FieldCtrl'
            }
        }
    })

    .state('app.team', {
        url: "/team/:teamId",
        views: {
            'menuContent': {
                templateUrl: 'templates/team.html',
                controller: 'TeamCtrl'
            }
        }
    })
    
    .state('app.player', {
        url: "/player/:playerId",
        views: {
            'menuContent': {
                templateUrl: 'templates/player.html',
                controller: 'PlayerCtrl'
            }
        }
    })

    .state('app.profile', {
        url: '/profile',
        views: {
            'menuContent': {
                templateUrl: 'templates/profile.html',
                controller: 'ProfileCtrl'
            }
        }
    })
    ;

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
});