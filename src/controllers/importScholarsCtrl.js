'use strict';

const { result } = require("lodash");

/**
 * @ngdoc function
 * @name psmsApp.controller:importScholarsCtrl
 * @description
 * # importScholarsCtrl
 * Controller of the psmsApp
 */ 

var app = angular.module('psmsApp');
  app.controller('importScholarsCtrl',
    [
      '$scope',
      '$q',
      '$mdSidenav',
      'importScholarApiService',
      'municipalitiesApiService',
      'schoolApiService',
      'academicContractService',
      'addScholarsService',
      'moment',
      '$timeout',
      'swalert',
      'uiGridConstants',
    function (
      $scope,
      $q,
      $mdSidenav,
      importScholarApiService,
      municipalitiesApiService,
      schoolApiService,
      academicContractService,
      addScholarsService,
      moment,
      $timeout,
      swalert,
      uiGridConstants
    ) {

  var ic = this;
  ic.checking_in = 'Checking:';
  var year_level = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  var scholar_status = ['NEW', 'OLD'];
  var ip = ['YES', 'NO'];
  var gender = ['Male', 'Female'];
  var page = 0;
  var scholar_count = 0;
  ic.total_errors = 0;

  $scope.$watchGroup(['ic.degree', 'ic.municipality'], function(n, o){
    ic.selection_complete = n.indexOf(undefined) === -1 ? true : false;
  });

  $scope.$watch('ic.isOpen', function(isOpen) {
    if (isOpen) {
      $timeout(function() { ic.tooltipVisible = ic.isOpen; }, 300);
    } else {
      ic.tooltipVisible = ic.isOpen;
    }
  });

  // ic.myData = [];
  // ic.scholars_to_upload = [];
  ic.progress_value = 0;
  ic.importBtn = 'Import to database';

  ic.gridOptions = {
    enableFiltering: false,
    enableColumnResizing: true,
    enableGridMenu: true,
    data: [],
    importerDataAddCallback: function ( grid, newObjects ) {

      // ic.myData = ic.myData.concat( newObjects );
      // ic.gridOptions.data = ic.myData;
      // console.log(newObjects);
    },
    columnDefs: [
      { displayName: 'NO.', field: 'index', width: '50', enableFiltering: false, enableSorting: false, cellClass: 'row-no',  cellTemplate: '<div class="ui-grid-cell-contents">{{grid.renderContainers.body.visibleRowCache.indexOf(row)+1}}</div>' },
      { displayName: 'Error', field: 'error', width: '15%', enableFiltering: false,
        cellClass: function(grid, row, col) {
          let error = grid.getCellValue(row,col);
          if (error && error.length > 0) {
            return 'error';
          }
        }
      },
      { field: 'lastname', displayName: 'Lastname',width: '15%'},
      { field: 'firstname', displayName: 'Firstname', width: '15%' },
      { field: 'middlename', displayName: 'Middlename', width: '15%' },
      { field: 'date_of_birth', displayName: 'Date of Birth', width: '10%' },
      { field: 'age', displayName: 'Age', width: '5%' },
      { field: 'gender', displayName: 'Gender', width: '10%' },
      { field:'address', displayName: 'Address', width: '20%'},
      { field:'father_lastname', displayName: 'Father_lastname', width: '15%' },
      { field:'father_firstname', displayName: 'Father_firstname', width: '15%' },
      { field:'father_middlename', displayName: 'Father_middlename', width: '15%' },
      { field:'mother_maiden_name', displayName: 'Mother_maiden_name', width: '15%' },
      { field:'mother_firstname', displayName: 'Mother_firstname', width: '15%' },
      { field:'mother_middlename', displayName: 'Mother_middlename', width: '15%' },
      { field:'school', displayName: 'School', width: '20%' },
      { field:'degree', displayName: 'Degree', width: '10%' },
      { field:'civil_status', displayName: 'Civil Status', width: '10%' },
      { field:'student_id_number', displayName: 'Student ID NO', width: '10%' },
      { field:'course', displayName: 'Course', width: '25%' },
      { field:'section', displayName: 'Section', width: '10%' },
      { field:'year_level', displayName: 'Year Level', width: '10%' },
      { field:'semester', displayName: 'Semester', width: '10%' },
      { field:'academic_year', displayName: 'Academic_year', width: '10%' },
      { field:'scholar_status', displayName: 'Status', width: '10%' },
      { field:'contract_status', displayName: 'Contract Status', width: '10%' },
      { field:'IP', displayName: 'IP', width: '7%' },
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterPdfOrientation: 'landscape',
    exporterPdfPageSize: 'LEGAL',
    exporterPdfDefaultStyle: {fontSize: 7},
    exporterPdfTableStyle: {margin: [-30, -30, 0, 0], fontSize: 7 },
    exporterPdfMaxGridWidth: 765,
    exporterPdfTableHeaderStyle: {fontSize: 7, bold: true, italics: true, color: 'red'},
    exporterCsvFilename: 'Scholars list.csv',
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    exporterExcelFilename: 'Scholars list.xlsx',
    exporterExcelSheetName: 'Scholars',
    onRegisterApi: function(gridApi){
      ic.gridApi = gridApi;
      ic.gridApi.pinning.on.columnPinned($scope, function (colDef, container) {
        if (!container) {
          colDef.visible = false;
          ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          $timeout(function () {
            colDef.visible = true;
            ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
          });
        }
      });
    }
  };

  ic.toggleFiltering = function(){
    ic.gridOptions.enableFiltering = !ic.gridOptions.enableFiltering;
    ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
  };

  ic.add = function(){
    $mdSidenav('importScholars').toggle();
  }

  ic.close = function(){
    $mdSidenav('importScholars').toggle();
  }

  ic.cancel = function(){
    // ic.scholars_to_upload = [];
    ic.check_finished = false;
    ic.gridOptions.data = [];
    ic.imported_scholars = [];
    ic.progress_value = 0;
    ic.total_errors = 0;
    ic.isChecking = false;
    ic.degree = undefined;
    ic.municipality = undefined;
    ic.importBtn = 'Import to database';
  }

  ic.importToDatabase = function(){
    if (ic.total_errors > 0) {
      // swalert.dialogBox('Imported data has '+ ic.total_errors +' Errors', 'error', 'Cannot import');
      return;
    }

    ic.imported_scholars = ic.imported_scholars.map(value => ({
      student_id_number: upperCase(value.student_id_number),
      lastname: value.lastname.toUpperCase(),
      firstname: value.firstname.toUpperCase(),
      middlename: upperCase(value.middlename || null),
      addressId: value.addressId,
      date_of_birth: value.date_of_birth,
      age: addScholarsService.calcAge(value.date_of_birth),
      gender: value.gender,
      schoolId: value.schoolId,
      courseId: value.courseId,
      section: value.section.toUpperCase(),
      year_level: value.year_level,
      IP: value.IP,
      middlename: value.middlename || null,
      age: addScholarsService.calcAge(value.date_of_birth),
      father_details: {
        firstname: upperCase(value.father_firstname || ""),
        lastname: upperCase(value.father_lastname || ""),
        middlename: upperCase(value.father_middlename || null),
      },
      mother_details: { 
        firstname: upperCase(value.mother_firstname), 
        maiden_name: upperCase(value.mother_maiden_name), 
        middlename: upperCase(value.mother_middlename || null), 
      },
      degree: value.degree,
      scholar_status: value.scholar_status,
      contract_status: value.contract_status,
      contract_id: value.contract_id,
      civil_status: value.civil_status.toUpperCase()
    }));

    console.log(ic.imported_scholars);
    
    let imported_data = {
      scholars: ic.imported_scholars,
      error: ic.total_errors
    };
    
    swalert.confirm(imported_data, importScholarsData, 'Proceed to import?', 'You can\'t cancel once imported.', 'warning', 500, ic);
  }

  ic.checkImportedScholars = function(){

      ic.circular_message = 'Processing';
      ic.show_spinner = true;
      ic.isChecking = true;
      let checkedItem = [];
      ic.imported_scholars = angular.copy(ic.gridOptions.data);

      $timeout(()=>{

        ic.checking_in = "Checking: Duplicate values";

        ic.imported_scholars.forEach(function(value, idx){

          ic.gridOptions.data[idx].error = [];

          if (!value.firstname && !value.lastname && !value.middlename) {
            addError("Error: Empty scholar name", idx);
            return;
          }
          
          let fname = validateLettersSpaces(value.firstname, "firstname", idx);
          let lname = validateLettersSpaces(value.lastname, "lastname", idx);
          let mname = validateLettersSpaces(value.middlename, "middlename", idx);

          if (fname || lname || mname) {
            console.log('Hit');
            return;
          }
          
          let row = trimAndLower(value.firstname+value.lastname+value.middlename+value.mother_firstname+value.mother_maiden_name+value.mother_middlename);
          if (checkedItem.indexOf(row) > -1) return;

          // if (concatAndLower(value) === undefined) {
          //   ic.gridOptions.data[idx].error.push("Error: Empty scholar name");
          //   ic.total_errors += 1;
          //   return;
          // }

          // checkedItem.push(concatAndLower(value));
          checkedItem.push(row);
          checkDuplicate(value, ic.imported_scholars, idx);
        });
        validateImportedScholars();
      });
  }

  function checkDuplicate(value, imported_scholars, idx){
    for (var i = 0; i < imported_scholars.length; i++) {
      matchDuplicate(value, imported_scholars[i], idx, i);
    }
  }

  function matchDuplicate(value, imported_scholars, idx, i){
    if (idx === i) return;
    if (concatAndLower(value) === concatAndLower(imported_scholars))  {
      ic.gridOptions.data[idx].error[0] = "Duplicate No.";
      ic.gridOptions.data[idx].error.push(i+1);
      ic.total_errors += 1;
    }
  }

  function validateImportedScholars(){
    $q.all([importScholarApiService.getAddresses({municipality: ic.municipality}), schoolApiService.getListOfSchool(), importScholarApiService.getCourses({degree: ic.degree}), academicContractService.getAcademicContractDetails()]).then(response=>{
      console.log(response);
      $mdSidenav('importScholars').toggle();
      ic.imported_scholars.forEach(function(val, i){
        $timeout(()=>{
          validateScholarsName(response, val, i);
          if (i === ic.imported_scholars.length -1) {
            ic.progress_value = 0;
            ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
            ic.checking_in = 'Fetching data...';
            checkIfScholarExist();
          }
        });
      });
    }, err=> {
      console.log(err);
    });
  }

  function validateScholarsName(response, scholarsObj, idx){
    
      if (!ic.isChecking) return;

      let total = ic.imported_scholars.length - 1;

      ic.show_spinner = false;

      if (!scholarsObj.lastname || !scholarsObj.firstname) {
        ic.progress_value = Math.ceil(idx / total * 100);
        return;
      };

      ic.checking_in = 'Checking Format: '+ (scholarsObj.lastname || "")+" "+(scholarsObj.firstname || "")+", "+(scholarsObj.middlename || "");

      validate(scholar_status, scholarsObj.scholar_status, "Error: Invalid status", idx);
      validate(ip, scholarsObj.IP, "Error: Invalid IP", idx) ;
      validate(year_level, scholarsObj.year_level, "Error: Invalid Year level", idx);
      validate(gender, scholarsObj.gender, "Error: Invalid Gender", idx);

      validateFather(scholarsObj, idx);
      validateMother(scholarsObj, idx);

      validateAddress(response[0].data, scholarsObj, idx);
      validateSchool(response[1].data, scholarsObj, idx);
      validateCourse(response[2].data, scholarsObj, idx);
      validateContractDetails(response[3].data, scholarsObj, idx);

      if (!scholarsObj.degree) {
        addError("Error: Degree is empty", idx);
      }

      if (scholarsObj.degree && upperCase(scholarsObj.degree) !== upperCase(ic.degree)) {
        addError("Error: Degree is Invalid", idx);
      }

      if (!scholarsObj.section) {
        addError("Error: Section is empty", idx);
      }

      if (!scholarsObj.date_of_birth) {
        addError("Error: Date of Birth is empty", idx);
      }

      if (scholarsObj.date_of_birth && !moment.validateDate(scholarsObj.date_of_birth)) {
        addError("Error: Invalid Date of Birth", idx);
      }

      if(!!!addScholarsService.civilStatus().find(val => val === scholarsObj.civil_status)){
        addError("Error: Civil Status", idx);
      }

      if(!!!addScholarsService.contractStatus().find(val => val === scholarsObj.contract_status)){
        addError("Error: Contract Status", idx);
      }

      ic.progress_value = Math.ceil(idx / total * 100);
  }

  function validateAddress(addressesArray, scholarsObj, idx){
    if (!scholarsObj.address) {
      addError("Error: Address is empty", idx);
      return;
    }

    const address = addressesArray.find(item => {
      if ((item.address+item.municipality+'antique').replace(/ |,/g,'').toLowerCase() === scholarsObj.address.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.addressId = item.address_id;
          return true;
      }
    });

    if (!address) {
      addError("Error: Address "+scholarsObj.address+" not found", idx);
    }
  }

  function validateSchool(schoolsArray, scholarsObj, idx){
    if (!scholarsObj.school) {
      addError("Error: School is empty", idx);
      return;
    }

    const school = schoolsArray.find(item => {
      if (item.school_name.replace(/ |,/g,'').toLowerCase() === scholarsObj.school.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.schoolId = item.school_id;
          return true;
      }
    });

    if (!school) {
      addError("Error: School "+scholarsObj.school+" not found", idx);
    }
  }

  function validateCourse(coursesArray, scholarsObj, idx){
    if (!scholarsObj.course) {
      addError("Error: Course is empty", idx);
      return;
    }

    const course = coursesArray.find(item => {
      if (item.course.replace(/ |,/g,'').toLowerCase() === scholarsObj.course.replace(/ |,/g,'').toLowerCase()) {
          scholarsObj.courseId = item.course_id;
          return true;
      }
    });

    if (!course) {
      addError("Error: Course "+scholarsObj.course+" not found", idx);
    }
  }

  function validateContractDetails(contractDetailsArray, scholarsObj, idx){

    let hasError;

    if (!scholarsObj.semester) {
      addError("Error: Semester is empty", idx);
      hasError = true;
    }

    if (!scholarsObj.academic_year) {
      addError("Error: Academic year is empty", idx);
      hasError = true; 
    }

    if (hasError) return;

    const contract = contractDetailsArray.find(item => {
      if (item.academic_year_semester.semester.trim() === scholarsObj.semester.trim() && item.academic_year_semester.academic_year.trim() === scholarsObj.academic_year.trim()) {
          scholarsObj.contract_id = item.ascId;
          return true;
      }
    });

    if (!contract) {
      addError("Error: Academic year semester Invalid", idx);
    }
  }

  function checkIfScholarExist(){
    importScholarApiService.getScholarsWithCount({ degree: ic.degree, page: page }).then(response => {
      console.log(response);
      const res = response.data;
      if(res.scholars.length > 0 && res.count > 0){
        const numberOfPages = Math.ceil(res.count / 2);  
        res.scholars.forEach(function(val, i){
          const result = ic.imported_scholars.findIndex(value => {
            if(
              trimAndLower(value.firstname+value.lastname+value.middlename+value.mother_firstname+value.mother_maiden_name+value.mother_middlename)
              === trimAndLower(val.firstname+val.lastname+val.middlename+val.mother_details.firstname+val.mother_details.maiden_name+val.mother_details.middlename)){
              return true;
            }
          });

          if (result > -1) {
            addError("Error: Scholar already exist", result);
          }
          
          ic.checking_in = 'Checking Duplicate: '+ (val.lastname || "")+" "+(val.firstname || "")+", "+(val.middlename || "");
          scholar_count++;
          ic.progress_value = Math.ceil(scholar_count / res.count * 100) -1;

          if(i === res.scholars.length -1){
            if(page !== numberOfPages -1){
              page++;
              checkIfScholarExist()
            }
            else{
              ic.gridApi.core.notifyDataChange( uiGridConstants.dataChange.COLUMN );
              ic.progress_value = 100;
              page = 0;
              scholar_count = 0;
              doneCheckingNotif();
            }
          }
        });
      }
      else{
        doneCheckingNotif();     
      }
    }, err =>{
      swalert.dialogBox(err.data.message, 'error', 'Failed');
    });
  }

  function upperCase(value){
    if (typeof value === 'string'){
      return value.toUpperCase();
    } 
    return value;
  }

  function validateFather(scholarsObj, idx){

    if (!scholarsObj.father_lastname && !scholarsObj.father_firstname && !scholarsObj.father_middlename ) return;

    // if (scholarsObj.Father_lastname || scholarsObj.Father_firstname || scholarsObj.Father_middlename) {
    validateLettersSpaces(scholarsObj.father_lastname, "Father_lastname", idx);
    validateLettersSpaces(scholarsObj.father_firstname, "Father_firstname", idx);
    validateLettersSpaces(scholarsObj.father_middlename, "Father_middlename", idx);
    // }
    // else{
    //   ic.gridOptions.data[idx].error.push("Error: Incomplete Father details");
    //   ic.total_errors += 1;
    //   return;
    // }
  }

  function validateMother(scholarsObj, idx){
    // if (!scholarsObj.Mother_maiden_name || !scholarsObj.Mother_firstname) {
    //   ic.gridOptions.data[idx].error.push("Error: Mother details is required");
    //   ic.total_errors += 1;
    //   return;
    // }

    validateLettersSpaces(scholarsObj.mother_maiden_name, "Mother_maiden_name", idx);
    validateLettersSpaces(scholarsObj.mother_firstname, "Mother_firstname", idx);
    validateLettersSpaces(scholarsObj.mother_middlename, "Mother_middlename", idx);

  }

  function validateLettersSpaces(value, value_name, idx){
    let midname = ['mother_middlename', 'middlename'];
    if (value_name === 'father_middlename' && value === undefined) return;
    if (!value && midname.indexOf(value_name) > -1) return;
    if (!value) {
      addError("Error: Empty "+value_name, idx);
      return true;     
    }
    let str = value.toString().trim();
    if (!str || !/^[a-zA-Z\s]+$/.test(str) || str.toLowerCase() === "none" || str.toLowerCase() === "none" && midname.indexOf(value_name) > -1) {
      addError("Error: Invalid "+value_name+" "+value, idx);
      return true;
    }
    return;
  }

  function validate(referenceArray, fieldname, error, idx){
    if (referenceArray.indexOf(fieldname) === -1) {
        ic.gridOptions.data[idx].error.push(error);
        ic.total_errors += 1;
    }
    return;
  }

  function addError(error, idx){
    ic.gridOptions.data[idx].error.push(error);
    ic.total_errors += 1;
  }

  function concatAndLower(value){
    // if (!value.Firstname || !value.Lastname || !value.Middlename) return undefined;
    let mname = value.middlename ? value.middlename : "";
    return (value.firstname+value.lastname+mname).replace(/ |,/g,'').trim().toLowerCase();
  }

  function trimAndLower(value){
    return (value || "").replace('undefined', '').toString().trim().toLowerCase();
  }

  function importScholarsData(imported_data){
    importScholarApiService.importScholars(imported_data).then(response =>{
      ic.imported_scholars = [];
      ic.check_finished = false;
      swalert.dialogBox('Import successful!', 'success', 'Success');
      ic.show_spinner = false;
      imported_data = {};
    }, err => {
      console.log(err);
      ic.imported_scholars = [];
      ic.check_finished = false;
      swalert.dialogBox(err.data.message, 'error', 'Failed');
      ic.show_spinner = false;
    });
  }

  function getMunicipalities(){
    municipalitiesApiService.getMunicipalities()
      .then(response=>{
        ic.municipalities = response.data;
        ic.municipalities_loaded = true;
      }, err=> {
        console.log(err);
      });
  }

  function doneCheckingNotif(){
    ic.checking_in = 'Checking: Finished';
    ic.check_finished = ic.total_errors > 0 ? false : true;
    swalert.toastInfo('Check Finished', 'success', 'top-right');   
  }

  getMunicipalities();
  
}]);