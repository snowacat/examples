const controller = ($scope, $q, $routeParams, $rootScope, userHelpers) => {
  $scope.isLoadingUsers = false;
  $scope.users = [];
  $scope.isVerifiedMerchant = userHelpers.isVerifiedMerchant;
  $scope.userId = $routeParams.id;

  let currentRoles = [];
  let nextUserPage = 0;
  let totalPages = null;

  $scope.$on('removeUserBroadcast', (event, userId) => {
    const userIndex = $scope.users.map((item) => { return item.id; }).indexOf(parseInt(userId, 10));
    $scope.users.splice(userIndex, 1);
  });

  $scope.userRoles = [{
    role: 'user',
    title: 'Users',
    selected: false,
  }, {
    role: 'user',
    title: 'User',
    selected: false,
  }, {
    role: 'moderator',
    title: 'Moderator',
    selected: false,
  }, {
    role: 'admin',
    title: 'Admins',
    selected: false,
  }];

  $scope.searchUsers = (searchText) => {
    const deferred = $q.defer();
    userHelpers.userSearch(searchText).then((response) => {
      deferred.resolve(response.data.data);
    });

    return deferred.promise;
  };

  $scope.getUsers = () => {
    const isStopRequest = nextUserPage === totalPages || $scope.isLoadingUsers;
    if (isStopRequest) {
      return;
    }

    $scope.isLoadingUsers = true;
    nextUserPage += 1;

    const roles = currentRoles.length > 0 ? currentRoles : null;

    userHelpers.getUsersList(nextUserPage, roles).then((response) => {
      const users = response.data.data;
      totalPages = response.data.pagination.total_pages;

      if (nextUserPage === 1) {
        $scope.users = [];
      }

      $scope.users = $scope.users.concat(users);

      $scope.isLoadingUsers = false;
    }, () => {
      $scope.isLoadingUsers = false;
    });
  };

  $scope.toggleRoles = () => {
    nextUserPage = 0;
    currentRoles = $scope.userRoles.filter((role) => {
      return role.selected === true;
    }).map((userRoles) => {
      return userRoles.role;
    }).join(',');

    $scope.getUsers();
  };

  $scope.getUsers();
};

export default ['$scope', '$q', '$routeParams', '$rootScope', 'userHelpersFactory', controller];
