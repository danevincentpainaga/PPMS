import { baseUrl } from '../apiServices/baseUrl';

angular.module('psmsApp')
  .factory('academicSemesterYearApiService', ['$http', '$rootScope', function($http, $rootScope){

  return{
   getAcademicYearList: function(){
      return $http({
        method:'GET',
        url: baseUrl+'api/academic/getAcademicYearList',
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    storeAcademicYearSem: function(payload){
      return $http({
        method:'POST',
        url: baseUrl+'api/academic/storeAcademicYearSem',
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateAcademicYearSem: function(payload){
      return $http({
        method:'POST',
        url: baseUrl+'api/academic/updateAcademicYearSem',
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    },
    updateAcademicYearSemAmounts: function(payload){
      return $http({
        method:'POST',
        url: baseUrl+'api/academic/updateAcademicYearSemAmounts',
        data: payload,
        headers: {
          "Content-Type": "application/json",
          Authorization : 'Bearer '+ $rootScope.token
        }
      });
    }

	}
}]);