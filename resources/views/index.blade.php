<!doctype html>
<html ng-app="myApp" lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>PPMS</title>
        <link href="{{asset('node_modules/angularjs-datepicker/dist/angular-datepicker.min.css')}}" rel="stylesheet" type="text/css">
        <link href="{{asset('node_modules/angular-confirm/dist/angular-confirm.min.css')}}" rel="stylesheet" type="text/css">
        <link href="{{asset('node_modules/components-font-awesome/css/font-awesome.min.css')}}" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="{{asset('bower_components/fullcalendar/dist/fullcalendar.min.css')}}"/>
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>
    <body ng-cloak ng-controller="mainAppCtrl">
        <ng-include src="'views/header.html'" ></ng-include> 
        <div class="container-fluid ">
            <div class="row" ui-view=""></div>
        </div>
        <ng-include src="'views/modal.html'" ng-if="header"></ng-include> 

        <script src="{{asset('node_modules/jquery/dist/jquery.min.js')}}" type="text/javascript"></script>
        <script type="text/javascript" src="{{asset('bower_components/moment/min/moment.min.js')}}"></script>
        <script type="text/javascript" src="{{asset('bower_components/fullcalendar/dist/fullcalendar.min.js')}}"></script>
        <script type="text/javascript" src="{{asset('bower_components/fullcalendar/dist/gcal.min.js')}}"></script>
        <script type="text/javascript" src="{{asset('js/app.js')}}"></script>
        <script type="text/javascript" src="{{asset('bower_components/angular-ui-calendar/src/calendar.js')}}"></script>

        <script src="{{asset('node_modules/@uirouter/angularjs/release/angular-ui-router.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-animate/angular-animate.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-cookies/angular-cookies.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-sanitize/angular-sanitize.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-touch/angular-touch.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-resource/angular-resource.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angular-confirm/dist/angular-confirm.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/angularjs-datepicker/dist/angular-datepicker.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/sweetalert2/dist/sweetalert2.min.js')}}" type="text/javascript"></script>
        <script src="{{asset('node_modules/socket.io-client/dist/socket.io.js')}}" type="text/javascript"></script>

        <script>var baseUrl = "{{url('/')}}/";</script>
        <script type="text/javascript" src="{{asset('controller/mainCtrl.js')}}"></script>
        <script type="text/javascript" src="{{asset('services/allServices.js')}}"></script>
        <script type="text/javascript" src="{{asset('alertServices/alertServices.js')}}"></script>

    </body>
      

</html>
