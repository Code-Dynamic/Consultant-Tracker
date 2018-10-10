sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.Register", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Register
		 */
		onInit: function() {
			var oModel = this.getOwnerComponent().getModel("oModel");
			var consultantID = this.getConsultantID();
			var thisObj = this;
	 		var consultantModel = new sap.ui.model.json.JSONModel();
			oModel.read( "/Consultants", {
				filters: [ new sap.ui.model.Filter({
			          path: "Consultant_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: consultantID
			     })],
		    	success: function(data){
		    	 	if(data.results.length > 0){
		    	 		consultantModel.setData(data.results[0]);
		    	 		thisObj.getView().setModel(consultantModel, "consultantModel");
		    	 	}
		 		}, 
		 		error: function(oError){
					sap.m.MessageToast.show('Unable to extract consultant details');
		 		}
		 	});	
		},

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Register
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Register
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.Register
		 */
		//	onExit: function() {
		//
		//	}
		
		//Go to login page
		onUpdateClick: function(){
			var consultantID = this.getConsultantID();
			var cName = this.getView().byId("EditC_Name").getValue();
			var cSurname = this.getView().byId("EditC_Surname").getValue();
			var cEmail = this.getView().byId("EditC_Email").getValue();
			var cNumber = this.getView().byId("EditC_Number").getValue();
			var priv = this.getView().getModel("consultantModel").oData.Consultant_Priviledge
			var thisPtr = this;
			if (cName == "" || cSurname == "" || cEmail == "" || cNumber == "")
				sap.m.MessageToast.show('Fill in all the blanks');
			else{
				$.post('CreateConsultant',{
					conID: consultantID,
					name: cName, 
					surname: cSurname,
					email: cEmail, 
					cell: cNumber,
					admin: priv
				},function(){
					sap.m.MessageToast.show('Details successfully updated');
					thisPtr.getRouter().navTo("PasswordControl");
				});
			}
		}
		
	});

});