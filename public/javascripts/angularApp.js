var app = angular.module('flapperNews', ['ui.router','ui.sortable','satellizer','toastr']);


//////////////////////////////////////////////////////////////////////////////////

app.config([
'$stateProvider',
'$urlRouterProvider',
'$authProvider',
function($stateProvider, $urlRouterProvider,$authProvider) {

	$authProvider.facebook({
      clientId: '1042472282451884'
    });

	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: '/partials/home.html',
		controller: 'MainCtrl',
		onEnter: [ function(){
				$('#jt3').show();
		  		$('#home').show();
		  		$(window).scrollTop(0);
			}
		],
		resolve: {
			postPromise: ['posts', function(posts){
			  return posts.getAll();
			}]
		}
	})

	.state('posts', {
	  url: '/posts/{id}',
	  templateUrl: '/partials/posts.html',
	  controller: 'PostsCtrl',
	  
	})

	.state('profile', {
	  url: '/profile',
	  templateUrl: '/profile.html',
	  controller: 'ProfileCtrl',
	  onEnter: [function(){
	  	$('#jt3').hide();
	  	$('#home').hide();
	  	$('#categories').hide();
  		$(window).scrollTop(0);
	  }],
	  resolve: {
          loginRequired: loginRequired
      }
	  
	})

	.state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'LoginCtrl',
	  onEnter: ['$state', function($state){
	  	$('#jt3').hide();
  		$('#home').hide();
  		$(window).scrollTop(0);
	    /*if(auth.isLoggedIn()){
	      $state.go('home');
	    }*/
	  }]
	})

	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'SignupCtrl',
	  onEnter: ['$state', function($state){
	  	$('#jt3').hide();
  		$('#home').hide();
  		$(window).scrollTop(0);
	    /*if(auth.isLoggedIn()){
	      $state.go('home');
	    }*/
	  }]
	});


	$urlRouterProvider.otherwise('home');

	function skipIfLoggedIn($q, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.reject();
      } else {
        deferred.resolve();
      }
      return deferred.promise;
    }

    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }

}]);

//////////////////////////////////////////////////////////////////////////////////

app.factory('posts',  ['$http', function($http){
	var o = {
    	posts: []
	};

	o.get = function(id) {
	  return $http.get('/posts/' + id).then(function(res){
	    return res.data;
	  });
	};

	o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  	};

	o.create = function(post) {
	  return $http.post('/posts', post).success(function(data){
	    o.posts.push(data);
	  });
	};

	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null).success(function(data){
	    post.upvotes += 1;
	  });
	};

	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment);
	};

	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null).success(function(data){
	    comment.upvotes += 1;
	  });
	};

	////////////////////////////////////////////////////prueba:

	o.deletePost = function(post) {

	  return $http.post('/posts/' + post._id + '/delete', null).success(function(data){
	  	
	  });
	};

	o.deleteComment = function(post, comment) {

	  return $http.post('/posts/' + post._id + '/comments/'+ comment._id + '/delete', null).success(function(data){
	  	
	  });
	};

	////////////////////////////////////////////////////prueba:

	
	return o;
}]);

app.factory('Account', function($http) {
	return {
	  getProfile: function() {
	    return $http.get('/api/me');
	  },
	  updateProfile: function(profileData) {
	    return $http.put('/api/me', profileData);
	  }
	};
});


/*
app.factory('auth', ['$http', '$window', function($http, $window){
   	var auth = {};
   	var fillingForm = false;

   	auth.saveToken = function (token){
	  $window.localStorage['flapper-news-token'] = token;
	};

	auth.getToken = function (){
	  return $window.localStorage['flapper-news-token'];
	};

	auth.isLoggedIn = function(){
	  var token = auth.getToken();

	  if(token){
	    var payload = JSON.parse($window.atob(token.split('.')[1]));

	    return payload.exp > Date.now() / 1000;
	  } else {
	    return false;
	  }
	};

	auth.setFillingForm =function(){
		fillingForm = true;
	}

	auth.isFillingForm =function(){
		return fillingForm;
	}

	auth.currentUser = function(){
	  if(auth.isLoggedIn()){
	    var token = auth.getToken();
	    var payload = JSON.parse($window.atob(token.split('.')[1]));
	    return payload.username;
	  }
	};

	auth.register = function(user){
	  return $http.post('/register', user).success(function(data){
	  	fillingForm = false;
	    auth.saveToken(data.token);
	  });
	};

	auth.logIn = function(user){
	  return $http.post('/login', user).success(function(data){
	  	fillingForm = false;
	    auth.saveToken(data.token);
	  });
	};

	auth.logOut = function(){
	  $window.localStorage.removeItem('flapper-news-token');
	};

	return auth;
}])
*/

//////////////////////////////////////////////////////////////////////////////////FACEBOOK








