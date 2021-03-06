sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.PasswordControl", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.PasswordControl
*/
	onInit: function() {
		
		var oModel = this.getOwnerComponent().getModel("oModel");
		var consultantID = this.getConsultantID();
		var thisObj = this;
 		var consultantModel = new sap.ui.model.json.JSONModel();
		oModel.read( "/Users", {
			urlParameters:{
				"$expand":"ConsultantDetails"
			},
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
				sap.m.MessageToast.show('Unable to extract user details');
	 		}
	 	});	
	},
	onUpdateClick: function(){
		var check = 0;
		var question = this.getView().byId("securityQuestion").getValue();
		if(this.checkValueEntered(question,"securityQuestion")){
			check++;
		}
		var answer = this.getView().byId("securityAnswer").getValue();
		if(this.checkValueEntered(answer,"securityAnswer")){
			check++;
		}
		var firstPassw = this.getView().byId("firstPassword").getValue();
		if(this.checkValueEntered(firstPassw,"firstPassword")){
			check++;
		}
		var secPassw = this.getView().byId("secPassword").getValue();
		if(this.checkValueEntered(secPassw,"secPassword")){
			check++;
		}
		var thisObj = this;
		
		var numSuccefulTests = 4;		
		if (check !== numSuccefulTests){
			sap.m.MessageToast.show("All fields must be filled in");
		}
		else if ( firstPassw == secPassw){
			var minPassLen = 7;
			if(firstPassw.length < minPassLen){
	   			var input = this.getView().byId("secPassword");
	   			input.setValueState(sap.ui.core.ValueState.Error);
	   			input = this.getView().byId("firstPassword");
	   			input.setValueState(sap.ui.core.ValueState.Error);
	   			sap.m.MessageToast.show("Passwords have to be at least 8 characters in Length");
			}
			else{
				$.post('CreateUser', {
					conID:this.getConsultantID(), 
					question: question,
					answer:answer,
					passw: firstPassw
					},
					function(response){
						sap.m.MessageToast.show("Details Edited Succesfully");
						if (thisObj.getView().getModel("consultantModel").oData.ConsultantDetails.Consultant_Priviledge == 100 || thisObj.getView().getModel("consultantModel").oData.ConsultantDetails.Consultant_Priviledge == 200)
							thisObj.getRouter().navTo("MasterAdmin", {consultantId: thisObj.getConsultantID()});
						else
							thisObj.getRouter().navTo("MasterConsultant", {consultantId: thisObj.getConsultantID()});
				});
			}

		}else{
   			var input = this.getView().byId("secPassword");
   			input.setValueState(sap.ui.core.ValueState.Error);
   			input = this.getView().byId("firstPassword");
   			input.setValueState(sap.ui.core.ValueState.Error);
   			sap.m.MessageToast.show("Passwords do not match");

		}
	}
	});

});