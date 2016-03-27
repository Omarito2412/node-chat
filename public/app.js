
var app = angular.module('app', []);
app.controller('groupCtrl', ['$scope', function ($scope) {
    var socket = io();
    $scope.message = "";
    $scope.texts = [];
    socket.on('chat-message', function(message){
        $scope.texts.push(message);
        $scope.$apply();
    })
    $scope.chatMessage = function(){
        socket.emit('chat-message', $scope.message);
        $scope.message = '';
        return false;
    };
}]);
app.controller('usernameCtrl', ['$scope', function ($scope) {
    $scope.username = "";
    $scope.Join = function(){
        window.location.href = "/main";
    };
}]);