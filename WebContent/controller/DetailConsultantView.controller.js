sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global',
		'sap/ui/core/Fragment',

	], function(BaseController,JSONModel,Controller,jQuery,Fragment) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailConsultantView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.DetailConsultant
		 */
			onInit: function() {
				
				//geting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("DetailConsultantView").attachMatched(this._onRouteMatched, this);
			
			},
			
			_onRouteMatched: function(oEvent) {
				
//				///set model for detail page
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsDetailModel = new JSONModel();
				
				var consultantsDetailModel = new JSONModel();
				
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				
//				console.log("test");
				//1
				//read the Project table based on id
					oModel.read("/Consultants("+oArgs.consultantId+")", {
						  success: function(data){
							  consultantsDetailModel.setData(data);
//								var results = JSON.stringify(data);
//								console.log(results);
//								alert(results);
						  },
						  error: function(oError) {
							  alert("error");
							 }
						});
					//set the project detail model
					this.getView().setModel(consultantsDetailModel,"consultantsModel"); 
					
					
					//2
					//getting projects that the selected consultant is working on
					var consultantProjectsModel = new JSONModel();
					
//					console.log("ConsultantId: "+oArgs.consultantId);
					
					//
					oModel.read("/Assignments", {
						urlParameters: {
				            "$expand" : "ConsultantDetails",
				            "$expand" : "ProjectDetails"
				        },
						filters: [ new sap.ui.model.Filter({
					          path: "ConsultantDetails/Consultant_ID",
					          operator: sap.ui.model.FilterOperator.EQ,
					          value1: oArgs.consultantId
					     })],
						success: function(data){
							
							 var oData = JSON.stringify(data);

							consultantProjectsModel.setData(data);				

						  },
						 error: function(oError) {
							  alert("error");
						 	}
						});
					
					console.log(consultantProjectsModel);
					this.getView().setModel(consultantProjectsModel,"consultantProjectsModel");
			},

			_getDialog : function () {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("consultanttracker/Consultant-Tracker_Prototype-1/fragments/QuickView", this);
					this.getView().addDependent(this._oDialog);
				}
				return this._oDialog;
			},
			handleOpenDialog: function () {
				this._getDialog().open();
			},
			
			onPressed: function(oEvent){
				alert("hello world");
			},
			onExit: function () {
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
			}
	});

});