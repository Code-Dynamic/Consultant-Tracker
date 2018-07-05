sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.Calender", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
			onInit: function() {
				
//				
				//getting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("Calender").attachMatched(this._onRouteMatched, this);
//			
//				var tasksModel = new JSONModel();
////				var query = '/Tasks?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%201';
////				var query = "/Tasks?$expand=ProjectDetails/";
//				var oModelTemp = new sap.ui.model.odata.v2.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc');
//				oModelTemp.read("/Tasks", {
//					urlParameters: {
////						
//			            "$expand" : "ProjectDetails",
//////			        "$filter" : "ProjectDetails/Project_ID eq '1'"
////						"$filter" : "Project_ID eq 1"
//			        },
//					filters: [ new sap.ui.model.Filter({
//				          path: "ProjectDetails/Project_ID",
//				          operator: sap.ui.model.FilterOperator.EQ,
//				          value1: 1
//				     }) ],
//					  success: function(data){
//						 var result = JSON.stringify(data);
//						 tasksModel.setData(data);
//						 alert(result);
//						 console.log(result);
//					  },
//					  error: function(oError) {
//						  alert("error");
//						 }
//					});
//				
////				console.log(projectsModel);
//				this.getView().setModel(tasksModel,"tasksModel");
				
//				
//				// create model
//				var oModel = new JSONModel();
//				oModel.setData({
//					startDate: new Date("2017", "0", "15", "8", "0"),
//					people: [
//						{
//							pic: "sap-icon://employee",
//							name: "Max Mustermann",
//							role: "team member"
//						},
//						{
//							pic: "sap-icon://employee",
//							name: "Mall Mann",
//							role: "team member"
//						},
//						{
//							pic: "sap-icon://employee",
//							name: "Mad Muster",
//							role: "team member"
//						}
//					]
//				});
//				this.getView().setModel(oModel);


			},

			_onRouteMatched: function(oEvent) {
				
				var oModelTemp = new sap.ui.model.odata.v2.ODataModel("http://localhost:8080/Consultant-Tracker/emplist.svc/");

			
				var oArgs = oEvent.getParameter("arguments");
				
				var oModel = this.getOwnerComponent().getModel("oModel");
				var tasksModel = new JSONModel();
				
				//read tasks that a client is assigned to on the selected project
				//todo: get tasks of employee in a project
				
//				var query = '/Tasks?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%201';
					
//				oModel.read("/Tasks", {
//					urlParameters: {
//			            "$expand" : "ProjectDetails"
//			        },
//					filters: [ new sap.ui.model.Filter({
//				          path: "ProjectDetails/Project_ID",
//				          operator: sap.ui.model.FilterOperator.EQ,
//				          value1: oArgs.projectId
//				     }) ],
//					  success: function(data){
//						 var result = JSON.stringify(data);
//						 tasksModel.setData(data);
////						 alert(result);
//						 console.log(result);
//					  },
//					  error: function(oError) {
//						  alert("error");
//						 }
//					});
//				
////				console.log(projectsModel);
//				this.getView().setModel(tasksModel);
				
				//get consultant_ID, tasks that the consultant is 
				//assigned to
				oModel.read("/Assigned_Tasks", {
					urlParameters: {
			            "$expand" : "ConsultantDetails",
			            "$expand" : "TaskDetails",
			            "$expand" : "TaskDetails/ProjectDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: 2
				     }) ,new sap.ui.model.Filter({
				          path: "TaskDetails/ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: oArgs.projectId
				     })],
					  success: function(data){
						 var result = JSON.stringify(data);
						 tasksModel.setData(data);
//						 alert(result);
						 console.log(result);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				
//				console.log(projectsModel);
				this.getView().setModel(tasksModel);	
			},	

			onNavBack: function(evt){
				this.getRouter()
					.navTo("DetailConsultant",
							{listId:1});
			}
			

			

	});

});