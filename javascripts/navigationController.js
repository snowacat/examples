function controller($scope, $mdSidenav) {
  $scope.toggleLeft = () => {
    $mdSidenav('left').toggle();
  };

  $scope.menuItems = [{
    name: 'Players',
    sref: '/players',
    role: ['admin', 'moderator', 'user'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'mailbox',
    role: ['admin'],
    isShowSubitems: false,
    subitems: [
      {name: 'mailbox child 1', sref: '#'},
      {name: 'mailbox child 2', sref: '#'},
      {name: 'mailbox child 3', sref: '#'},
    ],
  }, {
    name: 'billing',
    sref: '#',
    role: ['admin'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'money',
    sref: '#',
    role: ['admin'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'users',
    sref: '#',
    role: ['admin'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'dashboard',
    sref: '/dashboard',
    role: ['user', 'moderator'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'my awards',
    sref: '#',
    role: ['moderator'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'content',
    sref: '#',
    role: ['user', 'moderator'],
    isShowSubitems: false,
    subitems: [],
  }, {
    name: 'options',
    sref: '#',
    role: ['user', 'moderator'],
    isShowSubitems: false,
    subitems: [],
  }];
}

export default ['$scope', '$mdSidenav', controller];
