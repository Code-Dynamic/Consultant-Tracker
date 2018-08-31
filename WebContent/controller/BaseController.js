/*global history */
var recognizing;
var recognition;
sap.ui
		.define(
				[ "sap/ui/core/mvc/Controller",

				"sap/ui/core/routing/History", "sap/m/MessageToast",
						"consultanttracker/Consultant-Tracker_Prototype-1/model/formatter" ],
				function(Controller, History, MessageToast, formatter) {
					"use strict";
					var AssignedTaskIDArr = [];
					var recognition = new webkitSpeechRecognition();
					recognition.lang = 'en-GB';
					// recognition.interimResults = true;
					recognizing = false;
					// console.log("initialised");

					var AssignedTaskIDArr = [];

					return Controller
							.extend(
									"consultanttracker.Consultant-Tracker_Prototype-1.controller.BaseController",
									{
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
											return this.getOwnerComponent()
													.getRouter();

										},
										getModelAddress : function() {
											// return
											// "http://196.249.14.63:8080/Consultant-Tracker/emplist.svc/";
											return 'http://localhost:8080/Consultant-Tracker/emplist.svc/';
										},
										getStartOfDayUTC : function(date) {
											var x = Date.UTC(
													date.getFullYear(), date
															.getMonth(), date
															.getDate());
											return x;
										},
										onRequestUserTimes : function() {
											var consultantID = this
													.getConsultantID();
											var currentDate = new Date();
											// sends date value that represents
											// beginning of any day to enable
											// easy comparison in database
											var dayBeginUTC = this
													.getStartOfDayUTC(currentDate);
											this.getTaskAndTimes(consultantID,
													dayBeginUTC);
										},
										getTaskAndTimes : function(
												ConsultantID, UTC) {
											var thisDomObj = this;
											this._Dialog = this
													.byId("timesDialog");
											var dialog = this._Dialog;
											dialog
													.setEscapeHandler(this.onDialogPressEscape);
											$
													.post(
															'GetTimesAndTasks',
															{
																Consultant_ID : ConsultantID,
																UTC : UTC
															},
															function(
																	timesAndTasksArr) {
																var dataArr = timesAndTasksArr
																		.split(",");
																var taskNamesArr = [];
																var taskTimesArr = [];
																var data = [];
																for (var i = 0; i < dataArr.length; i++) {
																	data = dataArr[i]
																			.split(":");
																	taskNamesArr
																			.push(data[0]);
																	taskTimesArr
																			.push(parseFloat(data[1]));
																	AssignedTaskIDArr
																			.push(parseInt(data[2]));
																}
																thisDomObj
																		.setupUserTimes(
																				taskNamesArr,
																				taskTimesArr,
																				UTC)
																thisDomObj._Dialog
																		.open();
															});

										},
										setupUserTimes : function(taskNamesArr,
												taskTimesArr, UTC) {
											var thisDomObj = this;
											this._EnterTimesUTC = UTC;
											var consultantID = this
													.getConsultantID();
											this.byId("submitUserTimesBtn")
													.setEnabled(true);
											var totalHoursText;
											var timePicker = "";
											var timePickerId = "tp";
											var input = "";
											var vBox = new sap.m.VBox();
											var hBox;
											var datePicker;
											var description;
											var today = new Date();
											hBox = new sap.m.FlexBox(
													{
														alignItems : sap.m.FlexAlignItems.Center
													});
											datePicker = new sap.m.DatePicker({
												description : " ",
												fieldWidth : "80%",
												dateValue : new Date(UTC),
												maxDate : today
											// id:timePickerId+i
											});
											datePicker.attachChange(function(
													oEvent) {
												onLiveChangeEnterTimesDate(
														this, oEvent);
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
												hBox = new sap.m.FlexBox(
														{
															alignItems : sap.m.FlexAlignItems.Center
														});
												timePicker = new sap.m.TimePicker(
														{
															description : " ",
															fieldWidth : "80%",
															value : taskTimesArr[i],
															valueFormat : "hh:mm",
															displayFormat : "HH:mm",
															minutesStep : 15
														// id:timePickerId+i
														});
												timePicker
														.attachChange(function(
																oEvent) {
															onLiveChangeTimesInput(
																	this,
																	oEvent);
														});
												description = new sap.m.Text({
													renderWhitespace : true,
													text : " "
															+ taskNamesArr[i]
															+ "\t"
												});
												hBox.addItem(timePicker);
												hBox.addItem(description);
												vBox.addItem(hBox);
											}
											var dateStr = this
													.getDateStr(new Date(UTC));
											totalHoursText = new sap.m.MessageStrip(
													{
														renderWhitespace : true,
														text : " "
																+ totalTime
																		.toFixed(2)
																+ " Total Hours for "
																+ dateStr,
														type : sap.ui.core.MessageType.Success
													});
											vBox.addItem(totalHoursText);
											this._Dialog.addContent(vBox);

											// checks if numbers entered in each
											// input field are valid and also
											// updates total
											function onLiveChangeTimesInput(
													timePickerObj, oEvent) {
												var newValue = timePickerObj
														.getValue();
												var newDate = datePicker
														.getDateValue();
												var maxNumberOfHoursPerDay = 10;
												if (newValue > maxNumberOfHoursPerDay
														|| newValue < 0) {
													oEvent
															.getSource()
															.setValueState(
																	sap.ui.core.ValueState.Error);
												} else {
													oEvent
															.getSource()
															.setValueState(
																	sap.ui.core.ValueState.Success);
												}
												var pnlDom = thisDomObj._Dialog
														.getDomRef();
												var total = 0;
												var inputVal = 0;
												$(pnlDom)
														.find('input')
														.each(
																function(index,
																		elem) {
																	// first
																	// element
																	// has date
																	if (index > 0) {
																		inputVal = thisDomObj
																				.getInputFloat($(elem)[0].value);
																		total += inputVal;
																	}
																});
												var dateStr = thisDomObj
														.getDateStr(newDate);
												if (total >= 24) {
													totalHoursText
															.setType(sap.ui.core.MessageType.Error);
												} else if (total >= 12) {
													totalHoursText
															.setType(sap.ui.core.MessageType.Warning);
												}
												totalHoursText
														.setText(" "
																+ total
																		.toFixed(2)
																+ " :     Total Hours for "
																+ dateStr);
											}

											function onLiveChangeEnterTimesDate(
													datePickerObj, oEvent) {
												var newDate = datePickerObj
														.getDateValue();
												thisDomObj._Dialog
														.removeAllContent();
												AssignedTaskIDArr = [];
												// sends date value that
												// represents beginning of any
												// day to enable easy comparison
												// in database
												var dayBegin = thisDomObj
														.getStartOfDayUTC(newDate);
												thisDomObj.getTaskAndTimes(
														consultantID, dayBegin);
											}
										},
										getDateStr : function(date) {
											var dd = date.getDate();
											var mm = this.getMonthStr(date
													.getMonth());
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

											var pnlDom = this._Dialog
													.getDomRef();
											var inputArr = [];
											var num;
											$(pnlDom)
													.find('input')
													.each(
															function(index,
																	elem) {
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
													resultsString += AssignedTaskIDArr[i]
															+ ":" + inputArr[i];
												}
											}
											// -1 represents general
											$
													.post(
															'EnterTaskTimes',
															{
																userTimes : resultsString,
																Consultant_ID : consultantID,
																dayBeginUTC : this._EnterTimesUTC
															},
															function(
																	responseText) {
																// console.log(responseText);
																AssignedTaskIDArr = [];
																MessageToast
																		.show(responseText);
															});
											thisDomObj._Dialog
													.removeAllContent();
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
										goToProjects : function(
												selectFirstProject) {
											var thisDomObj = this;
											var projectsModel = new sap.ui.model.json.JSONModel();
											var oModel = this
													.getOwnerComponent()
													.getModel("oModel");

											// read projects
											oModel
													.read(
															"/Projects?$filter=Project_Deleted%20eq%20false",
															{
																success : function(
																		data) {
																	for (var i = 0; i < data.results.length; i++) {
																		if (data.results[i].Project_Completed) {
																			data.results[i].status = "Completed";
																		} else {
																			data.results[i].status = "In progress";
																		}
																	}
																	projectsModel
																			.setData(data);
																	thisDomObj
																			.getView()
																			.setModel(
																					projectsModel,
																					"projectsModel");
																	if (data.results.length > 0) {

																		var resultsLocationStr;
																		if (selectFirstProject) {
																			resultsLocationStr = "/results/0";
																		} else {
																			resultsLocationStr = "/results/"
																					+ (data.results.length - 1);
																			// console.log(resultsLocationStr);
																		}
																		var oData = thisDomObj
																				.getView()
																				.getModel(
																						"projectsModel")
																				.getProperty(
																						resultsLocationStr);
																		var projectID = oData.Project_ID;
																		var projectCompleted = oData.Project_Completed;
																		thisDomObj
																				.selectProjectByID(
																						projectID,
																						projectCompleted);
																	}
																},
																error : function() {
																	// console.log("Error");
																}
															});

										},
										selectProjectByID : function(projectID,
												projectCompleted) {
											var consultantID = this
													.getConsultantID();
											this.getRouter().navTo(
													"DetailAdmin", {
														projectId : projectID
													});
											// RATINGS CODE
											// TODO Ngoni: check with Mamba hw
											// to get odata model address
											var attachModel = new sap.ui.model.odata.ODataModel(
													this.getModelAddress());
											var thisObj = this;
											attachModel
													.read(
															"/Ratings_Entrys?$expand=ProjectDetails,ConsultantDetails&$filter=ProjectDetails/Project_ID%20eq%20"
																	+ projectID
																	+ "%20and%20ConsultantDetails/Consultant_ID%20eq%20"
																	+ consultantID,
															{
																async : false,
																success : function(
																		oCreatedEn) {
																	ratingsBtnConfig(oCreatedEn)
																},
																error : function(
																		e) {/* console.log(e); */
																}
															});
											function ratingsBtnConfig(oResults) {
												var ratingsBtnConfigModel;
												// user has already given a
												// rating for the project
												if (oResults.results.length > 0) {
													ratingsBtnConfigModel = new sap.ui.model.json.JSONModel(
															{
																visible : false,
																enabled : false
															});
												} // project is completed,
													// rating not yet given
												else if (projectCompleted === true) {
													ratingsBtnConfigModel = new sap.ui.model.json.JSONModel(
															{
																visible : true,
																enabled : true
															});
												} // project not yet completed
												else {
													ratingsBtnConfigModel = new sap.ui.model.json.JSONModel(
															{
																visible : true,
																enabled : false
															});
												}
												thisObj.getView().setModel(
														ratingsBtnConfigModel,
														"ratingsBtnConfig");
											}

											// TODO fix project progress on
											// project view
											$
													.post(
															'getProjectProgress',
															{
																Project_Id : projectID
															},
															function(
																	responseText) {
																var progress = {
																	percVal : 0,
																	displayVal : 0
																};
																progress.percVal = parseFloat(responseText);
																progress.displayVal = responseText;
																var progressModel = new sap.ui.model.json.JSONModel();
																progressModel
																		.setData(progress);
																/* console.log(progressModel); */
																thisObj
																		.getView()
																		.setModel(
																				progressModel,
																				"progressModel");
															});

										},
										goToConsultants : function(oEvt) {
											var oModel = this
													.getOwnerComponent()
													.getModel("oModel");
											var consultantsModel = new sap.ui.model.json.JSONModel();
											var thisDomObj = this;
											// read consultant data
											oModel
													.read(
															"/Consultants",
															{
																success : function(
																		data) {
																	consultantsModel
																			.setData(data);
																	thisDomObj
																			.getView()
																			.setModel(
																					consultantsModel,
																					"consultantsModel");
																	if (data.results.length > 0) {
																		var oData = thisDomObj
																				.getView()
																				.getModel(
																						"consultantsModel")
																				.getProperty(
																						"/results/0");
																		var consultantID = oData.Consultant_ID;
																		thisDomObj
																				.selectConsultantByID(consultantID);
																	}
																},

																error : function() {
																	// console.log("Error");
																}
															});
										},
										selectConsultantByID : function(
												consultantID) {
											this
													.getRouter()
													.navTo(
															"DetailConsultantView",
															{
																consultantId : consultantID
															});
										},
										onMasterIconTabFilterSelect : function(
												oEvent) {
											var key = oEvent.getParameters().key;
											if (key === 'projectsSelect') {
												var firstProjectSelected = true;
												this
														.goToProjects(firstProjectSelected);
											} else if (key == 'consultantsSelect') {
												this.goToConsultants();
											}
											;
										},
										searchProjects : function(oEvt) {
											var thisDomObj = this;
											var projectsModel = new sap.ui.model.json.JSONModel();
											var oModel = this
													.getOwnerComponent()
													.getModel("oModel");
											var searchString = arguments[0];

											// read projects
											oModel
													.read(
															"/Projects",
															{
																filters : [ new sap.ui.model.Filter(
																		{
																			path : "Project_Name",
																			operator : sap.ui.model.FilterOperator.Contains,
																			value1 : searchString
																		}) ],

																success : function(
																		data) {
																	// console.log(data);
																	projectsModel
																			.setData(data);
																	thisDomObj
																			.getView()
																			.setModel(
																					projectsModel,
																					"projectsModel");
																	if (data.results.length == 0) {
																		// console.log("List
																		// empty");
																		thisDomObj
																				.getView()
																				.byId(
																						"projectsList")
																				.setNoDataText(
																						"No projects with the phrase \""
																								+ searchString
																								+ "\"");

																	} else if (data.results.length > 0) {
																		var firstItem = thisDomObj
																				.getView()
																				.byId(
																						"projectsList")
																				.getItems()[0];
																		// saved
																		// projectID
																		// in m
																		// thisDomObj.selectProjectByID(firstItem.getNumber());
																		var oData = thisDomObj
																				.getView()
																				.getModel(
																						"projectsModel")
																				.getProperty(
																						"/results/0");
																		var projectID = oData.Project_ID;
																		var projectCompleted = oData.Project_Completed;
																		thisDomObj
																				.selectProjectByID(
																						projectID,
																						projectCompleted);
																	}
																},

																error : function() {
																	// console.log("Error");
																}
															});

										},
										searchConsultants : function(oEvt) {
											var thisDomObj = this;
											var searchString = arguments[0];
											var oModel = this
													.getOwnerComponent()
													.getModel("oModel");
											var consultantsModel = new sap.ui.model.json.JSONModel();

											// read consultant data
											oModel
													.read(
															"/Consultants",
															{
																filters : [ new sap.ui.model.Filter(
																		{
																			path : "Consultant_Name",
																			operator : sap.ui.model.FilterOperator.Contains,
																			value1 : searchString
																		}) ],
																filters : [ new sap.ui.model.Filter(
																		{
																			path : "Consultant_Surname",
																			operator : sap.ui.model.FilterOperator.Contains,
																			value1 : searchString
																		}) ],

																success : function(
																		data) {
																	consultantsModel
																			.setData(data);
																	if (data.results.length == 0) {
																		// console.log("List
																		// empty");
																		thisDomObj
																				.getView()
																				.byId(
																						"consultants")
																				.setNoDataText(
																						"No consultants with the phrase \""
																								+ searchString
																								+ "\"");
																	}
																	// console.log(data);
																},

																error : function() {
																	// console.log("Error");
																}
															});

											this.getView().setModel(
													consultantsModel,
													"consultantsModel");

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
											return this.getView().setModel(
													oModel, sName);
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
											return this.getOwnerComponent()
													.getModel("i18n")
													.getResourceBundle();
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
											var sPreviousHash = History
													.getInstance()
													.getPreviousHash(), oCrossAppNavigator = sap.ushell.Container
													.getService("CrossApplicationNavigation");

											if (sPreviousHash !== undefined
													|| !oCrossAppNavigator
															.isInitialNavigation()) {
												history.go(-1);
											} else {
												this.getRouter().navTo(
														"master", {}, true);
											}
										},
										TestMicrophone : function() {
											var thisPtr = this;

											recognition.onresult = function(
													event) {
												// console.log('onResult');
												// console.log(event);
												for (var i = event.resultIndex; i < event.results.length; ++i) {
													if (event.results[i].isFinal) {
														MessageToast
																.show(event.results[i][0].transcript);
														thisPtr
																.ProcessVoiceResults(event.results[i][0].transcript);
														recognition.stop();
														reset();
													}
												}
											}

											// Handle error
											recognition.onerror = function(
													event) {
												// console.log("onerror",
												// event);
											}

											// Housekeeping after success or
											// failed parsing
											recognition.onend = function(e) {
												// console.log("Stopping
												// Recording");
												// console.log(recognition);
												// recognition.stop();

											}
											// console.log('start/stop');
											if (recognizing) {
												navigator
														.webkitGetUserMedia(
																{
																	audio : true
																},
																function(e) {/* console.log(e); */
																},
																function(e) {
																	alert('Error getting audio');
																	// console.log(e);
																});
												recognition.stop();

												reset();
											} else {
												var btn = sap.ui.getCore()
														.byId("__button1-img");
												btn.setProperty("color",
														"#ef6161");
												// console.log("starting");
												recognition.start();
												recognizing = true;
											}

											function reset() {
												var btn = sap.ui.getCore()
														.byId("__button1-img");
												btn.setProperty("color",
														"##cae4fb");
												// console.log("Resetting");
												recognizing = false;
											}
										},
										ProcessVoiceResults : function(text) {
											// console.log("processing "+ text);
											text = text.toLowerCase();
											var textArray = text.split(" ");
											// Search projects
											// accepts syntax "search x","search
											// for x","search project(s) for
											// x","search project(s) x"
											if (textArray[0] == "search") {
												textArray = textArray.slice(1);
												if (textArray[0] == "projects"
														|| textArray[0] == "project") {
													textArray = textArray
															.slice(1);
												}
												if (textArray[0] == "for")
													textArray = textArray
															.slice(1);
												// else
												// textArray =
												// textArray.slice(1);

												textArray = textArray.join(" ");
												// console.log(textArray);
												this.getView().byId(
														"projectSearchField")
														.setValue(textArray);
												this.searchProjects(textArray);
											} else if (textArray[0] == "create"
													&& (textArray[1] == "project" || textArray[1] == "projects")) {
												// create project
												this._oDialog = sap.ui
														.xmlfragment(
																"consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddProject",
																this);
												this._oDialog.open();
											} else if (textArray[0] == "create"
													&& (textArray[1] == "consultant" || textArray[1] == "consultant")) {
												// create consultant
												this._Dialog = sap.ui
														.xmlfragment(
																"consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultant",
																this);
												this._Dialog.open();
											}
										}

									});

				});