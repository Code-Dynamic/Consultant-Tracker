sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller) {
	"use strict";
	//TODO Ngoni change code to prevent use of globals
	var PROJECT_ID;
	var RatingIndicatorArr;
	var RatingResults;
	var RatingsErrTxt;
	
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
				
				if(sessionStorage){
					sessionStorage.ConsultantID = oArgs.consultantId;;
				}else{
					ConsultantID = oArgs.consultantId;
				}
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
				//console.log("called");
			
				var projectID = evt.getSource().getBindingContext().getProperty("ProjectDetails/Project_ID");
				//TODO Ngoni: consult Mamba, save project ID in model instead of using global
				PROJECT_ID = projectID;
				var consultantID = this.getConsultantID();
				this.getRouter()
					.navTo("DetailConsultant", 
						{listId:projectID,
						consultantId:consultantID});
				MessageToast.show("Pressed : " + evt.getSource().getTitle());
				
				//RATINGS CODE
				//TODO Ngoni: check with Mamba hw to get odata model address
				var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
				var projectCompleted = evt.getSource().getBindingContext().getProperty("ProjectDetails/Project_Completed");
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
			onRequestUserTimes : function(){
				var consultantID = this.getConsultantID();		
		    	this._Dialog = this.byId("timesDialog");
		    	var dialog = this._Dialog;
		    	dialog.setEscapeHandler(this.onDialogPressEscape);
		    	var masterDomObj = this;
		    	var taskCompleted = false;
 		    	$.post('CheckDailyTimesEntered', { Consultant_ID:consultantID},function(timesEnteredBool) {
		    		if(parseInt(timesEnteredBool)){
		    			timesEnteredAlready();
		    		}else{
		    			setupUserTimes();
		    		}
 		    	});				      
		    	function timesEnteredAlready(){
		    		masterDomObj.byId("submitUserTimesBtn").setEnabled(false);
		    		var dateStr = getDateStr();
		        	var timesEnteredTxt = new sap.m.Text({
		        		renderWhitespace:true,
		        		text:"You have already entered times for "+dateStr,
		        	});		        	 
		        	dialog.addContent(timesEnteredTxt);			        	    		
		    	}
 		    	function setupUserTimes(){
 		    		masterDomObj.byId("submitUserTimesBtn").setEnabled(true);
 			    	var oModel =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
 			    	var query = "/Assigned_Tasks?$expand=TaskDetails,ConsultantDetails&$filter=ConsultantDetails/Consultant_ID%20eq%20"+consultantID+"%20and%20Task_Completed%20eq%20"+taskCompleted;
 			    	
 				     oModel.read(query,{success: function(oData){ addInputs(oData) 
 				 					}, error: function(){console.log("Error");}}		
 				 	 );
 				 	 var totalHoursText;

 				         //return all consultants
 				         function  addInputs(oResults) {	        	 
 				        	 var input ="";
 			        		 var vBox = new sap.m.VBox({
 			        			 });
 			        		 var hBox;
 			        		 var description;
 				        	 for(var i = 0; i < oResults.results.length; i++){
 				        		 hBox = new sap.m.FlexBox({
 				        			 alignItems: sap.m.FlexAlignItems.Center
 				        			 });			        		 
 				        		 input = new sap.m.Input({
 				        			 description: " ",
 				        			 fieldWidth: "80%",
 				        			 maxLength: 3,
 				        			 type: "Number",
 				        			 placeholder: "0.0"
 				        		 }); 
 				        		 input.attachLiveChange(function(oEvent){
 				        			 onLiveChangeTimesInput(this,oEvent);
 				        		 })
 				        		 description = new sap.m.Text({
 				        			 renderWhitespace: true,
 				        			 text:oResults.results[i].TaskDetails.Name
 				        		 });			        		 
 				        		 hBox.addItem(input);
 				        		 hBox.addItem(description);
 				        		 vBox.addItem(hBox);	
 				        	 }
 			        		 input = new sap.m.Input({
 			        			 description: " ",
 			        			 fieldWidth: "80%",
 			        			 maxLength: 3,
 			        			 type: "Number",
 			        			 placeholder: "0.0"
 			        		 });
 			        		 input.attachLiveChange(function(oEvent){
 			        			 onLiveChangeTimesInput(this,oEvent);
 			        		 })
 			        		 description = new sap.m.Text({
 				        			 renderWhitespace: true,
 				        			 text:"General"
 				        		 });
 			        		 hBox = new sap.m.HBox({
 				        			 alignItems:sap.m.FlexAlignItems.Center
 				        	});	
 			        		hBox.addItem(input);
 				        	hBox.addItem(description);
 				        	vBox.addItem(hBox);
 			        		var dateStr = getDateStr();
 			        		totalHoursText = new sap.m.Text({
 			        			 renderWhitespace:true,
 			        			 text:" 0.0 Total Hours for "+dateStr,
 			        		 });
 			        		vBox.addItem(totalHoursText);			        	 
 			        		dialog.addContent(vBox);			        	 
 			        		 
 				        }
 				         // checks if numbers entered in each input field are valid and also updates total
 				         function onLiveChangeTimesInput(inputObj,oEvent){
 						        var newValue = oEvent.getParameter("newValue");
 					            var maxNumberOfHoursPerDay = 10;
 					            if(newValue > maxNumberOfHoursPerDay || newValue < 0){
 					                inputObj.setValueState(sap.ui.core.ValueState.Error);
 							        var dateStr = getDateStr();
 					                totalHoursText.setText("-- :     Total Hours for "+dateStr);
 					            }
 					            else{
 					            	inputObj.setValueState(sap.ui.core.ValueState.Success);
 							        var pnlDom = dialog.getDomRef();
 							        var total = 0;
 							        var inputVal = 0;
 							        $(pnlDom).find('input').each(function(index, elem){
 							        	inputVal = Number($(elem)[0].value);
 							            if( isNumeric(inputVal))
 							            	total+= inputVal;
 							        });
 							        var dateStr = getDateStr();
 							        totalHoursText.setText(total + " :     Total Hours for " +dateStr);
 					            }
 				         }

 				         //checks if value is numeric
 				         function isNumeric(n) {
 				        	  return !isNaN(parseFloat(n)) && isFinite(n);
 				        	}				    		
 		    	}
		         
		         function getDateStr(){
		        	 var today = new Date();
		        	 var dd = today.getDate();
		        	 var mm = masterDomObj.getMonthStr(today.getMonth());
		        	 var year = today.getFullYear();

		        	 if(dd<10) {
		        	     dd = '0'+dd
		        	 } 
		        	 return dd +" "+ mm + " " + year;		        	 
		         }
			         
			     this._Dialog.open();
				 
		    },
		    onSubmitTimes: function(){
				var consultantID;
				if(sessionStorage){
					consultantID = sessionStorage.ConsultantID;
				}else{
					consultantID = ConsultantID;
				}	
				//query for tasks that are not yet completed
		    	var taskCompleted = false;
		    	var query = "/Assigned_Tasks?$expand=TaskDetails,ConsultantDetails&$filter=ConsultantDetails/Consultant_ID%20eq%20"+consultantID+"%20and Task_Completed%20eq%20"+taskCompleted;

			     var oModel =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
			     oModel.read(query,{success: function(oData){ submitTimes(oData) 
			 					}, error: function(error){console.log("Error: "+ error);}}		
			 	 );		    	
		    
			 	 var pnlDom = this._Dialog.getDomRef();
			 	 var inputArr = [];
			 	 var totalTasks = 0;
			 	 var num;
			     $(pnlDom).find('input').each(function(index, elem){
			    	 	num = Number($(elem)[0].value);
			            inputArr.push(num);  
			            totalTasks += num;
			        });
			     var general = inputArr.pop();
			     totalTasks -= general;
			 	 function submitTimes(oResults){
			 		 //TODO Ngoni, improve function, make more efficient by sending through 1 post request with all the data
		        	 for(var i = 0; (i < oResults.results.length && i < (inputArr.length -1)); i++){
		        		 if(inputArr[i] > 0){
			        		 var time = Number(oResults.results[i].Hours_Worked) + inputArr[i];
				 		    	$.post('EnterTaskTimes', { Assigned_Task_ID:oResults.results[i].Assigned_Task_ID, Hours_Worked:time},function(responseText) {  
						    		//console.log(responseText);
					    	});			 
		        		 }
		        	 }
		 		    	$.post('EnterDailyTimes', { Consultant_ID:consultantID, general:general, totalTasks:totalTasks},function(responseText) {
		 		    		MessageToast.show(responseText);
			    	});				        	 
		        	 
			 	 }  	
		        this.onDialogClose();		    	
		    },
		    onDialogClose: function(){
		        this._Dialog.removeAllContent();
		    	this._Dialog.close();
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
			onDialogPressEscape: function(e){
				//TODO study promises and close dialog when escape key is pressed
/*				console.log(this._Dialog);
				this.byId("timesDialog").close();
				e.resolve().then(function(){
					console.log("thenable");
					this.onDialogClose();
				});*/
				
			},
			getConsultantID: function(){
				if(sessionStorage){
					return sessionStorage.ConsultantID;
				}else{
					return ConsultantID;
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