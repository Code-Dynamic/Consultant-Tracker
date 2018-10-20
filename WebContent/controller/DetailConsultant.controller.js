var curLatlng;		
var epPos = [];
var directionsService;
var directionsRenderer;
var map;
sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',

		'jquery.sap.global',
		'sap/ui/core/Fragment',

	], function(BaseController,JSONModel,Controller,jQuery,Fragment) {
	"use strict";
	var projectId;
	var OModel;
	var countHoursWorked;
	var countExpectedHours;
	var consultantId;
	var tasksProgress = [];
	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailConsultant", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.DetailConsultant
		 */
			onInit: function() {
				//getting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("DetailConsultant").attachMatched(this.onRouteMatched, this);
				OModel = this.getOwnerComponent().getModel("oModel");
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
				//end the loading indicator
				sap.ui.core.BusyIndicator.hide();
			},

			onSelectTab: function(oEvent){
				
				
				this.pKey = oEvent.getParameter("id");
				
				console.log("dashboard select :"+this.pKey);
				if(this.pKey ==  1){
					
				}else if (this.pKey == "__component0---DetailConsultant--2"){
					
					this.getView().byId("iconTabBar").setSelectedKey("key2");
					
				}else if (this.pKey == "__component0---DetailConsultant--3"){
					
					this.getView().byId("iconTabBar").setSelectedKey("key3");
				
				}else if (this.pKey == "__component0---DetailConsultant--7"){
					
				
					this.getView().byId("iconTabBar").setSelectedKey("key5");
					this.showMap(oEvent);

				}
			},
			showMap: function(oEvent) {
				//Generate map when correct tab selected
				if(!(oEvent.getParameters().selectedKey == "key5" || oEvent.getParameter("id")=="__component0---DetailConsultant--7")){
					return;
				}
				var viewDivId = sap.ui.getCore().byId(this.createId("map_canvas"));
				// instanciate google map
				 map = new google.maps.Map(viewDivId.getDomRef(), {
						zoom: 12,
						center: curLatlng//Initial Location on Map
					});
				var geocoder =new google.maps.Geocoder();
				var officeAddress = this.getView().getModel('projectsModel').getProperty('/ClientDetails/Client_Address');
				 directionsRenderer = new google.maps.DirectionsRenderer({
						map: null
					});
				
				var CurrLocationMarker = new google.maps.Marker();
				var ClientMarker = new google.maps.Marker();
				
				directionsService = new google.maps.DirectionsService;
				var thisPtr = this;
				
				//Get user current location
				if (navigator.geolocation) {
				     navigator.geolocation.getCurrentPosition(function (position) {
				    	 curLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				         map.setCenter(curLatlng);
				         CurrLocationMarker.setPosition(curLatlng);
				         officeLocation();
				         
				     });
				 }
				//Get Client address -- Currently defaulted to Epiuse Office
				function officeLocation(){
				 geocoder.geocode( { 'address': officeAddress},function(result,status){
					 if(status == google.maps.GeocoderStatus.OK){
						 ClientMarker.setPosition(result[0].geometry.location);
						 epPos[0] = result[0].geometry.location.lat();
						 epPos[1] = result[0].geometry.location.lng();
						 thisPtr.DistFromCurrent();
					 }
				 });
				}
				

				 var infoWindowCurrentLocation = new google.maps.InfoWindow({
			         content: "Current Location"
			     });
				 var infoWindowClient = new google.maps.InfoWindow({
			         content: "Client Location"
			     });
				 
				CurrLocationMarker.setMap(map);
				infoWindowCurrentLocation.open(map, CurrLocationMarker);
				

				ClientMarker.setMap(map);
				infoWindowClient.open(map, ClientMarker);
			    
				
				var control = this.getView().byId('front-div');

			},
			ShowHide: function(){
				var thisPtr = this;
				if(directionsRenderer.getMap() == null)
					thisPtr.DistFromCurrent();
				else
					thisPtr.HideRoute();
			},
			//Hides map Directions
			HideRoute: function (){
				directionsRenderer.setMap(null);
			},
			//Calculates distance and route between client and current location
			DistFromCurrent: function (){
				directionsRenderer.setMap(map);
				var req = {
						origin:  new google.maps.LatLng(epPos[0], epPos[1]),
						destination: new google.maps.LatLng(curLatlng.lat(), curLatlng.lng()),
						travelMode: 'DRIVING'
					};
				var thisPtr =this;
					directionsService.route(req, function(response, status) {
						if (status === 'OK') {
							directionsRenderer.setDirections(response);
							var distElement = sap.ui.getCore().byId(thisPtr.createId("Distance"));
							console.log(distElement);
							distElement.setText("Distance: "+response.routes[0].legs[0].distance.text);	
					}
					});
			},
			
			onRouteMatched: function(oEvent) {
				//gets reference to ratings button and saves it in global so that it is accessible in base controller
				this.setRatingsBtnRef();
				///set model for detail page
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsDetailModel = new JSONModel();
				
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				projectId = oArgs.listId;
				consultantId = oArgs.consultantId;
				//variables for counting members and tasks on a project	
				this.setMembersModel();
				this.setTaskModel();
			},
			setMembersModel: function(){
				var thisObj = this;
				var membersDetailModel = new JSONModel();
				var consultantsID = [];
				OModel.read("/Assignments", {
					urlParameters: {
						"$expand" : "ProjectDetails,ConsultantDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: projectId
				     })],
					  success: function(data){
						   membersDetailModel.setData(data);
						   var filters = [];
						   data.memberSize = data.results.length;
						   console.log("Member size: "+data.memberSize);
							var countMembers = data.results.length;
							for(var i=0; i<countMembers;i++){
								consultantsID[i] = data.results[i].ConsultantDetails.Consultant_ID;
								filters[i] = new sap.ui.model.Filter("Consultant_ID", sap.ui.model.FilterOperator.NE, consultantsID[i]);
							}
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
				
//						set the project detail model
					this.getView().setModel(membersDetailModel,"membersModel");
			},
			computeTaskProgress : function(taskID, size){
				countHoursWorked = 0;
				countExpectedHours = 0;
				var thisObj = this;
				
				OModel.read("/Assigned_Tasks", {
					
					urlParameters: {
						"$expand" : "TaskDetails,TaskDetails/ProjectDetails,ConsultantDetails"
					},
					filters: [ new sap.ui.model.Filter({
				          path: "TaskDetails/Task_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: taskID
				     })],
					success: function(data){
						//For each assigned task that belongs to task_ID
						var sum = 0, expected = 0;
						for(var i = 0; i < data.results.length;i++){
							countHoursWorked += parseFloat(data.results[i].Hours_Worked);
							countExpectedHours += parseFloat(data.results[i].Assigned_Hours);
							var activityProgress = (data.results[i].Hours_Worked/data.results[i].Assigned_Hours)*100;
							sum += activityProgress;
						}
						var taskProgress;
						if(data.results.length == 0)
							taskProgress = 0;
						else if(sum/data.results.length>100)
							taskProgress=100;
						else
							taskProgress= sum/data.results.length;
						taskProgress= Math.round(taskProgress);
						tasksProgress.push(taskProgress);
						thisObj.taskCallBack(taskID, taskProgress, size, expected);
					}
				});
			},
			taskCallBack: function(taskID, progress, size, expected){
				if(tasksProgress.length<size)
					return;
				var thisObj = this;
				var tasksDetailModel = new JSONModel();
				OModel.read("/Tasks", {
					filters: [ 
						new sap.ui.model.Filter({
				          path: "ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: projectId
				     })],
					 success: function(data){
						 for(var i = 0; i < data.results.length; i++){
							 data.results[i].progress = tasksProgress[i];
							 
							 if(data.results[i].progress == 0)
								 data.results[i].status = "Not Started";
							 else if(data.results[i].progress < 95)
								 data.results[i].status = "In Progress";
							 else if(data.results[i].progress < 100)
								 data.results[i].status = "Almost Completed";
							 else
								 data.results[i].status = "Completed";
						 }
						 tasksDetailModel.setData(data);
						 thisObj.getView().setModel(tasksDetailModel,"tasksModel");
						 thisObj.setProjectsModel();
					 }
				});
			},
			setTaskModel: function(){
				countHoursWorked = 0;
				countExpectedHours = 0;	
				tasksProgress=[];
				var thisObj = this;
				var tasksDetailModel = new JSONModel();
				var countTasksModel = new JSONModel();
				OModel.read("/Tasks", {
					urlParameters: {
						"$expand" : "ProjectDetails"
					},
					filters: [ 
						new sap.ui.model.Filter({
				          path: "ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: projectId
				     })],
					 success: function(data){
						 for(var i = 0; i < data.results.length; i++){
							thisObj.computeTaskProgress(data.results[i].Task_ID, data.results.length);
						 }
						 if(data.results.length == 0){
							 tasksDetailModel.setData(data);
							 thisObj.getView().setModel(tasksDetailModel,"tasksModel");
							 thisObj.setProjectsModel();
						 }
					 },
					 error: function(oError) {
						  console.log("error");
					 }
				});
			},
			setProjectsModel: function(){
				var projectsDetailModel = new JSONModel();
				OModel.read("/Projects("+projectId+")", {
					urlParameters: {
			            "$expand" : "ClientDetails"
			        },
					  success: function(data){
						  data.countHoursWorked = countHoursWorked;
						  data.countExpectedHours = countExpectedHours;
						  if(countExpectedHours==0)
							  data.projectProgress = 0;
						  else
							  data.projectProgress = Math.round(countHoursWorked/countExpectedHours*100);
						  projectsDetailModel.setData(data);
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
				//set the project detail model
				this.getView().setModel(projectsDetailModel,"projectsModel"); 
			},
			rowSelect: function(oEvent){
				var oSelectedItem = oEvent.getParameter("listItem").getId();
				var tableId = oSelectedItem[oSelectedItem.length-1];
				OModel.read("/Tasks", {
					urlParameters: {
			            "$expand" : "ProjectDetails"
			        },
					filters: [ 
						new sap.ui.model.Filter({
				          path: "ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: parseInt(projectId)
				     })],
					  success: function(data){
						  //loop to find the corresponding task as selected by the checkbox
						  //loop to the corresponding task from the table
							var taskId = parseInt(data.results[tableId].Task_ID);
							//get all substaskes of the selected task.
							//put the query inside because could not access taskID
							OModel.read("/Assigned_Tasks", {
								urlParameters: {
									"$expand" : "TaskDetails,ConsultantDetails"
						        },
								filters: [ 
									new sap.ui.model.Filter({
							          path: "TaskDetails/Task_ID",
							          operator: sap.ui.model.FilterOperator.EQ,
							          value1: taskId
							     })],
								  success: function(data){
                                   //loop to find the corresponding task as selected by the checkbox
                                   //loop to the corresponding task from the table
									var countAssignedTasks = data.results.length;
									if(data.results.length > 0)
										data.taskName = data.results[0].TaskDetails.Name;
									else
										data.taskName = "Not Found";
									//calculating each assigned task progress, not stored in the database
									for(var q=0; q<countAssignedTasks; q++){
										
										var A = parseInt(data.results[q].Hours_Worked);
										var B = parseInt(data.results[q].Assigned_Hours);
										
										data.results[q].progress = parseInt((A/B)*100);
									}
									assignedTasksModel.setData(data);
								  },
								  error: function(oError) {
									  console.log("Error");
									 }
								});

					  },
					  error: function(oError) {
						  console.log("Error");
						 }
					});

				var assignedTasksModel = new JSONModel();
			

				this.getView().setModel(assignedTasksModel,"assignedTasksModel");
				this.onClose();
				 //open the dialog
				this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAssignedTasks",this);
				this._oDialog.setModel(this.getView().getModel("assignedTasksModel"),"assignedTasksModel");
				this._oDialog.open();
			},
			onCancel : function() {
				if(this._Dialog){
			          this._Dialog.destroy();	
				}
	            
	            if(this._Dialog2){
	                this._Dialog2.destroy(); 	
	            }
	            
	            if(this._DialogAddTask){
	            	this._DialogAddTask.destroy();
	            }
	            
	            if(this._DialogAddActivity){
	            	this._DialogAddActivity.destroy();
	            }
	            
	            if (this._oDialog) {
	    			this._oDialog.destroy();
	    		}
			 },
			setRatingsBtnRef : function(){
				RatingsBtn = this.getView().byId("rateTeamBtn");
			},
			handleMemberRatingDialog: function (oEvent) {

				var sPath = oEvent.getSource().getBindingContext("membersModel").getPath();
				var oData = this.getView().getModel("membersModel").getProperty(sPath);
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
						 console.log("oModel" +result);
					  },
					  error: function(oError) {
						  console.log("error");
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
				//get Project_ID to pass to the calender view
				var oListId = oModel.oData.Project_ID;
				this.getRouter()
					.navTo("CalenderConsultant", 
						{listId:oListId, projectId:oListId, consultantId:consultantId});
			},
			onPressed: function(oEvent){
			},
			onSubmit: function () {
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
			},
			//Start---Mobile view code
            onNavBack: function(oEvent){
                
            	if(this.isConsultantAdmin()){
                    this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
            	}else{
                    this.getRouter().navTo("MasterConsultant",{consultantId:this.getConsultantID()});

            	}
            }
            //End---Mobile view code
	});

});