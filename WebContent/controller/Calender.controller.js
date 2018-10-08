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
				//getting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("Calender").attachMatched(this.onRouteMatched, this);


			},

			onRouteMatched: function(oEvent) {
				
				var oModelTemp = new sap.ui.model.odata.v2.ODataModel(this.getModelAddress());

			
				var oArgs = oEvent.getParameter("arguments");
				
				var oModel = this.getOwnerComponent().getModel("oModel");
				var tasksModel = new JSONModel();
				console.log("in Calender: "+oArgs.consultantId);
				//get consultant_ID, tasks that the consultant is 
				//assigned to
				oModel.read("/Assigned_Tasks", {
					urlParameters: {
			            "$expand" : "ConsultantDetails",
			            "$expand" : "TaskDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: oArgs.consultantId
				     }) ,new sap.ui.model.Filter({
				          path: "TaskDetails/ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: oArgs.projectId
				     })],
					  success: function(data){
						 var result = JSON.stringify(data);
						 tasksModel.setData(data);
						 console.log("results: "+result);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				
//				console.log(projectsModel);
				this.getView().setModel(tasksModel);	
			},	
			handleAppointmentSelect: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment");
				if (oAppointment) {
					MessageBox.show("Appointment selected: " + oAppointment.getTitle());
				} else {
					var aAppointments = oEvent.getParameter("appointments");
					var sValue = aAppointments.length + " Appointments selected";
					MessageBox.show(sValue);
				}
			},

			handleSelectionFinish: function(oEvent) {
				var aSelectedKeys = oEvent.getSource().getSelectedKeys();
				this.getView().byId("PC1").setBuiltInViews(aSelectedKeys);
			},
			onNavBack: function(evt){

				var oModel = this.getView().getModel();
//				
				var projectId = oModel.oData.results[0].TaskDetails.ProjectDetails.Project_ID;
				//make provision for when there is no data
				this.getRouter()
					.navTo("DetailConsultant",
							{listId:projectId});

			},
			toggleDayNamesLine: function (oEvent) {
				var oPC = this.byId("PC1");
				oPC.setShowDayNamesLine(!oPC.getShowDayNamesLine());
			},
			
			//Start---Mobile view code
            onNavBack: function(oEvent){
                
            	if(this.isConsultantAdmin()){
                    this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
            	}else{
                    this.getRouter().navTo("MasterConsultant",{consultantId:this.getConsultantID()});

            	}
            },
            //End---Mobile view code
			

	});

});