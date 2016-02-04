// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','firebase'])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://pos-test-pku.firebaseio.com/users/");
  return $firebaseAuth(usersRef)
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.controller('LoginCtrl',function($scope,$ionicModal,Auth){
  $scope.user = {};

  $ionicModal.fromTemplateUrl('login.html', {
    scope: $scope,
    animation: 'slide-in-up',
  }).then(function(modal) {
    $scope.modal = modal;
    var authData = Auth.$getAuth();
    if( authData ) {
      $scope.user = authData;
    } else {
      $scope.modal.show();
    }
  });

  $scope.UserLogin = function(type) {
    Auth.$authWithOAuthRedirect(type).then(function(authData) {
      // User successfully logged in
      $scope.user = authData;
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup(type).then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          $scope.user = authData;
          $scope.modal.hide();
          console.log(authData);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  }
})
