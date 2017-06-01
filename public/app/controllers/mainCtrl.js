angular.module('mainController', [])

.controller('mainCtrl', function(Auth, $timeout, $location, $rootScope, $window){
    var app = this;
        app.loading = false;
        app.isLoggedIn = false;
        app.loadme = false;

    $rootScope.$on('$routeChangeStart', function(){
        if(Auth.isLoggedIn()){
            app.isLoggedIn = true;
            // console.log('success: User is Logged in' );
            Auth.getUser().then(function(data){                
                // console.log(data);
                app.username = data.data.username;
                app.email = data.data.email;
                app.loadme = true;
            })
        }else{
            app.isLoggedIn = false;
            app.username = "";
            app.loadme = false;
            // console.log('failure: user is not logged in');
        }
        if($location.hash() == '_=_') $location.hash(null);
    });
    
    this.facebook = function(){
        $window.location = $window.location.protocol+'//'+$window.location.host+'/auth/facebook';
    }

    this.twitter = function(){
        $window.location = $window.location.protocol+'//'+$window.location.host+'/auth/twitter';
    }

    this.google = function(){
        $window.location = $window.location.protocol+'//'+$window.location.host+'/auth/google';
    }

    this.doLogin = function(loginData){
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;        
        Auth.login(app.loginData).then(function(data){
            app.loading = false;
            if(data.data.success){          
                app.successMsg = data.data.message + '....Redirecting to Dashboard';                
                $timeout(function(){
                    $location.path('/dashboard');
                    app.loginData = '';
                    app.successMsg = false;
                }, 2000);
            }else{              
                app.errorMsg = data.data.message;
            }
        })
    };


    this.logout = function(){        
        Auth.logout();
        $location.path('/logout');
        $timeout(function(){
            $location.path('/');
        }, 2000);
        app.isLoggedIn = false;
    }
})