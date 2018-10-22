sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.SplitApp", {
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.SplitApp
		 */

			onAfterRendering: function() {
				var thisDomObj =  this;
				var consultantID = this.getConsultantID();
				var oModel = this.getOwnerComponent().getModel("oModel");
				oModel.read( "/Consultants", {
					filters: [ new sap.ui.model.Filter({
						urlparameters:{"$select": "Consultant_Name"},
				          path: "Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: consultantID
				     })],
			    	success: function(oData){
			    	 	if(oData.results.length > 0)
			    	 		thisDomObj.getView().byId("splitAppMenuButton").setText(oData.results[0].Consultant_Name);
			 		}, 
			 		error: function(oError){
						sap.m.MessageToast.show('Unable to extract user name', {
							duration: 5000,
							autoClose: true
						 });
			 		}
			 	});										
			},
			onLogoutPress: function(){
				if (sessionStorage){
					sessionStorage.clear();
					location.reload();
					this.getRouter().navTo("login");
				}
			},
			
			employeeProfile: function(){
				this.getRouter().navTo("register");
			}

	});

});