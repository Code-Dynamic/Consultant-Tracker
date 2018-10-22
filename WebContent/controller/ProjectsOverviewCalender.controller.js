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
				var overviewModel = new JSONModel();
				oModel.read("/Projects", {
					  success: function(data){
						 var result = JSON.stringify(data);
						 overviewModel.setData(data);
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
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
				
				var oModel = this.getOwnerComponent().getModel("oModel");
				var sPath = oEvent.getSource().getBindingContext().getPath();
				var oData = this.getView().getModel().getProperty(sPath);
				var  oTaskId = oData.Task_ID;
				console.log(oData+ oTaskId);
				
				
				
				
			},
			handleAddTaskDialog: function () {
				
				this._oDialog2 = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.AddTask", this);
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
				
				var oEntry ={};
				oEntry.Description = taskDescription;
				oEntry.Due_Date = dueDate;
				oEntry.Name = name;
				
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
				if(this.isConsultantAdmin()){
		                this.getRouter().navTo("DetailAdmin",{projectId:projectId});
		        	}else{
		                this.getRouter().navTo("DetailConsultant",{projectId:projectId});

		        	}
			}
			

			

	});

});