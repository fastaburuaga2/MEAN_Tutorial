
app.controller('MainCtrl', [
'$scope', 'posts', 
function($scope, posts){

	$scope.posts = posts.posts;
	//$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addPost = function(){
	  if(!$scope.title || $scope.title === '') { return; }
	  posts.create({
	    title: $scope.title,
	    link: $scope.link,
	  });
	  $scope.title = '';
	  $scope.link = '';
	};

	$scope.incrementUpvotes = function(post) {
	  posts.upvote(post);
	};

	$scope.deletePost = function(key,post){

		$scope.posts.splice(key, 1);
		posts.deletePost(post);
	};

}]);

//////////////////////////////////////////////////////////////////////////////////

app.controller('PostsCtrl', [
'$scope',
'posts',
'post' ,
function($scope, posts, post){

	$scope.post = post;
	//$scope.isLoggedIn = auth.isLoggedIn;

	$scope.addComment = function(){
		if($scope.body === '') { return; }
		posts.addComment(post._id, {
			body: $scope.body,
			author: 'user',
		}).success(function(comment) {
			$scope.post.comments.push(comment);
		});
		$scope.body = '';
	};

	$scope.incrementUpvotes = function(comment){
	  	posts.upvoteComment(post, comment);
	};

	$scope.deleteComment = function(key,comment){
		$scope.post.comments.splice(key, 1);
		posts.deleteComment(post, comment);

	};

	

}]);

app.controller('NavCtrl', [
'$scope',
'$auth',
'Account',
function($scope,$auth,Account){
	$scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          //notificar cliente
        });
    };

    $scope.logout = function() {
    	$auth.logout();
    };

    $scope.isAuthenticated = function() {
	  return $auth.isAuthenticated();
	};

    $scope.getProfile();
	
}]);

app.controller('LoginCtrl', function($scope, $auth, $state, $location,Account) {

    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          //notificar cliente
        });
    };

    $scope.login = function() {
      $auth.login($scope.user)
        .then(function() {
          //notificar cliente
          $scope.getProfile();
          $state.go('home');
        })
        .catch(function(error) {
          //notificar cliente
        });
    };

    $scope.authenticate = function(provider) {
      $auth.authenticate(provider);
	    $scope.getProfile();
      $location.path('/');

    };

  });

app.controller('SignupCtrl', function($scope, $location, $auth) {
    $scope.signup = function() {

      $auth.signup($scope.user)
        .then(function(response) {
          $auth.setToken(response);
          $location.path('/');
        })
        .catch(function(response) {
        	////ERROR
        });
    };
  });


app.controller('ProfileCtrl', function($scope, $auth, Account) {
    $scope.getProfile = function() {
      Account.getProfile()
        .then(function(response) {
          $scope.user = response.data;
        })
        .catch(function(response) {
          //notificar cliente
        });
    };
    $scope.updateProfile = function() {
      Account.updateProfile($scope.user)
        .then(function() {
          //notificar cliente
        })
        .catch(function(response) {
          //notificar cliente
        });
    };
    $scope.link = function(provider) {
      $auth.link(provider)
        .then(function() {
          //notificar cliente
          $scope.getProfile();
        })
        .catch(function(response) {
          //notificar cliente
        });
    };
    $scope.unlink = function(provider) {
      $auth.unlink(provider)
        .then(function() {
          //notificar cliente
          $scope.getProfile();
        })
        .catch(function(response) {
          //notificar cliente
        });
    };

    $scope.getProfile();
  });


//////////////////////////OTROS
