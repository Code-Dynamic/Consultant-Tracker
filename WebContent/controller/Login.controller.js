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
				var _timeout = jQuery.sap.delayedCall(1000, this, function () {
					sap.ui.core.BusyIndicator.hide();
					view.setVisible(true);
					dialog.close();
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
						thisPtr.setInputFieldErrorStates();
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
									thisPtr.setInputFieldErrorStates();
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
									sessionStorage.ConsultantID = oConsultantId;
									if (!data.results[0].Completed)
										thisPtr.getRouter().navTo("register");
									else if (oConsutlantAdmin == 100 || oConsutlantAdmin == 200)
										thisPtr.getRouter().navTo("MasterAdmin", {consultantId: oConsultantId});
									else
										thisPtr.getRouter().navTo("MasterConsultant", {consultantId: oConsultantId});
								}
							}
						});
					}
				  },
				 error: function(oError) {
					 sap.m.MessageToast.show("Failed to extract login details", {
							duration: 10000,
						 autoClose: false
					 });
					//end the loading indicator
					sap.ui.core.BusyIndicator.hide();
					thisPtr.setInputFieldErrorStates();
				 }
			});
	},
	setInputFieldErrorStates: function(){
   		var input = this.getView().byId("password");
   		input.setValueState(sap.ui.core.ValueState.Error);
   		input = this.getView().byId("username-email");
   		input.setValueState(sap.ui.core.ValueState.Error);
	},
	onForgotPasswordClick: function(){
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.ResetPassword",this);
		this._oDialog.open();
	},
	
	onSubmitEmail: function(){
		var email = sap.ui.getCore().byId("c_Email").getValue();
		var oModel = this.getOwnerComponent().getModel("oModel");
		var userModel =  new sap.ui.model.json.JSONModel();
		var thisObj = this;
		oModel.read("/Users", {
			urlParameters: {
				"$expand": "ConsultantDetails"
			},
			filters: [ new sap.ui.model.Filter({
		          path: "ConsultantDetails/Consultant_Email",
		          operator: sap.ui.model.FilterOperator.EQ,
		          value1: email
		    })],
		    success: function(data){
		    	if(data.results.length > 0 ){
		    		thisObj._oDialog.destroy();
		    		userModel.setData(data.results[0]);
		    		thisObj.getView().setModel(userModel, "userModel");
		    		thisObj._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.SecurityQuestion",thisObj);
		    		thisObj._oDialog.setModel(userModel, "userModel");
		    		thisObj._oDialog.open();
		    	}else{
		    		sap.m.MessageToast.show("Email does not exist");
		    		thisObj.setFragmentInputState("c_Email");
		    	} 
		    		
		    }
		})
	},
	onClose: function () {
		if (this._oDialog) {
			this._oDialog.destroy();
		}
	},
	onSubmitResponse: function () {
		var response = sap.ui.getCore().byId("c_Answer").getValue();
		if (response == this.getView().getModel("userModel").oData.Security_Answer){
			this._oDialog.destroy();
			this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.PasswordFragment",this);
    		this._oDialog.open();
		}else{
			sap.m.MessageToast.show("Incorrect response");	
			this.setFragmentInputState("c_Answer");
		}
	},
	onSubmitPassword: function(){
		var passw1 = sap.ui.getCore().byId("firstPassword").getValue();
		var passw2 = sap.ui.getCore().byId("secPassword").getValue();
		var thisObj = this;
		if (passw1 == passw2 && passw1 != "" && passw2 != ""){
			$.post('CreateUser', {
				conID:this.getView().getModel("userModel").oData.Consultant_ID,
				passw: passw1,
				resetpassword: "true"
			},
			function(response){
				sap.m.MessageToast.show("Password successfully changed");
				thisObj._oDialog.destroy();
			});
		}else{
			sap.m.MessageToast.show("Please fill in both input fields with the same password.");
			this.setFragmentInputState("firstPassword");
			this.setFragmentInputState("secPassword");
		}
	},
	setFragmentInputState: function(inputID){
		var input = sap.ui.getCore().byId(inputID);
		input.setValueState(sap.ui.core.ValueState.Error);
	}
});

});