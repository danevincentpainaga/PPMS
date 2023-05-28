'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:renewScholarsCtrl
 * @description
 * # renewScholarsCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp').controller('renewScholarsCtrl',
    [
        '$scope',
        'debounce',
        '$mdSidenav',
        'scholarApiService',
        'academicContractDetails',
        'printContract',
        'swalert',
    function (
        $scope,
        debounce,
        $mdSidenav,
        scholarApiService,
        academicContractDetails,
        printContract,
        swalert) {

    var rc = this;
    rc.type = ['Name', 'Student ID'];
    rc.tabStatus = 'Pending';

    rc.onSelectStatus = function(status){
        rc.scholars = [];
        rc.tabStatus = status;
        rc.loaded = false;
        // reset();
    }

    rc.renew = function(scholarDetails){
        if(scholarDetails.contract_status !== 'In-Active' && scholarDetails.contract_status !== 'Pending') return;
        if(scholarDetails.contract_status === 'In-Active'){
            showSupervisorsApproval(scholarDetails, 'Renew scholar?', renewOrRevert({ scholar_id: scholarDetails.scholar_id }, scholarDetails).renewScholar);
        }
        else{
            swalert.renewConfirmation(renewOrRevert({ scholar_id: scholarDetails.scholar_id }, scholarDetails).renewScholar, 'Renew scholar?');
        }
    }

    rc.revert = function(scholarDetails){
        if(scholarDetails.contract_status === 'Pre-Approved'){
            showSupervisorsApproval(scholarDetails, 'Revert scholar?', renewOrRevert({ scholar_id: scholarDetails.scholar_id, isActive: scholarDetails.isActive }, scholarDetails).revertScholar);
        }
    }

    rc.onSubmit = function(){
        if(!rc.searchType || !rc.scholar_name || !rc.degree || rc.searching) return;
        rc.loaded = false;
        rc.searching = true;
        rc.scholars = [];
        scholarApiService.getNotRenewedScholar({ searched_name: rc.scholar_name, degree: rc.degree, type: rc.searchType, contract_status: rc.tabStatus }).then(response => {
            console.log(response);
            rc.scholars = response.data.data;
            rc.searching = false;
            rc.loaded = true;
        }, err => {
            rc.scholars = [];
            rc.searching = false;
            rc.loaded = true;
            console.log(err);
            swalert.dialogBox(err.data.message, 'error', 'Failed');
        });
    }

    rc.edit = function(scholarDetails){
        rc.scholar_to_edit = scholarDetails;
        $mdSidenav('editScholar').toggle();
    }

    rc.print = function(scholarDetails, idx){
        rc.selectedIndex = idx;
        printContract.print(scholarDetails, rc, academicContractDetails.governor);
    }

    async function showSupervisorsApproval(scholarDetails, message, method){
        const result = await swalert.supervisorsApproval();
        if (result.isConfirmed) {
            swalert.renewConfirmation(method, message);
        }
    }

    function renewOrRevert(details, scholarDetails){
        return {
            renewScholar: function(){
                rc.show_spinner = true;
                scholarApiService.renewScholar(details).then(response => {
                    printContract.print(scholarDetails, rc, academicContractDetails.governor);
                    rc.show_spinner = false;
                    swalert.dialogBox(response.data.message, 'success', 'Success');
                    rc.scholars.splice(rc.scholars.indexOf(scholarDetails), 1);
                    reset();
                    console.log(response);
                }, err => {
                    console.log(err);
                    rc.show_spinner = false;
                    swalert.dialogBox(err.data.message, 'error', 'Failed');
                });
            },
            revertScholar: function(){
                rc.show_spinner = true;
                scholarApiService.revertScholar(details).then(response => {
                    rc.show_spinner = false;
                    reset();
                    rc.scholars.splice(rc.scholars.indexOf(scholarDetails), 1);
                    swalert.dialogBox(response.data.message, 'success', 'Success');
                    console.log(response);
                }, err => {
                    console.log(err);
                    rc.show_spinner = false;
                    swalert.dialogBox(err.data.message, 'error', 'Failed');
                });
            }
        }
    }

    function reset(){
        rc.searchType = '';
        rc.degree = '';
        rc.scholar_name = '';
        rc.renewForm.$setPristine();
        rc.renewForm.$setUntouched();
    }

    function hasSemester(){
        rc.semester = academicContractDetails.academic_year_semester.semester;
        rc.academic_year = academicContractDetails.academic_year_semester.academic_year;
    }
  
    hasSemester();

}]);