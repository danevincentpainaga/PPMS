'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:governorCtrl
 * @description
 * # governorCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('governorCtrl',
	[
		'$scope',
		'governorService',
		'addScholarsService',
		'swalert',
	function (
		$scope,
		governorService,
		addScholarsService,
		swalert) {

    var gov = this;
	gov.suffix = "NONE";

	$scope.$watch('gov.mi', function(n, o){
		if(n){
			gov.mi = gov.mi.replace(/[^A-Z]+/g, '');
			if(gov.mi.length > 1){
				gov.mi = gov.mi.slice(0, 1);
			}
		}
	});

	gov.updateGovernor = function(){
		
		if(!gov.firstname || !gov.mi || !gov.lastname) return;
		gov.updating = true;
		
		let governor = {
			firstname: gov.firstname,
			mi: gov.mi,
			lastname: gov.lastname,
			suffix: gov.suffix //? gov.suffix : "",
		}
		
		governorService.updateGovernor(governor).then(response => {
			console.log(response);
			gov.updating = false;
			gov.enabled = false;
			swalert.dialogBox(response.data.message, 'success', 'Success');
		}, err => {
			console.log(err);
			swalert.dialogBox(err.data.message, 'error', 'Failed');
			gov.updating = false;
			gov.enabled = false;
		});
	}

	gov.enableDisable = function(){
		gov.enabled = gov.enabled ? false : true;
	}

	function getGovernoDetails(){
		governorService.getGovernorDetails().then(response=>{
			if(response.data){
				let gov_details = response.data.governor;
				gov.firstname = gov_details.firstname;
				gov.mi = gov_details.mi;
				gov.lastname = gov_details.lastname;
				gov.suffix = gov_details.suffix? gov_details.suffix.toUpperCase() : 'NONE';
				gov.governor_loaded = true;
			}
			gov.governor_loaded = true;
		}, err=>{
			console.log(err);
		});
	}

	function loadSuffix(){
		addScholarsService.getSuffix().then(response => {
		  gov.suffix_list = response.data;
		}, err => {
		  console.log(err);
		});
	}

	getGovernoDetails();
	loadSuffix();

}]);