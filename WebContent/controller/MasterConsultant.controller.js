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
//				http://localhost:8080/Consultant-Tracker/emplist.svc/Assigned_Tasks?$expand=ConsultantDetails,TaskDetails,TaskDetails/ProjectDetails&$filter=ConsultantDetails/Consultant_ID%20eq%202

				//getting id from the URL
				//console.log("function called");
				//this.printOnPage();
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
				
				//console.log(oRouter);
				//TODO Ngoni discuss with Mamba:_onRouteMatched f() not called when reloading
			},
			_onRouteMatched: function(oEvent){
				//console.log("route matched");
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

				oModel.read("/Assignments", {
					urlParameters: {
			            "$expand" : "ConsultantDetails",
			            "$expand" : "ProjectDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,

				          value1: consultantID
				     })],
					success: function(data){
						 var oData = JSON.stringify(data);
						 assignmentsModel.setData(data);
						 //console.log(data);
						 if(data.results.length > 0)
							 thisObj.selectFirstProject();

					  },
					 error: function(oError) {
						  alert("error");
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
				/*/results/0*/
				var sPath = evt.getSource().getBindingContext("assignmentsModel").getPath();
				//console.log(sPath);
				var oData = this.getView().getModel("assignmentsModel").getProperty(sPath);

				var projectID = oData.ProjectDetails.Project_ID;				
				var projectCompleted = oData.ProjectDetails.Project_Completed;
				this.selectProjectById(projectID,projectCompleted);

			},
			selectProjectById : function (projectID,projectCompleted){
				//TODO Ngoni: consult Mamba, save project ID in model instead of using global
				PROJECT_ID = projectID;
				var consultantID = this.getConsultantID();
				this.getRouter()
					.navTo("DetailConsultant", 
						{listId:projectID,
						consultantId:consultantID});
				//MessageToast.show("Pressed : " + evt.getSource().getTitle());
				//console.log("project completed: "+this.getView().getModel().getProperty("Project_ID"));
				//console.log("project completed: "+this.getView().getModel("projectsModel").getPath());
				//RATINGS CODE
				//TODO Ngoni: check with Mamba hw to get odata model address
				var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
				var thisObj = this;
				//console.log(projectCompleted);
				attachModel.read(
						"/Ratings_Entrys?$expand=ProjectDetails,ConsultantDetails&$filter=ProjectDetails/Project_ID%20eq%20"+projectID+"%20and%20ConsultantDetails/Consultant_ID%20eq%20"+consultantID,{async:false,success: function(oCreatedEn){ ratingsBtnConfig(oCreatedEn) }, error: function(e){console.log(e);}}		
						);					
				function ratingsBtnConfig(oResults){
					var ratingsBtnConfigModel;
					//user has already given a rating for the project
					if(oResults.results.length > 0){
						//console.log("Ratings entered");
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
						    visible: false,
						    enabled: false
						});
					} //project is completed, rating not yet given
					else if(projectCompleted === true) {
						//console.log("project is completed, rating not yet given");
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
							    visible: true,
							    enabled: true
							});
					} //project not yet completed
					else{
						//console.log("project not completed");
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
						    visible: true,
						    enabled: false
						});
					}
					thisObj.getView().setModel(ratingsBtnConfigModel,"ratingsBtnConfig");
					
				}				
			},
			onRateTeam: function(){
		    	this._ratingsDialog = this.byId("ratingsDialog");
		    	var dialog = this._ratingsDialog;
		    	dialog.setEscapeHandler(this.onDialogPressEscape);
		    	var consultantID = this.getConsultantID();
		    	//var projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
		    	var projectID = PROJECT_ID;
		    	var query = "/Assignments?$expand=ProjectDetails,ConsultantDetails&$filter=ConsultantDetails/Consultant_ID%20ne%20"+consultantID+"%20and ProjectDetails/Project_ID%20eq%20"+projectID;

			     var oModel =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
			     oModel.read(query,{success: function(oData){ addMembers(oData) 
			 					}, error: function(){console.log("Error");}}		
			 	 );
			 	 var totalHoursText;
			 	 	 RatingIndicatorArr = [];	
			         //return all consultants
			         function  addMembers(oResults) {
			        	 RatingResults = oResults;
			        	 var ratingInd ="";
			        	 var user = "";
			        	 var vBox = new sap.m.VBox();
			        	 var hBox;
			        	 for(var i = 0; i < oResults.results.length; i++){
			        		 hBox = new sap.m.HBox({
			        			 alignItems:sap.m.FlexAlignItems.Center
			        			 })
			        		 ratingInd = new sap.m.RatingIndicator();
			        		 RatingIndicatorArr.push(ratingInd);
			        		 user = new sap.m.Text({
			        			 renderWhitespace: true,
			        			 text:"\t"+ oResults.results[i].ConsultantDetails.Consultant_Name
			        		 });
			        		 hBox.addItem(ratingInd);
			        		 hBox.addItem(user);
			        		 vBox.addItem(hBox);
			        	 }
			        	 RatingsErrTxt = new sap.m.Text({
		        			 renderWhitespace: true,
		        			 text:""
		        		 });
			        	 vBox.addItem(RatingsErrTxt);
			        	 dialog.addContent(vBox);
			         }
		    	
		    	dialog.open();
			},
			onSubmitRates: function(){
				var detailDom = this;
				var projectID = PROJECT_ID;
				var consultantID = this.getConsultantID();
		    	var resultsString = "";
			 	for(var i = 0; (i < RatingResults.results.length); i++){
			 		var rate = RatingIndicatorArr[i].getValue();
			 		if(rate === 0){
			 			RatingsErrTxt.setText("Please give each member a rating of at least 1 star");
			 			return;
			 		}
			 		if(resultsString.length > 0 )
			 			resultsString +=",";
			 		resultsString +=  RatingResults.results[i].ConsultantDetails.Consultant_ID + ":"+rate;
			 	}
			 	//console.log(resultsString);
			    	$.post('EnterConsultantRatings', { ratingResults:resultsString, projectID:projectID, consultantID: consultantID},function(responseText) {  
			    		//var array = responseText.split(';');
			    		MessageToast.show(responseText);
			    	    detailDom.onRatingsDialogClose();
							var ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
							    visible: false,
							    enabled: false
							});
						sap.ui.getCore().setModel(ratingsBtnConfigModel,"ratingsBtnConfig");
		    	});			


		    },
		    onRatingsDialogClose: function(){
		    	this._ratingsDialog.removeAllContent();
		    	this._ratingsDialog.close();
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