var XLSX = require('xlsx/dist/xlsx.full.min.js');
angular.module('psmsApp').directive("fileread", 
  ['$timeout',
   'swalert',
  function ($timeout, swalert) {
    return {
      scope: {
        opts: '=',
        state:'=',
        checking: '=',
        message: '='
      },
      link: function (scope, $elm, $attrs) {

        var file;

        $elm.on('change', function (changeEvent) {

          if (!changeEvent.target.files[0] || scope.checking) {
              changeEvent.target.files = file;
              return;
          }

          file = changeEvent.target.files;
          scope.message = 'Importing';
          scope.state = true;
          scope.$apply(scope.state);

          var reader = new FileReader();
          
          reader.onload = function (evt) {
              $timeout(()=>{
                scope.$apply(function () {
                  
                  scope.json_data = [];
                  let errors = [];
                  let headers = [
                                  'Lastname', 'Firstname', 'Middlename', 'Date of Birth', 'Age',
                                  'Gender', 'Father_firstname', 'Father_lastname', 'Father_middlename',
                                  'Mother_firstname', 'Mother_maiden_name', 'Mother_middlename', 'School',
                                  'Student ID NO', 'Degree', 'Course', 'Section', 'Year level', 'Semester', 'Academic year',
                                  'Status', 'IP'
                                ];

                  let data = evt.target.result;
                  
                  let workbook = XLSX.read(data, {type: 'binary'});

                  scope.json_data = XLSX.utils.sheet_to_json(workbook.Sheets['Scholars list']);
                  
                  let sheet_name = workbook.SheetNames.indexOf('Scholars list');

                  if (sheet_name === -1){
                      scope.state = false;
                      swalert.dialogBox('Can\'t find sheet name Scholars list. Note! dont include spaces before and after Scholars list sheet', 'error', 'Invalid');
                      $elm.val(null);
                      return;
                  }
                  
                  if (scope.json_data.length < 1) {
                    scope.state = false;
                    $elm.val(null);
                    alert('File is empty');
                    return;
                  }

                  let headerNames = XLSX.utils.sheet_to_json(workbook.Sheets['Scholars list'], { header: 1 })[0];
                  
                  headers.forEach(function(val, i){ 
            
                      if (headerNames.indexOf(val) === -1) {
                          errors.push(' Can\'t find header name '+val);
                      }
            
                  })

                  if (errors.length > 0) {
                      scope.state = false;
                      console.log(errors);
                      $elm.val(null);
                      swalert.dialogBox(errors, 'error', 'Invalid');
                      return;
                  }
                  
                  scope.opts.data = scope.json_data;
                  // $elm.val(null);
                  scope.state = false;
                });

              });
          };
          reader.readAsBinaryString(changeEvent.target.files[0]);
        });
      }
    }
  }
]);