app.factory('apiService', ['$http', '$cookies', '$rootScope', function($http, $cookies, $rootScope){
  return{
    validateLogin: function(credData){
      return $http({
        method:'POST',
        url: baseUrl+'api/login',
        data: credData,
        headers: {
          Accept: "application/json",   
        }
      });
    },
    AuthenticatedUser: function(){
      var status = $cookies.get('auth');
        if(status){
          return true;
        }else{
          return false;
        }
    },
    addVenue: function(venueDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/addVenue',
        data: venueDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $cookies.getObject('auth').success.token
        }

      });
    },
    getVenues: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getVenues',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    }
  }
}]);

