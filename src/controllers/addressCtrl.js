'use strict';

/**
 * @ngdoc function
 * @name psmsApp.controller:addressCtrl
 * @description
 * # addressCtrl
 * Controller of the psmsApp
 */ 

angular.module('psmsApp')
.controller('addressCtrl',
	[
		'$scope',
		'municipalitiesApiService',
		'addressApiService',
		'debounce',
		'swalert',
		'$mdSidenav',
	function (
		$scope,
		municipalitiesApiService,
		addressApiService,
		debounce,
		swalert,
		$mdSidenav) {

	var ad = this;
	ad.isUpdating = false;

	$scope.$watch('ad.searched_address', debounce(function(){
		ad.searching = true;
		getAddresses(ad.searched_address);
	}, 500), true);

	ad.add = function(){
		ad.isUpdating = false;
		ad.saveUpdateBtnText = 'Save';
		ad.labelText = 'Add';
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.edit = function(selected_address){
		ad.binded_address = selected_address;
		ad.address_id = selected_address.address_id;
		ad.brgy = selected_address.brgy;
		ad.municipality = selected_address.municipality;
		ad.isUpdating = true;
		ad.saveUpdateBtnText = 'Update';
		ad.labelText = 'Update';
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.close = function(){
		clearInputs();
		$mdSidenav('addUpdateAddress').toggle();
	}

	ad.saveUpdateAddress = function(){

		if (ad.brgy && ad.municipality) {

			ad.saving_updating = true;

			let payload = {
				brgy: ad.brgy.toUpperCase(),
				municipality: ad.municipality.toUpperCase(),
			};

			if (!ad.isUpdating) {
				storeAddress(payload);
			}
			else{
				updateAddress(payload);
			}
		}
	}


	function storeAddress(payload){
		addressApiService.storeAddress(payload).then(response => {
			console.log(response);
			ad.addresses.push(response.data);
			clearInputs();
			ad.saving_updating = false;
			swalert.dialogBox('Address saved.', 'success',  'successful');
		}, err => {
			console.log(err);
			swalert.dialogBox(err.data.message, 'error', 'Failed');
			ad.saving_updating = false;
		})
	}

	function updateAddress(payload){

		Object.assign(payload, { address_id: ad.address_id });

		addressApiService.updateAddress(payload).then(response => {
			ad.binded_address.brgy = response.data.brgy;
			ad.binded_address.municipality = response.data.municipality;
			ad.saving_updating = false;
			swalert.dialogBox('Address updated.', 'success',  'successful');
		}, err => {
			console.log(err);
			swalert.dialogBox(err.data.message, 'error', 'Failed');
			ad.saving_updating = false;
		});
	}

	function getMunicipalities(){
		municipalitiesApiService.getMunicipalities().then(response=>{
			ad.municipalities = response.data;
		}, err=> {
			console.log(err);
		});
	}

	function getAddresses(searched){
		addressApiService.getAddresses({searched: searched}).then(response=>{
			ad.addresses = response.data;
			ad.searching = false;
			ad.address_list_loaded = true;
		}, err => {
			console.log(err);
		});
	}

	function clearInputs(){
		ad.binded_address = "";
		ad.brgy = "";
		ad.municipality = "";
		ad.addressForm.$setPristine();
		ad.addressForm.$setUntouched();
	}

	getMunicipalities();

}]);