sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global'

	], function(BaseController,JSONModel,Controller,jQuery) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailConsultant", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.DetailConsultant
		 */
			onInit: function() {
				
				//geting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("DetailConsultant").attachMatched(this._onRouteMatched, this);
			
			},
			
			_onRouteMatched: function(oEvent) {
				
//				///set model for detail page
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsDetailModel = new JSONModel();
				
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				
				//1
				//read the Project table based on id
					oModel.read("/Projects("+oArgs.listId+")", {
						urlParameters: {
				            "$expand" : "ClientDetails",
				        },
						  success: function(data){
							   projectsDetailModel.setData(data);
//								var results = JSON.stringify(data);
//								console.log(results);
//								alert(results);
						  },
						  error: function(oError) {
							  alert("error");
							 }
						});
					//set the project detail model
					this.getView().setModel(projectsDetailModel,"projectsModel"); 
					
					
					//2
					//get Team members for the selected Project (from master)
					var membersDetailModel = new JSONModel();	
					oModel.read("/Assignments", {
						urlParameters: {
							"$expand" : "ProjectDetails",
							"$expand" : "ConsultantDetails"
				        },
						filters: [ new sap.ui.model.Filter({
					          path: "ProjectDetails/Project_ID",
					          operator: sap.ui.model.FilterOperator.EQ,
					          value1: oArgs.listId
					     })],
							  success: function(data){
								   membersDetailModel.setData(data);
									var results = JSON.stringify(data);
									console.log(results);
//									alert(results);
							  },
							  error: function(oError) {
								  alert("error");
								 }
							});
//						set the project detail model
						this.getView().setModel(membersDetailModel,"membersModel"); 

					//3
					//get all tasks that a client is assigned to for the selected Project (from master)
								
					
			},	

			openCalender: function(evt){
				
				//get model of DetailConsultant controller
				var oModel = this.getView().getModel("projectsModel");
				
				//get Project_ID to pass to the calender view
				var oListId = oModel.oData.Project_ID;
				this.getRouter()
					.navTo("Calender", 
						{listId:oListId, projectId:oListId});

			},
			
			onPressed: function(oEvent){
				alert("hello world");
			}
	});

});