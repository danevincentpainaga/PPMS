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
    getReservations: function(reserveDate, departmentId, venueId){
      return $http({
        method:'GET',
        url: baseUrl+'api/getReservations/'+reserveDate+'/'+departmentId+'/'+venueId,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
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
    removeReservation: function(reservationObj){
      return $http({
        method:'POST',
        url: baseUrl+'api/removeReservation',
        data: reservationObj,
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
        cache: false,
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
    validateEmail: function(email){
      return $http({
        method:'GET',
        url: baseUrl+'api/validateEmail/'+email,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    validateVenue: function(venueName){
      return $http({
        method:'GET',
        url: baseUrl+'api/validateVenue/'+venueName,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    validateDepartment: function(deptname){
      return $http({
        method:'GET',
        url: baseUrl+'api/validateDepartment/'+deptname,
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getDepartments: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getDepartments',
        cache: false,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getUserTypes: function(id){
      return $http({
        method:'GET',
        url: baseUrl+'api/getUserTypes/'+id,
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
    updateUser: function(userDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateUser',
        data: userDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updatedPassword: function(credentials){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateUserPassword',
        data: credentials,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    resetPassword: function(credentials){
      return $http({
        method:'POST',
        url: baseUrl+'api/resetUserPassword',
        data: credentials,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    countUsers: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/countUsers',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
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
    getProfile: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getProfile',
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
    updateDepartment: function(updatedDepartment){
      return $http({
        method:'POST',
        url: baseUrl+'api/updateDepartment',
        data: updatedDepartment,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    addDepartment: function(departmentName){
      return $http({
        method:'POST',
        url: baseUrl+'api/addDepartment',
        data: departmentName,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    removeDepartment: function(departmentObj){
      return $http({
        method:'POST',
        url: baseUrl+'api/removeDepartment',
        data: departmentObj,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    addStock: function(stock){
      return $http({
        method:'POST',
        url: baseUrl+'api/addStock',
        data: stock,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    addStockQty: function(itemDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/addStockQty',
        data: itemDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    deductStockQty: function(itemDetails){
      return $http({
        method:'POST',
        url: baseUrl+'api/deductStockQty',
        data: itemDetails,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getItems: function(id){
      return $http({
        method:'GET',
        url: baseUrl+'api/getItems/'+id,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getAllStocks: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/getAllStocks',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    countItems: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/countItems',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    saveRequestedItems: function(requestDetails){
      return $http({
        method:'POST',
        url:baseUrl+'api/saveRequestedItems',
        data: requestDetails,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    updateRequestedItems: function(requestDetails){
      return $http({
        method:'POST',
        url:baseUrl+'api/updateRequestedItems',
        data: requestDetails,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    addItemsToWork: function(addedItems){
      return $http({
        method:'POST',
        url:baseUrl+'api/addItemsToWork',
        data: addedItems,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    removeItemsFromWork: function(itemDetails){
      return $http({
        method:'POST',
        url:baseUrl+'api/removeItemsFromWork',
        data: itemDetails,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    getRequestedItems: function(rid){
      return $http({
        method:'GET',
        url: baseUrl+'api/getRequestedItems/'+rid,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    saveRequestedWork: function(requestDetails){
      return $http({
        method:'POST',
        url:baseUrl+'api/saveRequestedWork',
        data: requestDetails,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    updateRequestedWork: function(requestDetails){
      return $http({
        method:'POST',
        url:baseUrl+'api/updateRequestedWork',
        data: requestDetails,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    // getStocksPerDate: function(date){
    //   return $http({
    //     method:'GET',
    //     url: baseUrl+'api/getStocksPerDate/'+date,
    //     headers: {
    //       "Content-Type": "application/json",
    //       "Accept": "application/json",
    //       Authorization : 'Bearer '+ $rootScope.token
    //     }
    //   });
    // },
    getStocksPerDate: function(filteredDate){
      return $http({
        method:'POST',
        url:baseUrl+'api/getStocksPerDate',
        data: filteredDate,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });    
    }, 
    getRequestedItemsPerDate: function(date){
      return $http({
        method:'GET',
        url: baseUrl+'api/getRequestedItemsPerDate/'+date,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getRequestedWorksPerDate: function(date){
      return $http({
        method:'GET',
        url: baseUrl+'api/getRequestedWorksPerDate/'+date,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    getAllWorkRequest: function(wid){
      return $http({
        method:'GET',
        url: baseUrl+'api/getAllWorkRequest/'+wid,
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateStocks: function(stock){
      return $http({
        method:'POST',
        url:baseUrl+'api/updateStocks',
        data: stock,
        headers:{
          "Content-Type": "application/json",
          Authorization: 'Bearer '+ $rootScope.token
        }
      });
    },
    currentRequestNumber: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/currentRequestNumber',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
  }  
}]);