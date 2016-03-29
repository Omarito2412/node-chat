
var app = angular.module('app', []);
app.controller('groupCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.username = ""
    grabUsername = function(){
        $http.get('/config').success(function(data){
            $scope.username = data.username;
        });
    };
    grabUsername();
    var socket = io();
    $scope.message = "";
    $scope.texts = [];
    socket.on('chat-message', function(message){
        $scope.texts.push(message);
        $scope.$apply();
    });
    $scope.chatMessage = function(){
        socket.emit('chat-message', {
            username: $scope.username,
            message: $scope.message});
        $scope.message = '';
        return false;
    };
}]);
app.controller('usernameCtrl', ['$scope', function ($scope) {
    $scope.username = "";
}]);