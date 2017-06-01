var app = angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider){
   $routeProvider
   .when('/',{
       templateUrl: '/app/views/pages/home.html'
   })
   .when('/about', {
       templateUrl: '/app/views/pages/about.html'
   })
   .when('/contact', {
       templateUrl: '/app/views/pages/contact.html'
   })
   .when('/register', {
       templateUrl: '/app/views/pages/register.html',
       controller: 'regCtrl',
       controllerAs: 'register',
       authenticated: false
   })
   .when('/login', {
       templateUrl: '/app/views/pages/login.html',
       authenticated: false
   })
   .when('/logout', {
       templateUrl: '/app/views/pages/logout.html',
       authenticated: true
   })
   .when('/dashboard', {
       templateUrl: '/app/views/pages/users/dashboard.html',
       authenticated: true
   })
   .when('/profile', {
       templateUrl: '/app/views/pages/users/profile.html',
       authenticated: true
   })
   .when('/management', {
       templateUrl: '/app/views/pages/management/management.html',
       controller: 'managementCtrl',
       controllerAs: 'management',
       authenticated: true
   })
   .when('/facebook/:token', {
       templateUrl: '/app/views/pages/users/social/social.html',
       controller: 'facebookCtrl',
       controllerAs: 'facebook',
       authenticated: false
   })
   .when('/twitter/:token', {
       templateUrl: '/app/views/pages/users/social/social.html',
       controller: 'twitterCtrl',
       controllerAs: 'twitter',
       authenticated: false
   })
   .when('/google/:token', {
       templateUrl: '/app/views/pages/users/social/social.html',
       controller: 'googleCtrl',
       controllerAs: 'google',
       authenticated: false
   })
   .when('/facebookerror', {
       templateUrl: '/app/views/pages/login.html',
       controller: 'facebookCtrl',
       controllerAs: 'facebook',
       authenticated: false
   })
   .when('/twittererror', {
       templateUrl: '/app/views/pages/login.html',
       controller: 'twitterCtrl',
       controllerAs: 'twitter',
       authenticated: false
   })
   .when('/googleerror', {
       templateUrl: '/app/views/pages/login.html',
       controller: 'googleCtrl',
       controllerAs: 'google',
       authenticated: false
   })
   .otherwise({
       redirectTo: '/'
   });

   $locationProvider.html5Mode({
       enabled: true,
       requiredBase: false
   });
})

app.run(['$rootScope', 'Auth', '$location', function($rootScope, Auth, $location){
    $rootScope.$on('$routeChangeStart', function(event, next, current){
        if(next.$$route.authenticated == true){
            if(!Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/')
            }
        }else if(next.$$route.authenticated == false){
            if(Auth.isLoggedIn()){
                event.preventDefault();
                $location.path('/dashboard');
            }
        }
    })
}]);