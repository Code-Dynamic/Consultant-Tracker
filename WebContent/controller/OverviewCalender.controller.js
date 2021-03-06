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
				//getting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("OverviewCalender").attachMatched(this._onRouteMatched, this);

			},
			_onRouteMatched: function(oEvent) {
				var oArgs = oEvent.getParameter("arguments");
				var oModel = this.getOwnerComponent().getModel("oModel");
				var tasksModel = new JSONModel();	
				//get consultant_ID, tasks that the consultant is 
				//assigned to
				oModel.read("/Assigned_Tasks", {
					urlParameters: {
			            "$expand" : "ConsultantDetails,TaskDetails,TaskDetails/ProjectDetails"
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
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
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
				var  oTaskId = oData.Task_ID;
			},
			handleAddTaskDialog: function () {
				this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.AddTask", this);
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
				var oEntry ={};
				oEntry.Description = taskDescription;
				oEntry.Due_Date = dueDate;
				oEntry.Name = name;
				//getting project id
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
				var projectId = oModel.oData.results[0].TaskDetails.ProjectDetails.Project_ID;
				//make provision for when there is no data
	        	if(this.isConsultantAdmin()){
	                this.getRouter().navTo("DetailAdmin",{projectId:projectId});
	        	}else{
	                this.getRouter().navTo("DetailConsultant",{projectId:projectId});

	        	}
			}
	});

});