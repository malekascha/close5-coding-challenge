angular
  .module('Close5', [
    'ui.bootstrap',
    'ui.bootstrap.tabs',
    'ui.bootstrap.buttons'
  ])
  .controller('MainController',  ['$scope',  '$http', 'Fetch', function ($scope, $http, Fetch) {
    $scope.allPosts = {
      compare: 'createdAt',
      order: 'ascending'
    };

    $scope.posts = [];

    $scope.user = {
      id: ''
    };

    $scope.singlePost = {
      id: ''
    };

    $scope.loc = {
      lat: 0,
      lon: 0,
      dist: 50
    };

    $scope.retrieveAll = function(){
      Fetch.retrieveAll($scope);
    };

    $scope.retrieveUser = function(){
      Fetch.retrieveUser($scope);
    };

    $scope.retrieveSinglePost = function(){
      Fetch.retrievePost($scope);
    };

    $scope.retrieveByLoc = function(){
      Fetch.retrieveByLoc($scope);
    };
  }])
  .factory('Fetch', ['$http', function ($http) {

    var queryAPI = function(url, data, scope) {
      $http({
        method: 'POST',
        url: url,
        data: data
      })
      .then(function(res){
        scope.posts = res.data;
      }, function(err){
        console.log(err);
      });
    };

    var retrieveAll = function(scope){
      queryAPI('/all', scope.allPosts, scope);
    };
    
    var retrieveUser = function(scope){
      queryAPI('/user', scope.user, scope);
    };

    var retrievePost = function(scope){
      queryAPI('/single', scope.singlePost, scope);
    };
    
    var retrieveByLoc = function(scope){
      queryAPI('/loc', scope.loc, scope);
    };

    return {
      retrieveAll: retrieveAll,
      retrieveUser: retrieveUser,
      retrievePost: retrievePost,
      retrieveByLoc: retrieveByLoc
    };

  }]);
