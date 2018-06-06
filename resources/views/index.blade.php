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
        <link href="{{asset('node_modules/components-font-awesome/css/font-awesome.min.css')}}" rel="stylesheet" type="text/css">
        <!-- <link rel="stylesheet" href="{{asset('bower_components/fullcalendar/dist/fullcalendar.css')}}"/> -->
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.9.0/fullcalendar.min.css">
        <!-- <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar-scheduler/1.9.4/scheduler.css"> -->
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
    <body ng-cloak ng-controller="mainCtrl">
    <ng-include src="'views/header.html'" ></ng-include> 
    <div class="container ">
        <div class="row" ui-view=""></div>


        <script src="{{asset('node_modules/jquery/dist/jquery.min.js')}}" type="text/javascript"></script>

        <script type="text/javascript" src="{{asset('bower_components/moment/min/moment.min.js')}}"></script>
        <script type="text/javascript" src="{{asset('bower_components/fullcalendar/dist/fullcalendar.min.js')}}"></script>
        <!-- <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/fullcalendar-scheduler/1.9.4/scheduler.min.js"></script> -->
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

<!-- 
        <script type="text/javascript" src="{{asset('bower_components/angular/angular.min.js')}}"></script> -->




        <script>var baseUrl = "{{url('/')}}/";</script>

    </div>

        <ng-include src="'views/modal.html'"></ng-include> 

        <script type="text/javascript" src="{{asset('controller/mainCtrl.js')}}"></script>
        <script type="text/javascript" src="{{asset('services/allServices.js')}}"></script>

    </body>
      

</html>
