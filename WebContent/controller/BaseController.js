/*global history */
var recognizing;
var recognition;
var ConsultantAdmin;
var DeviceIsMobile;
var RatingsBtn = false;
sap.ui.define([ 
	"sap/ui/core/mvc/Controller","sap/ui/core/routing/History", 
	"sap/m/MessageToast",
	"consultanttracker/Consultant-Tracker_Prototype-1/model/formatter" 
	],
	function(Controller, History, MessageToast, formatter) {
	"use strict";
		var AssignedTaskIDArr = [];
		var recognition = new webkitSpeechRecognition();
		recognition.lang = 'en-GB';
		// recognition.interimResults = true;
		recognizing = false;
		// console.log("initialised");

		var AssignedTaskIDArr = [];
		var RatingIndicatorArr;
		var RatingResults;
		var RatingsErrTxt;
		var view;

		return Controller.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.BaseController",{
		formatter : formatter,
		/**
		 * Convenience method for accessing the
		 * router in every controller of the
		 * application.
		 * 
		 * @public
		 * @returns {sap.ui.core.routing.Router}
		 *          the router for this
		 *          component
		 */
		getRouter : function() {
			return this.getOwnerComponent().getRouter();
		},
		getModelAddress : function() {
			//return "http://196.249.12.186:8080/Consultant-Tracker/emplist.svc/";
			return 'http://localhost:8080/Consultant-Tracker/emplist.svc/';
			},
		setDeviceType: function(){
			if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
			|| /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
				DeviceIsMobile = true;
			}
			else{
					DeviceIsMobile = false;
			}
		},
		isDeviceMobile: function(){
			return DeviceIsMobile;
		},
		getStartOfDayUTC : function(date) {
			var x = Date.UTC(
					date.getFullYear(), date.getMonth(), date.getDate());
					return x;
		},
		onRequestUserTimes : function() {
			var consultantID = this.getConsultantID();
			var currentDate = new Date();
			// sends date value that represents
			// beginning of any day to enable
			// easy comparison in database
			var dayBeginUTC = this.getStartOfDayUTC(currentDate);
			this.getTaskAndTimes(consultantID,dayBeginUTC);
		},
		getTaskAndTimes : function(ConsultantID, UTC) {
			var thisDomObj = this;
			this._Dialog = this.byId("timesDialog");
			var dialog = this._Dialog;
			dialog.setEscapeHandler(this.onDialogPressEscape);
			$.post('GetTimesAndTasks',{
				Consultant_ID : ConsultantID,
				UTC : UTC
			},
			function(timesAndTasksArr) {
				var dataArr = timesAndTasksArr.split(",");
				var taskNamesArr = [];
				var taskTimesArr = [];
				var data = [];
				for (var i = 0; i < dataArr.length; i++) {
					data = dataArr[i].split(":");
					taskNamesArr.push(data[0]);
					taskTimesArr.push(parseFloat(data[1]));
					AssignedTaskIDArr.push(parseInt(data[2]));
				}
				thisDomObj.setupUserTimes(taskNamesArr,taskTimesArr,UTC)
				thisDomObj._Dialog.open();
			});
		},
		setupUserTimes : function(taskNamesArr,taskTimesArr, UTC) {
			var thisDomObj = this;
			this._EnterTimesUTC = UTC;
			var consultantID = this.getConsultantID();
			this.byId("submitUserTimesBtn").setEnabled(true);
			var totalHoursText;
			var timePicker = "";
			var timePickerId = "tp";
			var input = "";
			var vBox = new sap.m.VBox();
			var hBox;
			var datePicker;
			var description;
			var today = new Date();
			hBox = new sap.m.FlexBox({
				alignItems : sap.m.FlexAlignItems.Center
			});
			datePicker = new sap.m.DatePicker({
				description : " ",
				fieldWidth : "80%",
				dateValue : new Date(UTC),
				maxDate : today
			// id:timePickerId+i
			});
			datePicker.attachChange(function(oEvent) {
				onLiveChangeEnterTimesDate(this, oEvent);
			});
			description = new sap.m.Text({
				renderWhitespace : true,
				text : " Date"
			});
			hBox.addItem(datePicker);
			hBox.addItem(description);
			vBox.addItem(hBox);
			var totalTime = 0;
			for (var i = 0; i < taskNamesArr.length; i++) {
				totalTime += taskTimesArr[i];
				hBox = new sap.m.FlexBox({
					alignItems : sap.m.FlexAlignItems.Center
				});
				timePicker = new sap.m.TimePicker({
					description : " ",
					fieldWidth : "80%",
					value : taskTimesArr[i],
					valueFormat : "hh:mm",
					displayFormat : "HH:mm",
					minutesStep : 15
				// id:timePickerId+i
				});
				timePicker.attachChange(function(oEvent) {
					onLiveChangeTimesInput(this,oEvent);
				});
				description = new sap.m.Text({
					renderWhitespace : true,
					text : " " + taskNamesArr[i] + "\t"
				});
				hBox.addItem(timePicker);
				hBox.addItem(description);
				vBox.addItem(hBox);
			}
			var dateStr = this.getDateStr(new Date(UTC));
			totalHoursText = new sap.m.MessageStrip({
				renderWhitespace : true,
				text : " " + totalTime.toFixed(2) + " Total Hours for " + dateStr,
				type : sap.ui.core.MessageType.Success
			});
			vBox.addItem(totalHoursText);
			this._Dialog.addContent(vBox);
			// checks if numbers entered in each
			// input field are valid and also
			// updates total
			function onLiveChangeTimesInput(timePickerObj, oEvent) {
				var newValue = timePickerObj.getValue();
				var newDate = datePicker.getDateValue();
				var maxNumberOfHoursPerDay = 10;
				if (newValue > maxNumberOfHoursPerDay || newValue < 0) {oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				} else {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Success);
				}
				var pnlDom = thisDomObj._Dialog.getDomRef();
				var total = 0;
				var inputVal = 0;
				$(pnlDom).find('input').each(function(index,elem) {
					// first element has date
					if (index > 0) {
						inputVal = thisDomObj.getInputFloat($(elem)[0].value);
						total += inputVal;
					}
				});
				var dateStr = thisDomObj.getDateStr(newDate);
				if (total >= 24) {
					totalHoursText.setType(sap.ui.core.MessageType.Error);
				} else if (total >= 12) {
					totalHoursText.setType(sap.ui.core.MessageType.Warning);
				}
				totalHoursText.setText(" " + total.toFixed(2) + " :     Total Hours for " + dateStr);
			}

			function onLiveChangeEnterTimesDate(datePickerObj, oEvent) {
				var newDate = datePickerObj.getDateValue();
				thisDomObj._Dialog.removeAllContent();
				AssignedTaskIDArr = [];
				// sends date value that represents beginning of any day to enable easy comparison in database
				var dayBegin = thisDomObj .getStartOfDayUTC(newDate);
				thisDomObj.getTaskAndTimes(consultantID, dayBegin);
			}
		},
		getDateStr : function(date) {
			var dd = date.getDate();
			var mm = this.getMonthStr(date.getMonth());
			var year = date.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}
			return dd + " " + mm + " " + year;
		},
		onSubmitTimes : function() {
			var thisDomObj = this;
			var consultantID;
			if (sessionStorage) {
				consultantID = sessionStorage.ConsultantID;
			} else {
				consultantID = ConsultantID;
			}
	
			var pnlDom = this._Dialog.getDomRef();
			var inputArr = [];
			var num;
			$(pnlDom).find('input').each(function(index,elem) {
				if (index > 0) {
					num = thisDomObj
							.getInputFloat($(elem)[0].value);
					inputArr
							.push(num);
				}
			});
			var resultsString = "";
			for (var i = 0; i < AssignedTaskIDArr.length; i++) {
				if (inputArr[i] > 0) {
					if (resultsString.length > 0)
						resultsString += ",";
					resultsString += AssignedTaskIDArr[i] + ":" + inputArr[i];
				}
			}
			// -1 represents general
			$.post('EnterTaskTimes',{
				userTimes : resultsString,
				Consultant_ID : consultantID,
				dayBeginUTC : this._EnterTimesUTC
			},
			function(responseText) {
				// console.log(responseText);
				AssignedTaskIDArr = [];
				MessageToast.show(responseText);
			});
			thisDomObj._Dialog.removeAllContent();
			this.onDialogClose();
		},
		getInputFloat : function(inputVal) {
			var valsArr = inputVal.split(":");
			var timesVal = parseFloat(valsArr[0]);
			switch (valsArr[1]) {
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
		onDialogClose : function() {
			this._Dialog.removeAllContent();
			this._Dialog.close();
		},
		getMonthStr : function(num) {
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
		onDialogPressEscape : function(e) {
			// TODO study promises and close
			// dialog when escape key is pressed
			/*
			 * console.log(this._Dialog);
			 * this.byId("timesDialog").close();
			 * e.resolve().then(function(){
			 * console.log("thenable");
			 * this.onDialogClose(); });
			 */

		},
		getConsultantID : function() {
			if (sessionStorage) {
				return sessionStorage.ConsultantID;
			} else {
				return ConsultantID;
			}
		},
		isConsultantAdmin: function(){
			if(sessionStorage){
				if(sessionStorage.ConsultantAdmin == "true"){
					return true;
				} 
				else{
					return false;
				}
				
			}else{
				if(ConsultantAdmin == "true"){
					return true;
				} 
				else{
					return false;
				}
				
			}						
		},
		goToProjects : function(selectFirstProject) {
			//if no argument is passed to function, a project is not opened
			var numArguments = arguments.length;
			var thisDomObj = this;
			var projectsModel = new sap.ui.model.json.JSONModel();
			var oModel = this.getOwnerComponent().getModel("oModel");
			// read projects
			oModel.read("/Projects?$filter=Project_Deleted%20eq%20false",{
				success : function(data) {
					for (var i = 0; i < data.results.length; i++) {
						if (data.results[i].Project_Completed) {
							data.results[i].status = "Completed";
						} else {
							data.results[i].status = "In progress";
						}
					}
					
					projectsModel.setData(data);
					thisDomObj.getView().setModel(projectsModel,"projectsModel");
					if (data.results.length > 0) {
						var resultsLocationStr;
						if (selectFirstProject) {
							resultsLocationStr = "/results/0";
						} else {
							resultsLocationStr = "/results/" + (data.results.length - 1);
							// console.log(resultsLocationStr);
						}
						//only open project if there is more than 1 argument
						if(numArguments > 0){
							var oData = thisDomObj.getView().getModel("projectsModel").getProperty(resultsLocationStr);
							var projectID = oData.Project_ID;
							var projectCompleted = oData.Project_Completed;
							thisDomObj.selectProjectByID(projectID,projectCompleted);	
						} else {
							sap.ui.core.BusyIndicator.hide();
						}
					}
				},
				error : function() {
				// console.log("Error");
				}
			});
		},
		selectProjectByID : function(projectID, projectCompleted) {
			var consultantID = this.getConsultantID();
//			if(view == "Admin"){
				this.getRouter().navTo(
					"DetailAdmin", {
						projectId : projectID
					});
			/*}else if(view == "Consultant"){
				this.getRouter().navTo(
						"DetailConsultant", {
							projectId : projectID
						});
			}*/
			// RATINGS CODE
			var thisObj = this;
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read("/Ratings_Entrys", {
				urlParameters: {
					"$expand": "ProjectDetails, ConsultantDetails"
				},
				filters: [ new sap.ui.model.Filter({
			          path: "ProjectDetails/Project_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: projectID,
			          path: "ConsultantDetails/Consultant_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: consultantID
			     })],
			     async:false,
			     success: function(oCreatedEn){
			    	 thisObj.ratingsBtnConfig(oCreatedEn,projectCompleted)
			     },
			     error: function(e){
			    	 console.log(e);
			     }
			});
			// project view
			$.post('getProjectProgress',{
				Project_Id : projectID
			},
			function(responseText) {
				var progress = {
					percVal : 0,
					displayVal : 0
				};
				progress.percVal = parseFloat(responseText);
				progress.displayVal = responseText;
				var progressModel = new sap.ui.model.json.JSONModel();
				progressModel.setData(progress);
				/* console.log(progressModel); */
				thisObj.getView().setModel(progressModel,"progressModel");
			});
		},
		ratingsBtnConfig : function(oResults,projectCompleted){
			if(RatingsBtn){
				if(oResults.results.length > 0){
					this.ratingsBtnDisabled();
				} //project is completed, rating not yet given
				else if(projectCompleted === true) {
					RatingsBtn.setEnabled(true);
					this.showRatingsBtn();
				} //project not yet completed
				else {
					RatingsBtn.setEnabled(false);
					this.showRatingsBtn();
				}
			}
		}, 
		ratingsBtnDisabled: function(){
			RatingsBtn.setEnabled(false);
			RatingsBtn.setText("Ratings Entered");
			RatingsBtn.setIcon("sap-icon://complete");	
		},	 
		showRatingsBtn: function(){
			RatingsBtn.setVisible(true);
			RatingsBtn.setText("Rate Team");
			RatingsBtn.setIcon("sap-icon://favorite");	
		},
		onRateTeam: function(){
			this._ratingsDialog = this.byId("ratingsDialog");
			var dialog = this._ratingsDialog;
			//console.log(dialog);
			dialog.setEscapeHandler(this.onDialogPressEscape);
	    	var consultantID = this.getConsultantID();
	    	var oModel = this.getView().getModel("projectsModel");
			var projectID = oModel.oData.Project_ID;
//	    	var query = "/Assignments?$expand=ProjectDetails,ConsultantDetails&$filter=ConsultantDetails/Consultant_ID%20ne%20"+consultantID+"%20and ProjectDetails/Project_ID%20eq%20"+projectID;
//		     var oModel =  new sap.ui.model.odata.ODataModel(this.getModelAddress());
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read("/Ratings_Entrys", {
				urlParameters: {
					"$expand": "ProjectDetails, ConsultantDetails"
				},
				filters: [ new sap.ui.model.Filter({
					path: "ProjectDetails/Project_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1: projectID,
			        path: "ConsultantDetails/Consultant_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1: consultantID
			     })],
			     success: function(oData){ 
			    	 addMembers(oData) 
		 		 },
		 		 error: function(){
		 			 console.log("Error");
		 			 }
		 	});
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
	    	var oModel = this.getView().getModel("projectsModel");
			var projectID = oModel.oData.Project_ID;
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
		    	detailDom.ratingsBtnDisabled();
	    	});			
	    },
	    onRatingsDialogClose: function(){
	    	this._ratingsDialog.removeAllContent();
			this._ratingsDialog.close();
		},
		goToConsultants : function(oEvt) {
			var oModel = this.getOwnerComponent().getModel("oModel");
			var consultantsModel = new sap.ui.model.json.JSONModel();
			var consultantID =  this.getConsultantID();
			var thisDomObj = this;
			// read consultant data
			var dialog = new sap.m.BusyDialog();
			dialog.open();	
			oModel.read("/Consultants",{
				urlParameters :{
					"$expand" : "User_TypeDetails"
				},
				filters: [ new sap.ui.model.Filter({
			        path: "Consultant_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1:consultantID  
				})],
				success: function(odata){
					console.log(odata.results);
					if (odata.results[0].User_TypeDetails.User_Type_Id == 100){
						oModel.read( "/Consultants", {
							urlParameters: {
								"$expand" : "User_TypeDetails"
							},
							filters: [ new sap.ui.model.Filter({
						        path: "User_TypeDetails/User_Type_Id",
						        operator: sap.ui.model.FilterOperator.NE,
						        value1:100 
							})],
							success: function(data){ 
								consultantsModel.setData(data);
								thisDomObj.getView().setModel(consultantsModel,"consultantsModel");	
								if(data.results.length > 0){
									var oData = thisDomObj.getView().getModel("consultantsModel").getProperty("/results/0/");
									var consultantID = oData.Consultant_ID;				
									thisDomObj.selectConsultantByID(consultantID);	
								}
								dialog.close();
							},
					    	error: function(){
					    		dialog.close();
					    		console.log("Error");
					    	}
					 	});
					}else{
						oModel.read( "/Team_Entitys", {
							urlParameters:{
								"$expand": "TeamDetails/ConsultantDetails,ConsultantDetails"
							},
						    filters: [ new sap.ui.model.Filter({
							        path: "TeamDetails/ConsultantDetails/Consultant_ID",
							        operator: sap.ui.model.FilterOperator.EQ,
							        value1:consultantID
							})],
							success: function(data){ 
								consultantsModel.setData(data);
								thisDomObj.getView().setModel(consultantsModel,"consultantsModel");	
								if(data.results.length > 0){
									var oData = thisDomObj.getView().getModel("consultantsModel").getProperty("/results/0/ConsultantDetails");
									var consultantID = oData.Consultant_ID;				
									thisDomObj.selectConsultantByID(consultantID);	
								}
								dialog.close();
							},
					    	error: function(){
					    		dialog.close();
					    		console.log("Error");
					    	}
					 	});
					}
				},
				error: function(error){
					console.log("failed to read data");
				}
			});
		},
		selectConsultantByID : function(consultantID) {
			this.getRouter().navTo("DetailConsultantView",{
				consultantId : consultantID
			});
		},
		onMasterIconTabFilterSelect : function(oEvent) {
			var key = oEvent.getParameters().key;
			if (key === 'projectsSelect') {
				if(this.isDeviceMobile()){
					this.goToProjects
				} else {
					var firstProjectSelected = true;
					this.goToProjects(firstProjectSelected);	
				}
				
			} else if (key == 'consultantsSelect') {
				this.goToConsultants();
			}
		},
		searchProjects : function(oEvt) {
			var thisDomObj = this;
			var oModel = this.getOwnerComponent().getModel("oModel");
			var projectsModel = new sap.ui.model.json.JSONModel();
			var assignmentsModel = new sap.ui.model.json.JSONModel();
			var searchString = arguments[0];
			view = arguments[1];
			
			if(view == "Admin"){
				// read projects
				oModel.read("/Projects", {
					filters : [ new sap.ui.model.Filter(
					{
						path : "Project_Name",
						operator : sap.ui.model.FilterOperator.Contains,
						value1 : searchString
					})],
					success : function(data) {
						// console.log(data);
						projectsModel.setData(data);
						thisDomObj.getView().setModel(projectsModel,"projectsModel");
						if (data.results.length == 0) {
							// console.log("List empty");
							thisDomObj.getView().byId("projectsList").setNoDataText("No projects with the phrase \"" + searchString + "\"");
						} else if (data.results.length > 0) {
							// saved projectID in m
							// thisDomObj.selectProjectByID(firstItem.getNumber());
							if(!thisDomObj.isDeviceMobile()){
								var oData = thisDomObj.getView().getModel("projectsModel").getProperty("/results/0");
								var projectID = oData.Project_ID;
								var projectCompleted = oData.Project_Completed;
								thisDomObj.selectProjectByID(projectID,projectCompleted);
							}
						}
					},
					error : function() {
						// console.log("Error");
					}
				});
			}else if(view == "Consultant"){
				oModel.read("/Assignments", {
					urlParameters: {
			            "$expand" : "ConsultantDetails,ProjectDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,

				          value1: thisDomObj.getConsultantID()
				     }),
				     new sap.ui.model.Filter({
							path : "ProjectDetails/Project_Name",
							operator : sap.ui.model.FilterOperator.Contains,
							value1 : searchString
					})],
					async:false,
					success: function(data){
						// console.log(data);
						assignmentsModel.setData(data);
						thisDomObj.getView().setModel(assignmentsModel,"assignmentsModel");
						if (data.results.length == 0) {
							// console.log("List empty");
							thisDomObj.getView().byId("listId").setNoDataText("No projects with the phrase \""+ searchString+ "\"");
						} else if (data.results.length > 0) {
							// saved projectID in m
							// thisDomObj.selectProjectByID(firstItem.getNumber());
							if(!thisDomObj.isDeviceMobile()){
								var oData = thisDomObj.getView().getModel("assignmentsModel").getProperty("/results/0");
								var projectID = oData.Project_ID;
								var projectCompleted = oData.Project_Completed;
								thisDomObj.selectProjectByID(projectID,projectCompleted);
							}
						}
					  },
					 error: function(oError) {
						  console.log("Error");
						  console.log(oError);
					 	}
				});
			}
		},
		searchConsultants : function(oEvt) {
			var thisDomObj = this;
			var searchString = arguments[0];
			var oModel = this.getOwnerComponent().getModel("oModel");
			var consultantsModel = new sap.ui.model.json.JSONModel();
			var filters = [];
			filters = [new sap.ui.model.Filter("Consultant_Name", sap.ui.model.FilterOperator.Contains, searchString),
					   new sap.ui.model.Filter("Consultant_Surname", sap.ui.model.FilterOperator.Contains, searchString)];
			// read consultant data
			oModel.read("/Consultants",{
				filters: [new sap.ui.model.Filter(filters, false)],
				success : function(data) {
					consultantsModel.setData(data);
					if (data.results.length == 0) {
						// console.log("Listempty");
						thisDomObj.getView().byId("consultants").setNoDataText("No consultants with the phrase \"" + searchString + "\"");
					}
					// console.log(data);
				},
				error : function() {
					// console.log("Error");
				}
			});
			this.getView().setModel(consultantsModel, "consultantsModel");
		},
		/**
		 * Convenience method for getting the
		 * view model by name in every
		 * controller of the application.
		 * 
		 * @public
		 * @param {string}
		 *            sName the model name
		 * @returns {sap.ui.model.Model} the
		 *          model instance
		 */
		getModel : function(sName) {
			return this.getView().getModel(
					sName);
		},

		/**
		 * Convenience method for setting the
		 * view model in every controller of the
		 * application.
		 * 
		 * @public
		 * @param {sap.ui.model.Model}
		 *            oModel the model instance
		 * @param {string}
		 *            sName the model name
		 * @returns {sap.ui.mvc.View} the view
		 *          instance
		 */
		setModel : function(oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},
		/**
		 * Convenience method for getting the
		 * resource bundle.
		 * 
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel}
		 *          the resourceModel of the
		 *          component
		 */
		getResourceBundle : function() {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		/**
		 * Event handler for navigating back. It
		 * there is a history entry or an
		 * previous app-to-app navigation we go
		 * one step back in the browser history
		 * If not, it will replace the current
		 * entry of the browser history with the
		 * master route.
		 * 
		 * @public
		 */
		onNavBack : function() {
			var sPreviousHash = History.getInstance().getPreviousHash(), oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
			if (sPreviousHash !== undefined || !oCrossAppNavigator.isInitialNavigation()) {
				history.go(-1);
			} else {
				this.getRouter().navTo("master", {}, true);
			}
		},
		TestMicrophone: function(){
			var thisPtr = this;	
			recognition.onresult = function (event) {
				console.log('onResult');
//				console.log(event);
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						MessageToast.show(event.results[i][0].transcript);
						thisPtr.ProcessVoiceResults(event.results[i][0].transcript);
						recognition.stop();
						reset();
					}
				}
			}
		
			//Handle error
			recognition.onerror = function(event){
				console.log("onerror", event);
			}
			// Housekeeping after success or failed parsing
			recognition.onend = function(e){ 
				console.log("Stopping Recording");
				reset();
			}
			console.log('start/stop');
			if (recognizing) {
				navigator.webkitGetUserMedia({audio:true},function(e){console.log(e);}, function(e) {
					console.log('Error getting audio');
					console.log(e);
				});
				recognition.stop();
				reset();
		} else {
			var btn1 = sap.ui.getCore().byId("__component0---MasterAdmin--microphoneButton-img");
			var btn2 = sap.ui.getCore().byId("__component0---MasterConsultant--microphoneButton-img");
			if(btn1!=null)
				btn1.setProperty("color","#ef6161");
			if(btn2!=null)
				btn2.setProperty("color","#ef6161");
			console.log("starting");
			recognition.start();
			recognizing = true;
		}
		function reset() {
			var btn1 = sap.ui.getCore().byId("__component0---MasterAdmin--microphoneButton-img");
			var btn2 = sap.ui.getCore().byId("__component0---MasterConsultant--microphoneButton-img");
			if(btn1!=null)
				btn1.setProperty("color","##cae4fb");
			if(btn2!=null)
				btn2.setProperty("color","##cae4fb");
			console.log("Resetting");
			recognizing = false;
		}
	},
	ProcessVoiceResults : function(text){	
		text = text.toLowerCase();
		var textArray = text.split(" ");
		console.log("processing "+ textArray);
		//Search projects
		// accepts syntax "search x","search for x","search project(s) for x","search project(s) x"
		if(textArray[0] == "search"){
			
			var whoToSearch ='p';
			textArray = textArray.slice(1);
			if(textArray[0] == "projects" || textArray[0] == "project"){
				textArray = textArray.slice(1);
				whoToSearch ='p';
			}
			if(textArray[0] == "consultants" || textArray[0] == "consultant"){
				textArray = textArray.slice(1);
				whoToSearch ='c';
			}
			if(textArray[0] == "for" )
				textArray = textArray.slice(1);
//			else	
//				textArray = textArray.slice(1);
			
			textArray = textArray.join(" ");
			console.log(textArray);
			if(whoToSearch =='p'){
				
				this.getView().byId("iconTabBar").setSelectedKey("projectsSelect");
				
				this.getView().byId("projectSearchField").setValue(textArray);
				this.searchProjects(textArray, view);
				
			}else if(whoToSearch =='c'){
				
				this.getView().byId("iconTabBar").setSelectedKey("consultantsSelect");
				
				this.getView().byId("consultantSearchField").setValue(textArray);
				this.searchConsultants(textArray);
			}
				
			
		}
		// create project command
		else if(textArray[0] == "create" && (textArray[1] == "project" ||textArray[1] == "projects")){
			this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddProject",this);
			this._oDialog.open();	
		}
		//create consultant command
		else if(textArray[0] == "create" && (textArray[1] == "consultant" ||textArray[1] == "consultant")){	
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultant",this);
			this._Dialog.open();
		}
		//Show relvant item commands (Tasks Due)
		else if(textArray[0] == "show" || textArray[0]=="my"){		
			console.log("Show if trigger");
			textArray = textArray.slice(1);		
			if(textArray[0] == "my")
				textArray = textArray.slice(1);	
			if(textArray[0] == "tasks" || textArray[0] == "task"){
				// show my tasks by due date
				var date = new Date().toISOString().substr(0,10);
				//cater for missinterpretations of speech
			if(textArray[1] == "due" || textArray[1] == "do" || textArray[1] == "dew" ){
//				console.log("Checking due date");
			if(textArray[2] == "for" || textArray[2] == "by" )
				textArray = textArray.slice(3);
			else
				textArray = textArray.slice(2);
			if(textArray[0] == "the" )
				textArray = textArray.slice(1);
			if(textArray[1] == "of"){
				textArray[1] = textArray[2];
				textArray = textArray.slice();
				textArray[2] = null;
			}			
//			console.log("Start date processing on "+textArray);			
			var months = ['January', 'February', 'March', 'April', 'May',
						  'June', 'July', 'August', 'September',
						  'October', 'November', 'December'
						  ];
			var month = months.indexOf(textArray[1]);
			textArray[0] =textArray[0].replace(/(st|nd|rd|th)/, "");
			if(textArray.length <= 2 ||textArray[2]==null )
				textArray[2] = (new Date()).getFullYear();
//			console.log(textArray);
			date = new Date(textArray.join("-")).toISOString().substr(0,10);
			console.log("date " +date);
		}
		
		var thisPtr = this;
		var tasksModel =  new sap.ui.model.json.JSONModel();
		//admin sees all current tasks
		console.log("Consultant Admin "+sessionStorage.ConsultantAdmin);
		if(sessionStorage.ConsultantAdmin){
			var oModel = this.getOwnerComponent().getModel("oModel");
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.showTasks",this);
			oModel.read("/Tasks", {
				urlParameters:{"$select": "Due_Date"},		
				filters: [ new sap.ui.model.Filter({
			          path: "Due_Date",
			          operator: sap.ui.model.FilterOperator.LE,
			          value1: date
			     })],
				Sorter: [ new sap.ui.model.Sorter("Due_Date",false)],
				success: function(data){ 
//					console.log(data);
					tasksModel.setData(data);
					thisPtr._Dialog.setModel(tasksModel,"tasksModel");
					thisPtr._Dialog.open();
				},	
				error: function(){
					console.log("Error reading model for Tasks");}
				}		
			);
		}else{
			//consultant sees all their assigned tasks
			var oModel = this.getOwnerComponent().getModel("oModel");
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.showAssignedTasks",this);
			console.log(date);
			var dateFilter = new sap.ui.model.Filter("Due_Date",sap.ui.model.FilterOperator.LT,date);
			var consFilter =  new sap.ui.model.Filter("ConsultantDetails/Consultant_ID",sap.ui.model.FilterOperator.EQ,thisPtr.getConsultantID());
		
			var oFilter =new Array(new sap.ui.model.Filter({filters:[dateFilter,consFilter],and:true}));
			oModel.read("/Assigned_Tasks", {
				urlParameters:{
					"$expand":"TaskDetails,ConsultantDetails"
				},
				filters:[new sap.ui.model.Filter("Due_Date",sap.ui.model.FilterOperator.LT,date),
						new sap.ui.model.Filter("ConsultantDetails/Consultant_ID",sap.ui.model.FilterOperator.EQ,thisPtr.getConsultantID())],
				Sorter: [ new sap.ui.model.Sorter("Due_Date",false)],
				success: function(data){ 
//					console.log(data.results);
					tasksModel.setData(data);
					thisPtr._Dialog.setModel(tasksModel,"tasksModel");
					thisPtr._Dialog.open();
				},	
				error: function(){
					console.log("Error reading model for Tasks");
				}
			});	
		}
	  }
	}
},
		handleCloseShowTasks: function(oEvent){
//				console.log("Close show tasks");
//				console.log(oEvent);
				this._Dialog.destroy();	
		},
	});
});