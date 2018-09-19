sap.ui.define([
		'consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController'
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.Login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Login
		 */
			onInit: function() {
//				check if the super user account has been created. If not, then create the superuser account
				//start the loading indicator
				sap.ui.core.BusyIndicator.show(100);
				var oModel2 = new sap.ui.model.odata.ODataModel(this.getModelAddress()); 
				oModel2.read("/Consultants?$filter=Consultant_email eq 'Superuser'", {
					success: function(data){
						if (data.results.length == 0){
							$.post("createConsultant", {name:"Superuser",surname:"Admin",email:"Superuser",
									cell:"0000000000", admin:1},function(responseText) { 
										oModel2.read( "/Consultants?$select=Consultant_ID&$filter=Consultant_email eq 'Superuser'", {
											success: function(data){
												console.log (data.results);
												if (data.results.length != 0){
													$.post("CreateUser", {conID:data.results[0].Consultant_ID, password:"CodeDynamicTesting"},
															function(responseText) { });
												}
											}
										});
									});
//							add to the database in the users table
							
						}
						
						
						//end the loading indicator
						var _timeout = jQuery.sap.delayedCall(3000, this, function () {
							sap.ui.core.BusyIndicator.hide();
						});
					},		
					error: function(oError) {
						sap.m.MessageToast.show(oError.message, {
							duration: 10000,
							autoClose: true
						});
						//end the loading indicator
						sap.ui.core.BusyIndicator.hide();
					}
				});
			},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Login
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Login
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Login
		 */
		//	onExit: function() {
		//
		//	}
		
		//Go to Register page
		onCreateAccountClick: function(){
				this.getRouter().navTo("register");
		},
		//Log user into account
		onLoginClick: function(){
			var email = this.getView().byId("username-email").getValue();
			var password =this.getView().byId("password").getValue();
			var oModel = this.getOwnerComponent().getModel("oModel");
			var oConsultantId;
		    var oConsutlantAdmin;
			var oModel2 = new sap.ui.model.odata.ODataModel(this.getModelAddress()); 
			var thisPtr = this;
			
			//start the loading indicator
			sap.ui.core.BusyIndicator.show(0)
			oModel2.read( "/Consultants?$select=Consultant_ID, Consultant_Admin&$filter=Consultant_email eq \'"+ email + "\'", {
				success: function(data){
					if (data.results.length == 0){
						sap.m.MessageToast.show('Invalid user details. Check username and password', {
							duration: 5000,
							autoClose: true
						 });
						//close the loading indicator
						sap.ui.core.BusyIndicator.hide();
					}							
					else{
						oConsultantId = data.results[0].Consultant_ID;
						oConsutlantAdmin = data.results[0].Consultant_Admin;
						oModel2.read("/Users?$select=Password&$filter=Consultant_ID eq "+ oConsultantId + " and Password eq \'" +password+ "\'",{
							success: function(data, response){
								if (data.results.length == 0){
									sap.m.MessageToast.show('Invalid user details. Check username and password', {
										duration: 5000,
										autoClose: true
									 });
									//end the loading indicator
									sap.ui.core.BusyIndicator.hide();
								}
								else{
									sap.ui.core.BusyIndicator.hide();
									if (oConsutlantAdmin == 1)
										thisPtr.getRouter().navTo("MasterAdmin", {consultantId: oConsultantId});
									else
										thisPtr.getRouter().navTo("MasterConsultant", {consultantId: oConsultantId});
								}
							}
						});
					}
				  },
				 error: function(oError) {
					 sap.m.MessageToast.show(oError.message, {
							duration: 10000,
						 autoClose: false
					 });
					//end the loading indicator
					sap.ui.core.BusyIndicator.hide();
					 }
				});
	},
});

});