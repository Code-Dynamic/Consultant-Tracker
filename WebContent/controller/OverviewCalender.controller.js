sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.OverviewCalender", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
			onInit: function() {
				
//				
				//getting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("OverviewCalender").attachMatched(this._onRouteMatched, this);
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
//				
//				var oModelTemp = new sap.ui.model.odata.v2.ODataModel("http://localhost:8080/Consultant-Tracker/emplist.svc/");
//
//			
				var oArgs = oEvent.getParameter("arguments");
//				
				var oModel = this.getOwnerComponent().getModel("oModel");
				var tasksModel = new JSONModel();
//				
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
//						 console.log(result);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				
//				console.log(projectsModel);
				this.getView().setModel(tasksModel);	
				
			},	
			handleAppointmentCreate: function(){
				
			},
			handleAppointmentDrop: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment"),
					startDate = oEvent.getParameter("startDate"),
					endDate = oEvent.getParameter("endDate");

				MessageToast.show("Appointment '" + oAppointment.getId() + "' now starts at " + startDate + ".");

				oAppointment
					.setStartDate(startDate)
					.setEndDate(endDate);
				
				//update task time in the database
				var oModel = this.getOwnerComponent().getModel("oModel");
				
				var sPath = oEvent.getSource().getBindingContext().getPath();
				var oData = this.getView().getModel().getProperty(sPath);
				//NB as a manager you can view all projects under you
//				var oProjectId = evt.getSource().getBindingContext("projectsModel").getProperty("projectsModel>/Project_ID");
//				var model = evt.getSource("projectsModel");
//				console.log(oData.Project_ID);
				var  oTaskId = oData.Task_ID;
				console.log(oData+ oTaskId);
				
				
				
				
			},
			handleAddTaskDialog: function () {
				
				//create model to holde data from dialog
//				 var oModel = new JSONModel({
//		             name: ""
//		         });
//		         this.getView().setModel(oModel, "json");
				
				this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.AddTask", this);

//				this._oDialog.setModel(this.getView().getModel("projectsModel"),"addTaskModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);
				this._oDialog.open();
			},
			onSubmit: function(evt){
				
				
				var name = sap.ui.getCore().byId("name").getValue();
				
				var taskDescription = sap.ui.getCore().byId("taskDescription").getValue();
				var startDate = sap.ui.getCore().byId("startDate").getValue();
				var dueDate = sap.ui.getCore().byId("dueDate").getValue();
				var taskId=7;
				var projectId=1;
//				console.log(name + ":" + taskDescription + ":" + startDate + ":" + dueDate);
				
				var oEntry ={};
				oEntry.Description = taskDescription;
				oEntry.Due_Date = dueDate;
				oEntry.Name = name;
				
//				//getting project id
//				var oId = this.getView().getModel("projectsModel");
//				var oProjectId = oId.oData.Project_ID;
//				oEntry.Project_ID =oProjectId;
				
				
				if (this._oDialog) {
					this._oDialog.destroy();
				}
				
			},
			onClose: function () {
				if (this._oDialog) {
					this._oDialog.destroy();
				}
			},
			onNavBack: function(evt){
				var oModel = this.getView().getModel();
				//console.log(oModel);
				
				var projectId = oModel.oData.results[0].TaskDetails.ProjectDetails.Project_ID;
//				make provision for when there is no data
				
				
				  
	        	if(this.isConsultantAdmin()){
	               //this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
	                this.getRouter().navTo("DetailAdmin",{projectId:projectId});
	        	}else{
	                this.getRouter().navTo("DetailConsultant",{projectId:projectId});

	        	}
			}
			

			

	});

});