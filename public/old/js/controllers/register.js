var app = angular.module('app');

app.controller("registerCtrl", registerCtrl);

function registerCtrl($scope, $http, $timeout) {
    $scope.gen = {};

    function handleFail(err) {
        console.err(JSON.stringify(err));
    }
    $scope.createWallet = function() {
        console.log("clicked");
        $http.get("/walletGen").then(function(res) {
            $timeout(() => {
                $scope.gen = {
                    address: res.data.Account.address,
                    publicKey: res.data.Account.publicKey,
                    privateKey: res.data.Account.privateKey
                };
                console.log($scope.gen);
            });

        }, handleFail);
    };
}