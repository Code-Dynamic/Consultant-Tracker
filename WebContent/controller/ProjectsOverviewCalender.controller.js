sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.ProjectsOverviewCalender", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
			onInit: function() {
				
				var oModel = this.getOwnerComponent().getModel("oModel");
				//getting id from the URL
				var overviewModel = new JSONModel();
				oModel.read("/Projects", {
					  success: function(data){
						 var result = JSON.stringify(data);
						 overviewModel.setData(data);
//						 console.log(result);
//						 console.log("tasksModel" +oArgs.projectId);
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
				
//				console.log(projectsModel);
				this.getView().setModel(overviewModel,"projectsOverviewModel");
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
				
				this._oDialog2 = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.AddTask", this);

//				this._oDialog.setModel(this.getView().getModel("projectsModel"),"addTaskModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog2);
				this._oDialog2.open();
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
				//make provision for when there is no data
				
		
				//this.getRouter().navTo("DetailAdmin",{projectId:1});
				if(this.isConsultantAdmin()){
		               //this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
		                this.getRouter().navTo("DetailAdmin",{projectId:projectId});
		        	}else{
		                this.getRouter().navTo("DetailConsultant",{projectId:projectId});

		        	}
			}
			

			

	});

});