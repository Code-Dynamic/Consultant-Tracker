sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global',
		'sap/ui/core/Fragment',

	], function(BaseController,JSONModel,Controller,jQuery,Fragment) {
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
				
				//for timepicker
				// for the data binding example do not use the change event for check but the data binding parsing events
				sap.ui.getCore().attachParseError(
					function(oEvent) {
						var oElement = oEvent.getParameter("element");

						if (oElement.setValueState) {
							oElement.setValueState(sap.ui.core.ValueState.Error);
						}
					});

				sap.ui.getCore().attachValidationSuccess(
					function(oEvent) {
						var oElement = oEvent.getParameter("element");

						if (oElement.setValueState) {
							oElement.setValueState(sap.ui.core.ValueState.None);
						}
					});
				
				this._iEvent = 0;
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
//									console.log(results);
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
								
						//get consultant_ID, tasks that the consultant is 
						//assigned to
						var tasksDetailModel = new JSONModel();
						oModel.read("/Assigned_Tasks", {
							urlParameters: {
					            "$expand" : "ConsultantDetails",
					            "$expand" : "TaskDetails",
					            "$expand" : "TaskDetails/ProjectDetails"
					        },
							filters: [ new sap.ui.model.Filter({
						          path: "ConsultantDetails/Consultant_ID",
						          operator: sap.ui.model.FilterOperator.EQ,
						          value1: oArgs.consultantId
						     }) ,new sap.ui.model.Filter({
						          path: "TaskDetails/ProjectDetails/Project_ID",
						          operator: sap.ui.model.FilterOperator.EQ,
						          value1: oArgs.listId
						     })],
							  success: function(data){
								 var result = JSON.stringify(data);
								 tasksDetailModel.setData(data);
//								 alert(result);
//								 console.log("tasksModel" +result);
							  },
							  error: function(oError) {
								  alert("error");
								 }
							});
						
//						console.log(projectsModel);
						this.getView().setModel(tasksDetailModel,"tasksModel");
			},

			handleMemberRatingDialog: function (oEvent) {
				
				//get id of selected list item(consultantId)
//				var oListId = oEvent.getSource().getBindingContext().getProperty("membersModel>ConsultantDetails/Consultant_ID");
				
				
				var sPath = oEvent.getSource().getBindingContext("membersModel").getPath();
				var oData = this.getView().getModel("membersModel").getProperty(sPath);
				
				var consultantId = oData.ConsultantDetails.Consultant_ID;
				
				
				//
				var oModel = this.getOwnerComponent().getModel("oModel");
				
				var consultantDetailModel = new JSONModel();
				oModel.read("/Consultants", {
					
					filters: [ new sap.ui.model.Filter({
				          path: "Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: consultantId
				     })],
					  success: function(data){
						 var result = JSON.stringify(data);
						 consultantDetailModel.setData(data);
//						 alert(result);
						 console.log("oModel" +result);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				
				this.getView().setModel(consultantDetailModel,"consultantModel");
				
				this.memberRating_oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.MemberRatingDialog", this);

				this.memberRating_oDialog.setModel(this.getView().getModel("consultantModel"),"consultantModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.memberRating_oDialog);
				this.memberRating_oDialog.open();
				
			},
			openCalender: function(oEvent){
				
				//get model of DetailConsultant controller
				var oModel = this.getView().getModel("projectsModel");
				console.log(oModel);
				//get Project_ID to pass to the calender view
				var oListId = oModel.oData.Project_ID;
				this.getRouter()
					.navTo("Calender", 
						{listId:oListId, projectId:oListId});

			},
			
			onPressed: function(oEvent){
				alert("hello world");
			},
			onSubmit: function () {
//				if (this._oDialog) {
//					this._oDialog.destroy();
//				}
			},
			onClose: function () {
				if (this.timeEntry_oDialog) {
					this.timeEntry_oDialog.destroy();
				}else if(this.memberRating_oDialog){
					this.memberRating_oDialog.destroy();
				}
			},
			handleTimeEntry: function(oEvent){
				this.timeEntry_oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.TimeEntry", this);
				
//				console.log(this.getView().getModel("tasksModel"));
				this.timeEntry_oDialog.setModel(this.getView().getModel("tasksModel"),"tasksModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.timeEntry_oDialog);
				this.timeEntry_oDialog.open();
			},
			handleChange: function (oEvent) {
				var oText = this.byId("T1");
				var oTP = oEvent.oSource;
				var sValue = oEvent.getParameter("value");
				var bValid = oEvent.getParameter("valid");
				this._iEvent++;
//				oText.setText("Change - Event " + this._iEvent + ": TimePicker " + oTP.getId() + ":" + sValue);

				if (bValid) {
					oTP.setValueState(sap.ui.core.ValueState.None);
				} else {
					oTP.setValueState(sap.ui.core.ValueState.Error);
				}
				
				console.log("HH: "+sValue+"MM: "+bValid)
			},
			onExit: function () {
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
			}
	});

});