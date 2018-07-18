sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global',
		'sap/ui/core/Fragment',

	], function(BaseController,JSONModel,Controller,jQuery,Fragment) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailConsultantView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.DetailConsultant
		 */
			onInit: function() {
				
				//geting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("DetailConsultantView").attachMatched(this._onRouteMatched, this);				
			
			},
			onAfterRendering: function(){
				//sets utilization selects to current year and month
				this.setUpUtilizationOptions();

				
			},
			setUpUtilizationOptions: function(){
				var date = new Date();
				var year = date.getFullYear();
				var monthNum = date.getMonth();
				var month = this.getMonthStr(monthNum);
				this.byId("utilizationYearInput").setValue(year);
				//TODO display previous month utilization
				var selectedItemID = "month" + monthNum;
				//console.log(selectedItemID);
				this.byId("utilizationMonthSelect").setSelectedItem( this.byId(selectedItemID));				
			},
			_onRouteMatched: function(oEvent) {
				
//				///set model for detail page
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsDetailModel = new JSONModel();
				
				var consultantsDetailModel = new JSONModel();
				
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				
//				console.log("test");
				//1
				//read the Project table based on id
					oModel.read("/Consultants("+oArgs.consultantId+")", {
						  success: function(data){
							  consultantsDetailModel.setData(data);
//								var results = JSON.stringify(data);
//								console.log(results);
//								alert(results);
						  },
						  error: function(oError) {
							  alert("error");
							 }
						});
					//set the project detail model
					this.getView().setModel(consultantsDetailModel,"consultantsModel"); 
					
					
					//2
					//getting projects that the selected consultant is working on
					var consultantProjectsModel = new JSONModel();
					
//					console.log("ConsultantId: "+oArgs.consultantId);
					
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

							consultantProjectsModel.setData(data);				

						  },
						 error: function(oError) {
							  alert("error");
						 	}
						});

					this.getView().setModel(consultantProjectsModel,"consultantProjectsModel");
					
					//UTILIZATION CODE
					var date = new Date();
					var year = date.getFullYear();
					var monthNum = date.getMonth();
					var month = this.getMonthStr(monthNum);
					this.getUtilization(oArgs.consultantId,month,year,this);		
					//RATINGS CODE
					this.setUpRating(oArgs.consultantId,this);					
					
			},
			getMonthStr: function(num){
				var month = new Array();
				month[0] = "January";
				month[1] = "February";
				month[2] = "March";
				month[3] = "April";
				month[4] = "May";
				month[5] = "June";
				month[6] = "July";
				month[7] = "August";
				month[8] = "September";
				month[9] = "October";
				month[10] = "November";
				month[11] = "December";
				return month[num];		
			},
			getUtilization: function(c_ID, monthVal, yearVal, thisObj){
			    	$.post('getConsultantUtilization', { Consultant_ID:c_ID ,month:monthVal, year:yearVal},function(responseText) {  
			    		var hoursArr = responseText.split(',');
			    		//console.log(hoursArr);
			  		  var oModel = new sap.ui.model.json.JSONModel({
						  utilization: [{
						    "category": "Assigned Tasks",
						    "hours": parseInt(hoursArr[0])
						}, {
						    "category": "General",
						    "hours": parseInt(hoursArr[1])
						}, {
						    "category": "Unnaccounted",
						    "hours": parseInt(hoursArr[2])
						}]
						});
			  		thisObj.getView().setModel(oModel,"utilization");	
				});			
			},
			setUpRating: function(userID,thisObj){
				//console.log(userID);
		    	var query = "/Ratingss?$expand=ProjectDetails,ConsultantDetails&$filter=ConsultantDetails/Consultant_ID%20eq%20"+userID;

			     var oModel =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
			     oModel.read(query,{success: function(oData){ setRatingsModel(oData) 
			 					}, error: function(error){console.log("Error: "+ error.message);}}		
			 	 );		
			     
			    	function setRatingsModel(oData){
						//console.log(oData);
						var oModel = new sap.ui.model.json.JSONModel();
						for(var i = 0; i < oData.results.length; i++){
							oData.results[i].Rating = parseFloat(oData.results[i].Rating);
						}
						oModel.setData(oData);
						//console.log(JSON.parse(JSON.stringify(arrConsultants)));
						thisObj.getView().setModel(oModel,"ratings");
					}	     
			     
			     
			},
			onUtilizationMonthChange: function(oEvent){
				var c_ID = this.byId("utilizationMonthSelect").getName();
				var month = oEvent.getParameters().selectedItem.getText();
				var year = this.byId("utilizationYearInput").getValue();
				this.getUtilization(c_ID,month, year,this);
			},
			onUtilizationYearLiveChange:function(oEvent){
				var c_ID = this.byId("utilizationMonthSelect").getName();
		        var year = oEvent.getParameter("newValue");
		        var minAcceptableYear = 2018;
		        if(year < minAcceptableYear){
		            oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);	   
		        }
		        else{
		        	oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
		        	var month = this.byId("utilizationMonthSelect").getSelectedItem().getText();
		        	this.getUtilization(c_ID, month, year,this);
		        }		
			},
			_getDialog : function () {
				if (!this._oDialog) {
					this._oDialog = sap.ui.xmlfragment("consultanttracker/Consultant-Tracker_Prototype-1/fragments/QuickView", this);
					this.getView().addDependent(this._oDialog);
				}
				return this._oDialog;
			},
			handleOpenDialog: function () {
				this._getDialog().open();
			},
			
			onPressed: function(oEvent){
				alert("hello world");
			},
			onExit: function () {
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
			}
	});

});