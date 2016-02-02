import angular from 'angular';

function controller($scope, $rootScope, userHelpers, Upload) {
  $scope.isAdmin = userHelpers.isAdmin($rootScope.user);
  $scope.isVerifiedMerchant = userHelpers.isVerifiedMerchant($rootScope.user);

  if (typeof $scope.userId !== 'undefined') {
    userHelpers.usersDetails.get({userId: $scope.userId}, (response) => {
      $scope.currentUser = userHelpers.parseUser(response.data);
      $scope.isCurrentUser = userHelpers.isCurrentProfile($rootScope.user, $scope.currentUser);
      $scope.userBackup = userHelpers.parseUser(response.data);
    }, () => {
      console.log('Cannot load data!');
    });
  } else {
    $scope.isCurrentUser = true;
    $scope.currentUser = userHelpers.parseUser($rootScope.user);
    $scope.userBackup = userHelpers.parseUser($rootScope.user);
  }

  $scope.clearPasswordFields = () => {
    $scope.currentUser.password = null;
    $scope.currentUser.passwordConfirmation = null;
    $scope.currentUser.currentPassword = null;
  };

  $scope.resetSettingsData = () => {
    $scope.currentUser.username = $scope.userBackup.username;
    $scope.currentUser.email = $scope.userBackup.email;
    $scope.messages = null;
    $scope.clearPasswordFields();
  };

  $scope.uploadFiles = (file) => {
    if (file) {
      $rootScope.userPhoto = $scope.currentUser.newPhoto;

      Upload.upload({
        url: `${API_URL}images/avatar_uploader`,
        data: {origin: file},
      }).then((resp) => {
        userHelpers.userUpdate({avatar_id: resp.data.data.file_id}, () => {
          console.log('Avatar Updated');
        }, () => {
          console.log('Avatar not updated');
        });
      }, (resp) => {
        console.log(`Error status: ${resp.status}`);
      });
    }
  };

  // Update Account Settings
  $scope.submitAccount = () => {
    const accountSettings = userHelpers.parseAccountSettings($scope.currentUser);

    userHelpers.userUpdate(accountSettings).then(() => {
      console.log('Updated Account');
      $scope.messages = null;
    }, (error) => {
      console.log('Error');
      $scope.messages = JSON.parse(error.data.meta.messages);
    });
  };

  // Update Profile Settings
  $scope.submitProfile = () => {
    const profileSettings = userHelpers.parseProfileSettings($scope.currentUser);

    userHelpers.userUpdate(profileSettings).then(() => {
      console.log('Updated Account');
      $scope.messages = null;
    }, (error) => {
      console.log('Error');
      $scope.messages = JSON.parse(error.data.meta.messages);
    });
  };
}

export default ['$scope', '$rootScope', 'userHelpersFactory', 'Upload', controller];
