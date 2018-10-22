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
		
		//Go to login page
		onUpdateClick: function(){
			var check = 0;
			var consultantID = this.getConsultantID();
			var cName = this.getView().byId("EditC_Name").getValue();
			if(this.checkValueEntered(cName,"EditC_Name")){
				check++;
			}
			var cSurname = this.getView().byId("EditC_Surname").getValue();
			if(this.checkValueEntered(cSurname,"EditC_Surname")){
				check++;
			}
			var cEmail = this.getView().byId("EditC_Email").getValue();
			if(this.checkEmailValueEntered(cEmail,"EditC_Email")){
				check++;
			}
			var cNumber = this.getView().byId("EditC_Number").getValue();
			if(this.checkValueEntered(cNumber,"EditC_Number")){
				check++;
			}
			
			var numSuccefulTests = 4;
			var priv = this.getView().getModel("consultantModel").oData.Consultant_Priviledge
			var thisPtr = this;
			if (check !== numSuccefulTests){
				sap.m.MessageToast.show('Please fill in all the fields with valid data');
			}
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