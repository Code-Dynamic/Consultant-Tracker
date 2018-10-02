sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.SplitApp", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.SplitApp
		 */
		//	onInit: function() {
		//
		//	},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.SplitApp
		 */
		//	onBeforeRendering: function() {
		//
		//	},

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
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.SplitApp
		 */
//			onExit: function() {
//			}

	});

});