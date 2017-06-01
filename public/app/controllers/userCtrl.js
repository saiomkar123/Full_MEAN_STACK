angular.module('userControllers', ['userServices'])

.controller('regCtrl', function($http, $location, $timeout, User){
    // console.log('Testing the regCtrl function');
    var app = this;
    this.regUser = function(regData, valid){
        app.loading = true;
        app.errorMsg = false;
        app.successMsg = false;
        if(valid){
            User.create(app.regData)
            .then(function(data){
                app.loading = false;              
                if(data.data.success){
                    // create success message
                    // Redirect to home page
                    app.successMsg = data.data.message + "Redirect to Login......";
                    $timeout(function(){
                        $location.path('/login');
                    }, 2000);                    
                }else{
                    //  Create error message
                    app.errorMsg = data.data.message;
                }
            })
        }else{
            app.loading = false;
            app.errorMsg = 'Please ensure that form is properly filled.';
        }
    };

    this.checkUsername = function(regData){
        app.checkingUsername = true;
        app.usernameMsg = false;
        app.usernameInvalid = false;

        User.checkUsername(app.regData).then(function(data){
            // console.log(data);
            if(data.data.success){
                app.checkingUsername = false;
                app.usernameInvalid = false;
                app.usernameMsg = data.data.message; 
            }else{
                app.checkingUsername = false;
                app.usernameInvalid = true;
                app.usernameMsg = data.data.message;
            }
        })
    }
    this.checkEmail = function(regData){
        app.checkingEmail = true;
        app.emailMsg = false;
        app.emailInvalid = false;
        User.checkEmail(app.regData).then(function(data){
            // console.log(data);
            if(data.data.success){
                app.checkingEmail = false;
                app.emailInvalid = false;
                app.emailMsg = data.data.message;
            }else{
                app.checkingEmail = false;
                app.emailInvalid = true;
                app.emailMsg = data.data.message;
            }
        })
    }    
})
.directive('match', function(){
    return {
        restrict: 'A',
        controller: function($scope){
            $scope.confirmed = false;
            $scope.doConfirm = function(values){
                // console.log(values);
                // console.log($scope.confirm);
                values.forEach(function(ele){
                    // console.log(ele);
                    // console.log($scope);
                    if($scope.confirm == ele){
                        $scope.confirmed = true;
                        // console.log('confirmed true');
                    }else{
                        $scope.confirmed = false;
                    }
                })
            }
        },
        link: function(scope, element, attrs){
            attrs.$observe('match', function(){
                scope.matches = JSON.parse(attrs.match);
                scope.doConfirm(scope.matches);
            });
            scope.$watch('confirm', function(){
                scope.doConfirm(scope.matches);
            })
        }
    }
})

.controller('facebookCtrl', function($routeParams, Auth, $location, $window){
    var app = this;
    if($window.location.pathname == '/facebookerror'){
        app.errorMsg = "Facebook email not found in database";
    }else{
        Auth.facebook($routeParams.token);
        $location.path('/');
    }    
})

.controller('twitterCtrl', function($routeParams, Auth, $location, $window){
    var app = this;
    if($window.location.pathname == '/twittererror'){
        app.errorMsg = "Twitter email not found in database";
    }else{
        Auth.twitter($routeParams.token);
        $location.path('/');
    }    
})

.controller('googleCtrl', function($routeParams, Auth, $location, $window){
    var app = this;
    if($window.location.pathname == '/googleerror'){
        app.errorMsg = "Google email not found in database";
    }else{
        Auth.twitter($routeParams.token);
        $location.path('/');
    }    
})