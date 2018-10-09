var dialog = new sap.m.BusyDialog();
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
				var view = this.getView();
				view.setVisible(false);
				dialog.setText("Initializing");
				dialog.open();	
//				$.post('DatabaseSetup');
				var _timeout = jQuery.sap.delayedCall(1500, this, function () {
					sap.ui.core.BusyIndicator.hide();
					view.setVisible(true);
					dialog.close();
				});
				
				
				/*$.post('EmailNotificationAddedToTeam',{newTeamMemberName:"Ben", emailAddress: "johandewaal18@gmail.com", currentUserName: "Johan" }, function(response){
					console.log("success");
				});*/
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
			var thisPtr = this;
			
			$.post('GetPasswordHash', {password:password},
			function(response){
				password = response;
			});
			
			var filters = [];
			//start the loading indicator
			sap.ui.core.BusyIndicator.show(0)
			oModel.read( "/Consultants", {
				urlParameters:{
					"$select": "Consultant_ID,Consultant_Priviledge"
				},
				filters: [ new sap.ui.model.Filter({
			          path: "Consultant_Email",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: email
			    })],
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
						var oConsultantId = data.results[0].Consultant_ID;
					    var oConsutlantAdmin = data.results[0].Consultant_Priviledge;
					    filters = [new sap.ui.model.Filter("ConsultantDetails/Consultant_ID", sap.ui.model.FilterOperator.EQ, oConsultantId),
							   	   new sap.ui.model.Filter("Password", sap.ui.model.FilterOperator.EQ, password)];
					
						oModel.read("/Users",{
							filters: [new sap.ui.model.Filter(filters, true)],
							success: function(data){
								if (data.results.length == 0){
									sap.m.MessageToast.show('Invalid user details. Check username and password', {
										duration: 5000,
										autoClose: true
									 });
									//end the loading indicator
									sap.ui.core.BusyIndicator.hide();
								}
								else{
									//end the loading indicator
									sap.ui.core.BusyIndicator.hide();
									if (oConsutlantAdmin == 100 || oConsutlantAdmin == 200){
										thisPtr.getRouter().navTo("MasterAdmin", {consultantId: oConsultantId});
//										thisPtr.view = "Admin";
									}
									else{
										thisPtr.getRouter().navTo("MasterConsultant", {consultantId: oConsultantId});
//										thisPtr.view = "Consultant";
									}
								}
							}
						});
					}
				  },
				 error: function(oError) {
					 sap.m.MessageToast.show(oError, {
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