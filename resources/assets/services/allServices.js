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
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateVenue: function(updatedVenueDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateVenue',
        data: updatedVenueDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getReservations: function(reserveDate){
      return $http({
        method:'GET',
        url: baseUrl+'api/getReservations/'+reserveDate,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    approvedReservations: function(approvedDate){
      return $http({
        method:'GET',
        url: baseUrl+'api/approvedReservations/'+approvedDate,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    approvedReservationsDetails: function(approvedDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/approvedReservationsDetails',
        data: approvedDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    addReservation: function(reservationDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/addReservation',
        data: reservationDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateReservation: function(updatedDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateReservation',
        data: updatedDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
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
    },
    deleteVenue: function(venueId){
      var config = {
          headers:  {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          },
          params : { 
              venue : venueId 
          }
      };
      return $http.delete(baseUrl + 'api/deleteVenue', config); 
    },
    getDepartments: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getDepartments',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getUserTypes: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getUserTypes',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    addUser: function(userDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/addUser',
        data: userDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getUsers: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getUsers',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    deleteUsers: function(userId){
      var config = {
          headers:  {
            "Content-Type": "application/json",
            "Accept": "application/json",
            Authorization : 'Bearer '+ $rootScope.token
          },
          params : { 
              user_id : userId 
          }
      };
      return $http.delete(baseUrl + 'api/deleteUsers', config); 
    },
  }
}]);