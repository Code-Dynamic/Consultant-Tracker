sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";
	var PROJECT_ID;
	var RatingIndicatorArr;
	var RatingResults;
	var RatingsErrTxt;	
	var ConsultantID;

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterConsultant", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.MasterManager
		 */
			onInit: function() {
				this.setDeviceType();
				if(sessionStorage){
					if (sessionStorage.getItem("ConsultantID") !== null) {
						this.onReloadPageSetup();
						}
					else{
						var oRouter = this.getRouter();
						oRouter.getRoute("MasterConsultant").attachMatched(this._onRouteMatched, this);
					}
				}else{
					var oRouter = this.getRouter();
					oRouter.getRoute("MasterConsultant").attachMatched(this._onRouteMatched, this);
				}
			},
			_onRouteMatched: function(oEvent){
				sessionStorage.ConsultantAdmin = false;
				this.ConsultantAdmin = false;
				var oArgs = oEvent.getParameter("arguments");
				var consultantID = this.setConsultantID(oArgs.consultantId);
				this.setAssignmentsModel(consultantID);
			},
			onReloadPageSetup: function(){	
				var consultantID = this.getConsultantID();
				this.setAssignmentsModel(consultantID);
			},
			selectFirstProject: function(){
				var oData = this.getView().getModel("assignmentsModel").getProperty("/results/0");
				var projectID = oData.ProjectDetails.Project_ID;				
				var projectCompleted = oData.ProjectDetails.Project_Completed;
				this.selectProjectById(projectID,projectCompleted);				
			},
			setAssignmentsModel : function(consultantID){
				var thisObj = this;
				//set model for master
				var oModel = this.getOwnerComponent().getModel("oModel");
				var assignmentsModel = new JSONModel();
				var consId = this.getConsultantID();
				console.log(consId);
				oModel.read("/Assignments", {
					urlParameters: {
			            "$expand" : "ConsultantDetails,ProjectDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: consId
				     })],
					async:false,
					success: function(data){
						 var oData = JSON.stringify(data);
						 for(var i =0; i<data.results.length; i++){
							 
								if (data.results[i].ProjectDetails.Project_Completed) {
									data.results[i].ProjectDetails.status = "Completed";
								} else {
									data.results[i].ProjectDetails.status = "In progress";
								}
						 }
						 assignmentsModel.setData(data);
						 if(!thisObj.isDeviceMobile()){
							 console.log("device is not Mobile");
							 if(data.results.length > 0){
								 thisObj.selectFirstProject();		 
							 }
						 }
					  },
					 error: function(oError) {
						  console.log("Error");
						  console.log(oError);
					 	}
					});
				this.getView().setModel(assignmentsModel,"assignmentsModel");					
			},
			setConsultantID: function(idFromRoute){
				if(sessionStorage){
					if (sessionStorage.getItem("ConsultantID") !== null) {
						return sessionStorage.ConsultantID;
						}
					else{
						sessionStorage.ConsultantID = idFromRoute;
						return idFromRoute;
					}
				}else{
					ConsultantID = idFromRoute;
					return idFromRoute;
				}				
			},
			onListItemPress: function (evt) {
				var sPath = evt.getSource().getBindingContext("assignmentsModel").getPath();
				var oData = this.getView().getModel("assignmentsModel").getProperty(sPath);
				var projectID = oData.ProjectDetails.Project_ID;				
				var projectCompleted = oData.ProjectDetails.Project_Completed;
				this.selectProjectById(projectID,projectCompleted);
			},
			selectProjectById : function (projectID,projectCompleted){
				PROJECT_ID = projectID;
				var consultantID = this.getConsultantID();
				this.getRouter().navTo("DetailConsultant",{listId:projectID,consultantId:consultantID});
				var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
				var thisObj = this;
				var oModel = this.getOwnerComponent().getModel("oModel");
				var filters = [];
				filters = [new sap.ui.model.Filter("ProjectDetails/Project_ID", sap.ui.model.FilterOperator.EQ, projectID),
					   new sap.ui.model.Filter("ConsultantDetails/Consultant_ID", sap.ui.model.FilterOperator.EQ, consultantID)];
				oModel.read("/Ratings_Entrys", {
					urlParameters: {
						"$expand": "ProjectDetails, ConsultantDetails"
					},
					filters: [ new sap.ui.model.Filter(filters,true)],
				     async:false,
				     success: function(oCreatedEn){
				    	 thisObj.ratingsBtnConfig(oCreatedEn,projectCompleted)
				     },
				     error: function(e){
				    	 console.log(e);
				     }
			 	});								
			},
		    onFeedbackPress: function(){
                this.getRouter().navTo("Feedback");
	        },
	        onSearchProject: function(oEvent) {
	    		
	            var searchString = this.getView().byId("projectSearchField").getValue();
	            this.searchProjects(searchString, "Consultant");
	            
	      	},
	      	onOpenPopover: function (oEvent) {
				// create popover
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.popoverMenu_CView", this);
					this.getView().addDependent(this._oPopover);
				}

				this._oPopover.openBy(oEvent.getSource());
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
				this.getRouter().navTo("DetailConsultant",{listId:2});
		}

	});

});
