'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:contractCtrl
 * @description
 * # contractCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
  .controller('contractCtrl',[
    '$scope',
    'academicSemesterYearApiService',
    'academicContractService',
    'swalert',
    '$mdSidenav',
    '$mdDialog',
    function (
      $scope,
      academicSemesterYearApiService,
      academicContractService,
      swalert,
      $mdSidenav,
      $mdDialog,) {

    var c = this;
    c.isSaveMode = true;
    c.labelText = "Add";
    c.semester_list = [{semester: "1st Semester"}, {semester: "2nd Semester"}, {semester: "3rd Semester"}];

    $scope.$watch('c.academic_year_from', function(n, o){
      if (n && n.length === 4) {
        let fromDate = new Date(n).getFullYear();
        let yearNow = new Date().getFullYear();
        if (fromDate > yearNow || fromDate < yearNow-1) {
          c.invalid_year = true;
        }
        else{
          c.invalid_year = false;
          c.academic_year_to = fromDate+1;
          c.display_academic_year = fromDate+1;
        }
      }
      else{
        c.invalid_year = true;
        c.display_academic_year = "";
        c.academic_year_to = "";
      }
    });

    c.saveAcademicYearSem = function(){
      openModal(c.functions.storeAcademicYearSem);
    }

    c.updateAcademicYearSem = function(){
      openModal(c.functions.updateAcademicYearSem);
    }    

    c.updateAcademicYearSemAmounts = function(){
      openModal(c.functions.updateAcademicYearSemAmounts);
    }

    function openModal(method) {
      if (c.semester && c.academic_year_from && c.academic_year_to && c.undergraduate_amount && c.masteral_doctorate_amount){
        $mdDialog.show({
          contentElement: '#confirmPasswordDialog',
          parent: angular.element(document.body)
        });
        c.func = method;
      }
    }

    c.edit = function(selected){
      let ay = selected.academic_year.split('-');
      c.asc_id = selected.asc_id;
      c.semester = selected.semester;
      c.academic_year_from = ay[0];
      c.academic_year_to = ay[1];
      c.undergraduate_amount = selected.undergraduate_amount;
      c.masteral_doctorate_amount = selected.masteral_doctorate_amount;
      c.isSaveMode = false;
      c.labelText = "Update";
      $mdSidenav('addUpdateContract').toggle();
    }

    c.add = function(){
      clearInputs();
      c.isSaveMode = true;
      c.labelText = "Add";
      $mdSidenav('addUpdateContract').toggle();
    }

    c.setContract = function(selected){
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.ascId = selected.asc_id;
      c.func = c.functions.setContract;
    }

    c.closeContract = function(){
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.func = c.functions.closeContract;
    }

    c.openContract = function(){
      $mdDialog.show({
        contentElement: '#confirmPasswordDialog',
        parent: angular.element(document.body)
      });
      c.func = c.functions.openContract;
    }

    c.close = function(){
      $mdSidenav('addUpdateContract').toggle();
      c.add_update_contract.$setPristine();
      c.add_update_contract.$setUntouched();
      clearInputs();
    }

    c.confirm = function(){
      console.log(c.password);
    }

    function getAcademicYearList(){
       academicSemesterYearApiService.getAcademicYearList().then(response => {
        c.disable_linear_loader = true;
        console.log(response.data);
        c.school_list_loaded = true;
        c.academic_year_sem = response.data;
      }, err => {
        c.disable_linear_loader = true;
        console.log(err);
      });
    }

    function getAcademicContractDetails(){
       academicContractService.getAcademicContractDetails().then(response => {
          checkContractState(response.data[0].contract_state);
          c.contract_details = response.data;
          c.contract_status = c.contract_details[0].contract_state;
          c.contract_loaded = true;
          c.not_in_progress = true;
          console.log(c.contract_details);
      }, err => {
        console.log(err);
        c.not_in_progress = true;
      });
    }

    c.functions = {
      storeAcademicYearSem: function(){
        academicSemesterYearApiService.storeAcademicYearSem({
            semester: c.semester,
            academic_year: c.academic_year_from+'-'+c.academic_year_to,
            undergraduate_amount: c.undergraduate_amount,
            masteral_doctorate_amount: c.masteral_doctorate_amount
          })
          .then(response => {
            clearInputs();
            console.log(response.data);
            clearRequired();
            getAcademicYearList();
            swalert.dialogBox(response.data.message, 'success', 'Success');
          }, err => {
            console.log(err);
            swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
      },
      updateAcademicYearSem: function(){
         academicSemesterYearApiService.updateAcademicYearSem({ 
            asc_id: c.asc_id,
            semester: c.semester,
            academic_year: c.academic_year_from+'-'+c.academic_year_to
         })
         .then(response => {
            console.log(response.data);
            getAcademicYearList();
            swalert.dialogBox(response.data.message, 'success', 'Success');
        }, err => {
          console.log(err);
          swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
      },
      updateAcademicYearSemAmounts: function(){
        academicSemesterYearApiService.updateAcademicYearSemAmounts({ 
           asc_id: c.asc_id,
           undergraduate_amount: c.undergraduate_amount,
           masteral_doctorate_amount: c.masteral_doctorate_amount
        })
        .then(response => {
           console.log(response.data);
           getAcademicYearList();
           swalert.dialogBox(response.data.message, 'success', 'Success');
       }, err => {
         console.log(err);
         swalert.dialogBox(err.data.message, 'error', 'Failed');
       });
     },
      closeContract: function(){
         academicContractService.closeContract().then(response => {
          c.showOpenContractBtn = true;
          getAcademicYearList();
          swalert.dialogBox(response.data.message, 'success', 'Success');
        }, err => {
          swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
      },
      setContract: function(){
        academicContractService.setContract({ascId: c.ascId}).then(response => {
          console.log(response.data);
          c.showOpenContractBtn = false;
          getAcademicContractDetails();
          getAcademicYearList();
          swalert.dialogBox(response.data.message, 'success', 'Success');
        }, err => {
          console.log(err);
          swalert.dialogBox(err.data.message, 'error', 'Failed');
        });     
      },
      openContract: function(){
        academicContractService.openContract().then(response => {
          c.showOpenContractBtn = false;
          getAcademicYearList();
          swalert.toastInfo(response.data.message, 'success', 'top', 4000);
        }, err => {
          swalert.toastInfo(err.data.message, 'error', 'top');
        });
      }
    }

    function clearInputs(){
      c.asc_id = "";
      c.semester = "";
      c.academic_year_from ="";
      c.academic_year_to ="";
      c.undergraduate_amount = "";
      c.masteral_doctorate_amount = "";
    }

    function checkContractState(contract_state){
      c.showOpenContractBtn = contract_state == 'Open'? false : true;
    }

    function clearRequired(){
      c.add_update_contract.$setPristine();
      c.add_update_contract.$setUntouched();
    }
    
    getAcademicYearList();
    getAcademicContractDetails();

}]);