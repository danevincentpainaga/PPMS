<!doctype html>
<html ng-app="myApp" lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Laravel</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Raleway:100,600" rel="stylesheet" type="text/css">
        <link href="{{asset('node_modules/angularjs-datepicker/dist/angular-datepicker.min.css')}}" rel="stylesheet" type="text/css">
        <link href="{{asset('node_modules/angular-confirm/dist/angular-confirm.min.css')}}" rel="stylesheet" type="text/css">
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Raleway', sans-serif;
                font-weight: 100;
                height: 100vh;
                margin: 0;
            }

            .full-height {
                height: 100vh;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 12px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body  ng-controller="mainCtrl">
    <ng-include src="'views/header.html'"></ng-include> 
    <div class="container">
        <div class="row" ui-view=""></div><!-- 
        <script src="{{asset('node_modules/angular/angular.js')}}" type="text/javascript"></script> -->
        <script type="text/javascript" src="{{asset('js/app.js')}}"></script>
        <script src="{{asset('node_modules/@uirouter/angularjs/release/angular-ui-router.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-animate/angular-animate.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-cookies/angular-cookies.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-sanitize/angular-sanitize.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-touch/angular-touch.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-resource/angular-resource.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-confirm/dist/angular-confirm.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angularjs-datepicker/dist/angular-datepicker.min.js')}}" type="text/javascript"></script>
        <script>var baseUrl = "{{url('/')}}/";</script>

    </div>
        <script type="text/javascript" src="{{asset('controller/mainCtrl.js')}}"></script>
    </body>\




  <!-- The Modal -->
  <div class="modal fade" id="myModal">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
      
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Add Venue</h4>
        </div>
        
        <!-- Modal body -->
        <div class="modal-body">
           <form action="/action_page.php">
            <div class="form-group">
              <label for="usr">Venue:</label>
              <input type="text" class="form-control" id="usr" name="">
            </div>
            <button type="submit" class="btn btn-success">Submit</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </form>
        </div>
        
      </div>
    </div>
  </div>

  <div class="modal fade" id="requestModal" >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" >
      
        <!-- Modal Header -->
        <div class="modal-header">
          <h4 class="modal-title">Request</h4>
        </div>
        
        <!-- Modal body -->
        <div class="modal-body">
           <form action="/action_page.php">
            <div class="form-group">
              <label for="usr">Requester Name:</label>
              <input type="text" class="form-control" id="usr" name="">
            </div>
            <div class="form-group">
              <label for="usr">Department</label>
              <input type="text" class="form-control" id="usr" name="">
            </div>
            <div class="form-group">
              <label for="usr">Reserve Date:</label>
                <datepicker datepicker-mobile="true" date-format="yyyy-MM-dd" selector="form-control">
                  <div class="input-group">
                    <input class="form-control" ng-model="apps.appdata.academic_year_to" style="border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;" />
                  </div>
                </datepicker>
            </div>
            <div class="form-group">
              <label for="usr">Venue:</label>
              <input type="text" class="form-control" id="usr" name="">
            </div>
            <div class="form-group">
              <label for="usr">Remarks:</label>
              <textarea class="form-control" ></textarea>
            </div>
            <button type="submit" class="btn btn-success">Submit</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </form>
        </div>
      </div>
    </div>
  </div>

</html>
