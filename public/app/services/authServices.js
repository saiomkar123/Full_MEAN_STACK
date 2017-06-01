angular.module('authServices', [])

.factory('Auth', function($http, AuthToken){
    authFactory = {};
        authFactory.login = function(loginData){
            return $http.post('/api/authenticate', loginData)
            .then(function(data){
                // console.log(data.data.token);
                AuthToken.setToken(data.data.token);
                return data;
            });
        }
        // Auth.isLoggedIn();
        authFactory.isLoggedIn = function(){
            if(AuthToken.getToken()){
                // console.log(AuthToken.getToken());
                return true;
            }else{
                return false;
            }
        }
        // Facebook
        // Auth.facebook(token)
        authFactory.facebook = function(token){
            AuthToken.setToken(token);
        }
        // twitter
        // Auth.twitter(token)
        authFactory.twitter = function(token){
            AuthToken.setToken(token);
        }
        // Auth.getUser();
        authFactory.getUser = function(){
            if(AuthToken.getToken()){
                return $http.post('/api/me');
            }else{
                $q.reject({message: 'User has no token'});
            }
        }

        // Auth.logout();
        authFactory.logout = function(){
            AuthToken.setToken();
        }
    return authFactory;
})

.factory('AuthToken', function($window){
    var authTokenFactory = {};

    // AuthToken.setToken(token);

    authTokenFactory.setToken = function(token){
        if(token){
            $window.localStorage.setItem('token', token);
        }else{
            $window.localStorage.removeItem('token');
        }
    };
    // AuthToken.getToken();
    authTokenFactory.getToken = function(){
        return $window.localStorage.getItem('token');
    };

    return authTokenFactory;
})

.factory('AuthInterceptors', function(AuthToken){
    var authInterceptorsFactory = {};

    authInterceptorsFactory.request = function(config){
        var token = AuthToken.getToken();
        if(token){
            config.headers['x-access-token'] = token;
        }
        return config;
    }

    return authInterceptorsFactory;
})