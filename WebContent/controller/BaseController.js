/*global history */
sap.ui.define([
		"sap/ui/core/mvc/Controller",

		"sap/ui/core/routing/History",
		"sap/m/MessageToast",
	], function (Controller, History,MessageToast) {
		"use strict";

		return Controller.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.BaseController", {
			/**
			 * Convenience method for accessing the router in every controller of the application.
			 * @public
			 * @returns {sap.ui.core.routing.Router} the router for this component
			 */
			getRouter : function () {
				return this.getOwnerComponent().getRouter();

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
		        	var timesEnteredTxt = new sap.m.MessageStrip({
		        		renderWhitespace:true,
		        		text:"You have already entered times for "+dateStr,
		        		type:sap.ui.core.MessageType.Warning,
		        		showIcon: true
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
 				        	 var timePicker ="";
 				        	 var timePickerId = "tp";
 				        	 var input ="";
 			        		 var vBox = new sap.m.VBox({
 			        			 });
 			        		 var hBox;
 			        		 var description;
 				        	 for(var i = 0; i < oResults.results.length; i++){
 				        		 hBox = new sap.m.FlexBox({
 				        			 alignItems: sap.m.FlexAlignItems.Center
 				        			 });			        		 
 				        		 timePicker = new sap.m.TimePicker({
 				        			 description: " ",
 				        			 fieldWidth: "80%",
 				        			 value:"00:00",
 				       				 valueFormat:"hh:mm",
 				       				 displayFormat:"HH:mm",
 				       				 minutesStep: 15
// 				       				 id:timePickerId+i
 				       				 
 				        		 }); 
 				        		timePicker.attachChange(function(oEvent){
 				        			 onLiveChangeTimesInput(this,oEvent);
 				        		 });
 				        		 description = new sap.m.Text({
 				        			 renderWhitespace: true,
 				        			 text:oResults.results[i].TaskDetails.Name
 				        		 });			        		 
 				        		 hBox.addItem(timePicker);
 				        		 hBox.addItem(description);
 				        		 vBox.addItem(hBox);	
 				        	 }
				        	timePicker = new sap.m.TimePicker({
 				        		description: " ",
 				        		fieldWidth: "80%",
 				        		value:"00:00",
 				       			valueFormat:"hh:mm",
 				       			displayFormat:"HH:mm",
 				       			minutesStep: 15
// 				       			id:timePickerId+"General"
 				        	}); 
					        timePicker.attachChange(function(oEvent){
	 				        		onLiveChangeTimesInput(this,oEvent);
	 				        	});
 			        		 description = new sap.m.Text({
 				        			 renderWhitespace: true,
 				        			 text:"General"
 				        		 });
 			        		 hBox = new sap.m.HBox({
 				        			 alignItems:sap.m.FlexAlignItems.Center
 				        	});	
 			        		hBox.addItem(timePicker);
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
 				         function onLiveChangeTimesInput(timePickerObj,oEvent){
 						        var newValue = timePickerObj.getValue();
 					            var maxNumberOfHoursPerDay = 10;
 					            if(newValue > maxNumberOfHoursPerDay || newValue < 0){
 					                oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
 							        var dateStr = getDateStr();
 					                totalHoursText.setText("-- :     Total Hours for "+dateStr);
 					            }
 					            else{
 					            	oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
 							        var pnlDom = dialog.getDomRef();
 							        var total = 0;
 							        var inputVal = 0;
 							        $(pnlDom).find('input').each(function(index, elem){
 							        	inputVal = masterDomObj.getInputFloat( $(elem)[0].value);
 							            total+= inputVal;            
 							            	
 							        });
 							        var dateStr = getDateStr();
 							        totalHoursText.setText(total.toFixed(2) + " :     Total Hours for " +dateStr);
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
		    	var masterDomObj = this;
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
			    	 	num = masterDomObj.getInputFloat($(elem)[0].value);
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
		    getInputFloat: function(inputVal){
	            var valsArr = inputVal.split(":");
	            var timesVal = parseFloat(valsArr[0]);
			       switch(valsArr[1]) {
			          case "00":  
			              break;
			          case "15":
			              timesVal += 0.25
			              break;
			          case "30":
			              timesVal += 0.5
			              break;
			          case "45":
			              timesVal += 0.75
			              break;	 							              
			      }	
			       return timesVal;
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
			goToProjects : function(selectFirstProject){
				var thisDomObj = this;
				var projectsModel = new sap.ui.model.json.JSONModel();
				var oModel = this.getOwnerComponent().getModel("oModel");
				
				//read projects
				oModel.read(
						"/Projects?$filter=Project_Deleted%20eq%20false",{
							success: function(data){ 
								for(var i=0; i<data.results.length; i++){
									if(data.results[i].Project_Completed){
										data.results[i].status = "Completed";
									}else{
										data.results[i].status = "In progress";
									}
								}
								projectsModel.setData(data);
								thisDomObj.getView().setModel(projectsModel,"projectsModel");
									if(data.results.length > 0){
										
										var resultsLocationStr;
										if(selectFirstProject){
											resultsLocationStr = "/results/0";
										}
										else{
											resultsLocationStr =  "/results/" + (data.results.length -1);
											console.log(resultsLocationStr);
										}
										var oData = thisDomObj.getView().getModel("projectsModel").getProperty(resultsLocationStr);
										var projectID = oData.Project_ID;				
										var projectCompleted = oData.Project_Completed;
										thisDomObj.selectProjectByID(projectID,projectCompleted);	
								}
							},	
							error: function(){
								console.log("Error");}
								}		
				);
			
			},
			 selectProjectByID : function(projectID,projectCompleted){
				 var consultantID = this.getConsultantID();
					this.getRouter()
					.navTo("DetailAdmin", 
						{projectId:projectID});
				//RATINGS CODE
				//TODO Ngoni: check with Mamba hw to get odata model address
				var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
				var thisObj = this;
				attachModel.read(
						"/Ratings_Entrys?$expand=ProjectDetails,ConsultantDetails&$filter=ProjectDetails/Project_ID%20eq%20"+projectID+"%20and%20ConsultantDetails/Consultant_ID%20eq%20"+consultantID,{async:false,success: function(oCreatedEn){ ratingsBtnConfig(oCreatedEn) }, error: function(e){console.log(e);}}		
						);					
				function ratingsBtnConfig(oResults){
					var ratingsBtnConfigModel;
					//user has already given a rating for the project
					if(oResults.results.length > 0){
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
						    visible: false,
						    enabled: false
						});
					} //project is completed, rating not yet given
					else if(projectCompleted === true) {
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
							    visible: true,
							    enabled: true
							});
					} //project not yet completed
					else{
						ratingsBtnConfigModel = new sap.ui.model.json.JSONModel({
						    visible: true,
						    enabled: false
						});
					}
					thisObj.getView().setModel(ratingsBtnConfigModel,"ratingsBtnConfig");				
				}
				
				//TODO fix project progress
				$.post('getProjectProgress',{Project_Id:projectID},function(responseText){
					var progress = {percVal:0,displayVal:0};
					progress.percVal = parseFloat(responseText);
					progress.displayVal = responseText;
			          var progressModel = new sap.ui.model.json.JSONModel();
			          progressModel.setData(progress);
		/*	          console.log(progressModel);*/
			          thisObj.getView().setModel(progressModel,"progressModel");
				});				
				
			},
			goToConsultants : function(oEvt){
				var oModel = this.getOwnerComponent().getModel("oModel");
				var consultantsModel = new sap.ui.model.json.JSONModel();
				var thisDomObj = this;
				//read consultant data
				oModel.read("/Consultants",{
							success: function(data){ 
								consultantsModel.setData(data);
								thisDomObj.getView().setModel(consultantsModel,"consultantsModel");	
								if(data.results.length > 0){
									var oData = thisDomObj.getView().getModel("consultantsModel").getProperty("/results/0");
									var consultantID = oData.Consultant_ID;				
									thisDomObj.selectConsultantByID(consultantID);	
								}
							},
								
							error: function(){
								console.log("Error");}
								}		
				);
			},
			selectConsultantByID : function(consultantID){
				this.getRouter()
				.navTo("DetailConsultantView", 
					{consultantId:consultantID});				
			}
			,
			onMasterIconTabFilterSelect: function(oEvent) {
	            var key =oEvent.getParameters().key;
	            if(key === 'projectsSelect') {
	            	var firstProjectSelected = true;
	              this.goToProjects(firstProjectSelected);
	            }
	            else if(key == 'consultantsSelect') {
	              this.goToConsultants();
	            };
	        },	
			searchProjects : function(oEvt){
				var thisDomObj = this;
				var projectsModel = new sap.ui.model.json.JSONModel();
				var oModel = this.getOwnerComponent().getModel("oModel");
				var searchString = arguments[0];
				
				//read projects
				oModel.read(
						"/Projects",{
							filters: [ new sap.ui.model.Filter({
								path: "Project_Name",
								operator: sap.ui.model.FilterOperator.Contains,
								value1: searchString
								}) 
							],
							
							success: function(data){
								//console.log(data);
								projectsModel.setData(data);
								thisDomObj.getView().setModel(projectsModel,"projectsModel");
								if(data.results.length > 0){
									var firstItem = thisDomObj.getView().byId("projectsList").getItems()[0];
									//saved projectID in m
									 //thisDomObj.selectProjectByID(firstItem.getNumber());	
										var oData = thisDomObj.getView().getModel("projectsModel").getProperty("/results/0");
										var projectID = oData.Project_ID;				
										var projectCompleted = oData.Project_Completed;
										thisDomObj.selectProjectByID(projectID,projectCompleted);											 
								}
							},
								
							error: function(){
								console.log("Error");}
						}		
				);
			
			},
			searchConsultants : function(oEvt){
				var searchString = arguments[0];
				var oModel = this.getOwnerComponent().getModel("oModel");
				var consultantsModel = new sap.ui.model.json.JSONModel();
				
				//read consultant data
				oModel.read("/Consultants",
						{
							filters: [ new sap.ui.model.Filter({
								path: "Consultant_Name",
								operator: sap.ui.model.FilterOperator.Contains,
								value1: searchString
							}) ],
						
							success: function(data){ 
								consultantsModel.setData(data);
								//console.log(data);
								},
								
							error: function(){
								console.log("Error");}
								}		
				);
				
				this.getView().setModel(consultantsModel,"consultantsModel");	
			
			},
			/**
			 * Convenience method for getting the view model by name in every controller of the application.
			 * @public
			 * @param {string} sName the model name
			 * @returns {sap.ui.model.Model} the model instance
			 */
			getModel : function (sName) {
				return this.getView().getModel(sName);
			},

			/**
			 * Convenience method for setting the view model in every controller of the application.
			 * @public
			 * @param {sap.ui.model.Model} oModel the model instance
			 * @param {string} sName the model name
			 * @returns {sap.ui.mvc.View} the view instance
			 */
			setModel : function (oModel, sName) {
				return this.getView().setModel(oModel, sName);
			},

			/**
			 * Convenience method for getting the resource bundle.
			 * @public
			 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
			 */
			getResourceBundle : function () {
				return this.getOwnerComponent().getModel("i18n").getResourceBundle();
			},

			/**
			 * Event handler for navigating back.
			 * It there is a history entry or an previous app-to-app navigation we go one step back in the browser history
			 * If not, it will replace the current entry of the browser history with the master route.
			 * @public
			 */
			onNavBack : function() {
				var sPreviousHash = History.getInstance().getPreviousHash(),
					oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");

					if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
					history.go(-1);
				} else {
					this.getRouter().navTo("master", {}, true);
				}
			}

		});

	}
);