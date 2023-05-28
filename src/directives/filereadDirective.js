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
                  let errors = '';
                  let headers = [
                                  'lastname', 'firstname', 'middlename', 'date_of_birth', 'age',
                                  'gender', 'father_firstname', 'father_lastname', 'father_middlename',
                                  'mother_firstname', 'mother_maiden_name', 'mother_middlename', 'school',
                                  'student_id_number', 'degree', 'civil_status', 'course', 'section', 'year_level', 'semester', 'academic_year',
                                  'scholar_status', 'IP'
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
                          errors += '<li style="text-align:left;">'+ val +'</li>';
                      }
                  })
                    
                  if(errors !== ''){
                    scope.state = false;
                    console.log(errors);
                    $elm.val(null);
                    swalert.fileErrors(errors);
                    return;
                  }
                  
                  scope.opts.data = scope.json_data;
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