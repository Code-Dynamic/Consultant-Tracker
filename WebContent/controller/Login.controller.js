sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.Login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Login
		 */
			onInit: function() {
				
				
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
			    
				var oModel2 = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
				var userDetails = "/Users?$filter=Email eq \'"+ email + "\'&password eq \'" + password + "\'";
//				var userDetails = "/Users?$filter=Email eq \'steve@blah.co.za\'&password eq \'steve\'";
				console.log("details: " + userDetails);
//				alert(filterQuery);
				var thisPtr = this;
				oModel2.read( userDetails, {
						
//					filters:filters,
					success: function(data){
						if (data.length == 0)
							sap.m.MessageToast.show('Invalid user details. Check username and password', {
								duration: 5000,
								autoClose: true
							 });
						else{
							if (data.length == 0)
								sap.m.MessageToast.show('Logging in, please wait', {
									duration: 5000,
									autoClose: true
								 });
//							check if the user is an admin or just a consultant
//							 /Consultants?$select=Consultant_Admin&$filter=Consultant_email eq \'"+ email + "\'"
							oModel2.read("/Consultants?$select=Consultant_ID, Consultant_Admin&$filter=Consultant_email eq \'"+ email + "\'",{
								success: function(data, response){
									var dataResults = JSON.stringify(data);
									var array = dataResults.split(',');
									console.log(data.results);
//									console.log(array[array.length-1].substr(20,1));
									var oConsultantId = array[array.length-2].substr(17,1);
									if (array[array.length-1].substr(20,1) == 1)
										thisPtr.getRouter().navTo("masterManager", {consultantId: oConsultantId});
									else
										thisPtr.getRouter().navTo("MasterConsultant", {consultantId: oConsultantId});
								}
							});
						}
					  },
					 error: function(oError) {
						 sap.m.MessageToast.show(oError, {
								duration: 10000,
							 autoClose: false
						 });
						 }
					});
////				
//				this.getRouter().navTo("MasterConsultant");
		}

	});

});