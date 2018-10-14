var app = angular.module('app');
app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'views/index.html'
        })

        .state('register', {
            url: '/register.html',
            templateUrl: 'views/register.html'
        })

        .state('login', {
            url: '/login.html',
            templateUrl: 'views/login.html'
        })

        .state('shop', {
            url: '/shop.html',
            templateUrl: 'views/shop.html'
        })

        .state('merchant', {
            url: '/merchant.html',
            templateUrl: 'views/merchant.html'
        });

});