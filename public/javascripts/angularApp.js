var app = angular.module('flapperNews', ['ui.router','ui.sortable','satellizer']);


//////////////////////////////////////////////////////////////////////////////////

app.config([
'$stateProvider',
'$urlRouterProvider',
'$authProvider',
function($stateProvider, $urlRouterProvider,$authProvider) {

	$authProvider.facebook({
      clientId: '524876354354514'
    });

	$stateProvider
	.state('home', {
		url: '/home',
		templateUrl: '/home.html',
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
	  templateUrl: '/posts.html',
	  controller: 'PostsCtrl',
	  
	})

	.state('profile', {
	  url: '/profile',
	  templateUrl: '/profile.html',
	  controller: 'MainCtrl',
	  onEnter: [function(){
	  	$('#jt3').hide();
	  	$('#home').hide();
	  	$('#categories').hide();
  		$(window).scrollTop(0);
	  }]
	  
	})

	.state('login', {
	  url: '/login',
	  templateUrl: '/login.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	  	$('#jt3').hide();
  		$('#home').hide();
  		$(window).scrollTop(0);
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	})

	.state('register', {
	  url: '/register',
	  templateUrl: '/register.html',
	  controller: 'AuthCtrl',
	  onEnter: ['$state', 'auth', function($state, auth){
	  	$('#jt3').hide();
  		$('#home').hide();
  		$(window).scrollTop(0);
	    if(auth.isLoggedIn()){
	      $state.go('home');
	    }
	  }]
	});


	$urlRouterProvider.otherwise('home');

}]);

//////////////////////////////////////////////////////////////////////////////////

app.factory('posts',  ['$http', 'auth', function($http, auth){
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
	  return $http.post('/posts', post, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    o.posts.push(data);
	  });
	};

	o.upvote = function(post) {
	  return $http.put('/posts/' + post._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    post.upvotes += 1;
	  });
	};

	o.addComment = function(id, comment) {
	  return $http.post('/posts/' + id + '/comments', comment, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  });
	};

	o.upvoteComment = function(post, comment) {
	  return $http.put('/posts/' + post._id + '/comments/'+ comment._id + '/upvote', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	    comment.upvotes += 1;
	  });
	};

	////////////////////////////////////////////////////prueba:

	o.deletePost = function(post) {

	  return $http.post('/posts/' + post._id + '/delete', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	  	
	  });
	};

	o.deleteComment = function(post, comment) {

	  return $http.post('/posts/' + post._id + '/comments/'+ comment._id + '/delete', null, {
	    headers: {Authorization: 'Bearer '+auth.getToken()}
	  }).success(function(data){
	  	
	  });
	};

	////////////////////////////////////////////////////prueba:

	
	return o;
}]);



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

	////////////////

	auth.register = function(user){
	  return $http.post('/auth/facebook', user).success(function(data){
	  	fillingForm = false;
	  });
	};

	return auth;
}])


//////////////////////////////////////////////////////////////////////////////////FACEBOOK


function ensureAuthenticated(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Please make sure your request has an Authorization header' });
  }
  var token = req.headers.authorization.split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  }
  catch (err) {
    return res.status(401).send({ message: err.message });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({ message: 'Token has expired' });
  }
  req.user = payload.sub;
  next();
}





