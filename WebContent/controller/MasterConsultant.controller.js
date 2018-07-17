sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterConsultant", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
			onInit: function() {
//				http://localhost:8080/Consultant-Tracker/emplist.svc/Assigned_Tasks?$expand=ConsultantDetails,TaskDetails,TaskDetails/ProjectDetails&$filter=ConsultantDetails/Consultant_ID%20eq%202
				//geting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("MasterConsultant").attachMatched(this._onRouteMatched, this);
				

			},
			_onRouteMatched: function(oEvent){
				
				var oArgs = oEvent.getParameter("arguments");
				
				//set model for master
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsModel = new JSONModel();
				
//				console.log("ConsultantId: "+oArgs.consultantId);
				
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

						projectsModel.setData(data);				

					  },
					 error: function(oError) {
						  alert("error");
					 	}
					});
				
//				console.log(projectsModel);
				this.getView().setModel(projectsModel);

			},

			onListItemPress: function (evt) {
			
				var oListId = evt.getSource().getBindingContext().getProperty("ProjectDetails/Project_ID");
				
				this.getRouter()
					.navTo("DetailConsultant", 
						{listId:oListId,
						consultantId:2});
//				console.log(sListId);
				MessageToast.show("Pressed : " + evt.getSource().getTitle());
			},
			
	
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
		//	onExit: function() {
		//
		//	}
		goToDetail: function(){
				this.getRouter()
					.navTo("DetailConsultant",
							{listId:2});
		}

	});

});