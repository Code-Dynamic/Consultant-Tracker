sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global',
		'sap/ui/core/Fragment',
		"sap/m/MessageToast"
	], function(BaseController,JSONModel,Controller,jQuery,Fragment,MessageToast) {
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
							  console.log("Consultants error: "+ oError.message);
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
							 console.log("Assignments Model: "+ oError.message);
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
					var date = new Date();
					var year = date.getFullYear();
					var monthNum = date.getMonth();
					if(monthNum == 0){
						monthNum = 11;
					}
					var prevMonth = this.getMonthStr(monthNum -1);				
			    	$.post('GetConsultantUtilization', { Consultant_ID:c_ID ,month:monthVal, year:yearVal},function(responseText) {  
			    		var hoursArr = responseText.split(',');
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
						}],"prevMonthUtilization": parseInt(hoursArr[3]),
						"prevMonth": prevMonth
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
						var oModel = new sap.ui.model.json.JSONModel();
						var totalRating = 0;
						var resultsLen = oData.results.length;
						var numRatingsWithVotes = 0;
						for(var i = 0; i < resultsLen; i++){
							oData.results[i].Rating = parseFloat(oData.results[i].Rating);
							//only add rating if there are some votes
							if(oData.results[i].Rating > 0){
								totalRating += oData.results[i].Rating;
								numRatingsWithVotes++;
							}
						}
						var avgRating = 0;
						if(resultsLen > 0)
							avgRating = totalRating /numRatingsWithVotes;
						if(numRatingsWithVotes == 1)
							oData.avgRating = avgRating + "% ("+numRatingsWithVotes+ " Project)";
						else
							oData.avgRating = avgRating + "% ("+numRatingsWithVotes+ " Projects)";
						oModel.setData(oData);
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
			},	addConsultant: function(){
				 this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultant",this);
				 this._Dialog.open();
			
		},   
	    onSubmitConsultant : function() {
	    	var thisDomObj = this;
	    	var oConsultant = {
					 Consultant_Name : "none",
					 Consultant_Surname : "none",
					 Consultant_email : "none",
					 Consultant_Cell : "none"				
				};
	    	
	    	var _Name = sap.ui.getCore().byId("c_Name").getValue();
	    	var _Surname = sap.ui.getCore().byId("c_Surname").getValue();
	    	var _email = sap.ui.getCore().byId("c_email").getValue();
	    	var _Cell = sap.ui.getCore().byId("c_Cell").getValue();
	    	var t = this;
	    	var oDataProjects =   new sap.ui.model.odata.v2.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
	    	var x=	oDataProjects.createEntry('/Consultants',{
				properties:{
					//Client_Details:{},
					Consultant_Admin:0,
					Consultant_Cell: _Cell,
					Consultant_Name: _Name,
					Consultant_Surname: _Surname,
					Consultant_email:_email},
					async:false,
				created:function(){
					MessageToast.show("Consultant Created Succesfully");
					thisDomObj.goToConsultants();
					oDataProjects.submitChanges({async:false});
					},
				sucesss: function(){ console.log(("posting Project(sucess) It Worked!!")); }
				, error:function(){console.log("Error in posting Project");}
	    	});
	    	
	    	//close model
			this.onClose();
	    },
		onClose: function () {
			if (this._Dialog) {
				this._Dialog.destroy();
			}
		}
	    
	});

});