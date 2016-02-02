function controller($scope, $auth, $mdSidenav, $location) {
  $scope.toggleLeft = () => {
    $mdSidenav('left').toggle();
  };

  $scope.signOut = () => {
    $auth.signOut()
      .then(() => {
        $location.path('/');
      });
  };
}

export default ['$scope', '$auth', '$mdSidenav', '$location', controller];
