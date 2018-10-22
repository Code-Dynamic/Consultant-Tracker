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
		"sap/m/MessageToast"
	], function(BaseController,JSONModel,Controller,jQuery,Fragment,MessageToast) {
	"use strict";
	var OModel;
	var thisView;
	var taskId;
	var projectId;
	var countMembers;
	var countHoursWorked;
	var countExpectedHours;
	var countTasks;
	var countAssignedTasks;
	var distance;
	var consultantId
	var tasksProgress = [];
	var tasksProgressID = [];
	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailAdmin", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitapp.detail
*/
	onInit: function() {
		//getting id from the URL
		var oRouter = this.getRouter();
		thisView = this;
		oRouter.getRoute("DetailAdmin").attachMatched(this.onRouteMatched, this);
	},
	onRouteMatched: function(oEvent) {
		//gets reference to ratings button and saves it in global so that it is accessible in base controller
		this.setRatingsBtnRef();
		//set model for detail page
		OModel = this.getOwnerComponent().getModel("oModel");
		var projectsDetailModel = new JSONModel();
		
		var oArgs, oView;
		oArgs = oEvent.getParameter("arguments");
		consultantId = oArgs.consultantId;
		projectId = oArgs.projectId;
		
		this.setMembersModel();
		this.setTaskModel();
		this.setConsultantsModel();
		this.setClientsModel();
		
		sap.ui.core.BusyIndicator.hide();
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
					countMembers = data.results.length;
					data.countMembers = data.results.length;
					sap.ui.getCore().setModel(membersDetailModel,"membersModel");

					for(var i=0; i<countMembers;i++){
						consultantsID[i] = data.results[i].ConsultantDetails.Consultant_ID;
						filters[i] = new sap.ui.model.Filter("Consultant_ID", sap.ui.model.FilterOperator.NE, consultantsID[i]);
					}
					var unassignedConsultantsModel = new JSONModel();	
					OModel.read("/Consultants", {
						filters: [new sap.ui.model.Filter(filters, true)],
						success: function(data){
							unassignedConsultantsModel.setData(data);
							sap.ui.getCore().setModel(unassignedConsultantsModel,"unassignedConsultantsModel");
						  },
						  error: function(oError) {
							  console.log("error");
						  }
					});
					
					thisObj.getView().setModel(membersDetailModel,"membersModel");
			  },
			  error: function(oError) {
				  console.log("error");
				 }
			});
		
	},
	setAssignedTaskModel: function(){
		var progressArray = [];
		var assignedHoursArray = [];
		var workedHoursArray = [];
		
		//6
		//get the progress % of the tasks and put the results in an array
		//and get the expected hours worked and current
		var expectedHours =0;
		var currentHours=0;
		var totalHours =0;
		var totalWorkedHours =0;
		var projectProgress;
		var progress;
		var thisObj = this;
		
		for(var p=0; p<100; p++){
			progressArray[p] = 0;
			assignedHoursArray[p] =0;
			workedHoursArray[p] =0;
		}
		
		var tileHoursModel = new JSONModel();	
		var tileProjectProgressModel = new JSONModel();
		var titleAssignedTasksModel = new JSONModel();
		var tileTasksModel = new JSONModel();	
		consultantId = this.getConsultantID();
		//2
		OModel.read("/Assigned_Tasks", {
		
			urlParameters: {
				"$expand" : "TaskDetails,TaskDetails/ProjectDetails,ConsultantDetails"
					
			},
			filters: [ new sap.ui.model.Filter({
		          path: "TaskDetails/ProjectDetails/Project_ID",
		          operator: sap.ui.model.FilterOperator.EQ,
		          value1: projectId
		     })],
			success: function(data){
				console.log(data);
			  },
		     error: function(oError) {
				  console.log(oError.error);
				  console.log("error");
			 }
		});
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
				 countTasks = data.results.length;
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
		var thisObj = this;
		OModel.read("/Projects("+projectId+")", {
			urlParameters: {
	            "$expand" : "ClientDetails"
	        },
			  success: function(data){
				  data.countMembers = countMembers;
				  data.countTasks = countTasks;
				  data.countHoursWorked = countHoursWorked;
				  data.countExpectedHours = countExpectedHours;
				  if(countExpectedHours==0)
					  data.projectProgress = 0;
				  else
					  data.projectProgress = Math.round(countHoursWorked/countExpectedHours*100);
				  projectsDetailModel.setData(data);
				  
					thisObj.getView().setModel(projectsDetailModel,"projectsModel"); 
			  },
			  error: function(oError) {
				  console.log("error");
				 }
			});
	},
	setConsultantsModel: function(){
		var consultantsDetailModel = new JSONModel();	
		OModel.read("/Consultants", {
			  success: function(data){
				  consultantsDetailModel.setData(data);
			  },
			  error: function(oError) {
				  console.log("error");
				 }
			});
		//set the project detail model
		this.getView().setModel(consultantsDetailModel,"consultants");
	},
	setClientsModel: function(){
		var clientDetailModel = new JSONModel();
		OModel.read("/Clients", {
			  success: function(data){
				 var result = JSON.stringify(data);
				 clientDetailModel.setData(data);
				 sap.ui.getCore().setModel(clientDetailModel,"clientList");
			  },
			  error: function(oError) {
				  console.log("Error");
				 }
		});
	},
	setRatingsBtnRef : function(){
		RatingsBtn = this.getView().byId("rateTeamBtn");
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
//				loop to find the corresponding task as selected by the checkbox
//				loop to the corresponding task from the table
					taskId = parseInt(data.results[tableId].Task_ID);

					//get all substasks of the selected task.
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

//							loop to find the corresponding task as selected by the checkbox
//							loop to the corresponding task from the table
							var countAssignedTasks = data.results.length;
							if(data.results.length > 0)
								data.taskName = data.results[0].TaskDetails.Name;
							else
								data.taskName = "Not Found";
							//calculating each assigned task progress//not stored in the database
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
		
	onChangeCheckbox:function(oEvent){
		//getting selected item on table
		var oSelectedListItem = oEvent.getSource().getParent().setSelected(true)
		var oSelectedRow =  oEvent.getSource().getParent().getId();
		
        var value = oEvent.getSource().getSelected();
        if(value === true){
        	//disable check-box action
            var completed = oEvent.getSource().setEnabled(false);
            
        }
        var tableId = oSelectedRow[oSelectedRow.length-1];
		OModel.read("/Assigned_Tasks", {
			urlParameters: {
				"$expand" : "TaskDetails"
	        },
			filters: [ 
				new sap.ui.model.Filter({
		          path: "TaskDetails/Task_ID",
		          operator: sap.ui.model.FilterOperator.EQ,
		          value1: taskId
		     })],
			  success: function(data){
				  
				  //to get the ID of the assigned task that is marked as completed
				  var assignedTaskId = data.results[tableId].Assigned_Task_ID;

			  },
			  error: function(oError) {
				  console.log("Error");
				 }
			});

    },

	onSelectTab: function(oEvent){
		
		this.pKey = oEvent.getParameter("id");
		if(this.pKey ==  1){
			
		}else if (this.pKey == "__component0---DetailAdmin--2"){
	 		
			this.getView().byId("iconTabBar").setSelectedKey("key2");
			
		}else if (this.pKey == "__component0---DetailAdmin--3"){
			
			this.getView().byId("iconTabBar").setSelectedKey("key3");
		
		}else if (this.pKey == "__component0---DetailAdmin--7"){
		
			this.getView().byId("iconTabBar").setSelectedKey("key5");
			this.showMap(oEvent);
		}
	},
	showMap: function(oEvent) {
		
		//Generate map when correct tab selected
		if(!(oEvent.getParameters().selectedKey == "key5" || oEvent.getParameter("id")=="__component0---DetailAdmin--7")){
			return;
		}
		var viewDivId = sap.ui.getCore().byId(this.createId("map_canvas"));
		// instantiate google map
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
					console.log("dist: "+response.routes[0].legs[0].distance.text);
					directionsRenderer.setDirections(response);
					var distElement = sap.ui.getCore().byId(thisPtr.createId("Distance"));
					console.log(distElement);
					distElement.setText("Distance: "+response.routes[0].legs[0].distance.text);	
			}
			});
	},
	onSubmit: function(evt){
		var name = sap.ui.getCore().byId("name").getValue();
		var taskDescription = sap.ui.getCore().byId("taskDescription").getValue();
		var startDate = sap.ui.getCore().byId("startDate").getValue();
		var dueDate = sap.ui.getCore().byId("dueDate").getValue();
		var taskId=7;
		var projectId=1;
		var oEntry ={};
		oEntry.Description = taskDescription;
		oEntry.Due_Date = dueDate;
		oEntry.Name = name;
		//getting project id
		var oId = this.getView().getModel("projectsModel");
		this.oProjectId = oId.oData.Project_ID;
		oEntry.Project_ID =oProjectId;
		this.onCancel();
	},
	openOverviewCalender: function(evt){
		//get model of DetailConsultant controller
		var oModel = this.getView().getModel("projectsModel");
		
		//get Project_ID to pass to the calender view
		var oProjectId = oModel.oData.Project_ID;
		this.getRouter()
			.navTo("OverviewCalender",
					{projectId: oProjectId});

	},
	openProjectsOverviewCalender: function(oEvent){
		this.getRouter()
		.navTo("ProjectsOverviewCalender");
	},
	addProject: function(){
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddProject",this);
		this._oDialog.open();		
	},
	addClient: function(){
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddClient",this);
		this._oDialog.open();		
	},
	onClose: function () {
	
		if (this._oDialog) {
			this._oDialog.destroy();
			this._oDialog = null;
		}
	},
	// onSubmit event handler of the fragment
    onSubmitProject : function() {
    	var thisDomObj = this;
    	
    	var _Name = sap.ui.getCore().byId("p_Name").getValue();
    	var _Description = sap.ui.getCore().byId("p_Description").getValue();
    	var _Deadline = sap.ui.getCore().byId("p_Deadline").getValue();
    	var _StartDate = sap.ui.getCore().byId("p_StartDate").getValue();
    	var _cilentID = sap.ui.getCore().byId("idSelected").getSelectedKey();
    	var b_OnSite = sap.ui.getCore().byId("p_OnSite").getSelected();;
    	var _OnSite;
    	if(b_OnSite){
    		_OnSite = 1;
    	}else{
    		_OnSite = 0;
    	}

    	$.post('CreateProject', { Name: _Name ,ClientID: _cilentID,Desc: _Description, Deadl: _Deadline ,StartDate: _StartDate,OnSite:  _OnSite, Project_Creator: this.getConsultantID()},
    		function(responseText) {
    		MessageToast.show("Project Created Succesfully");
    		//ensures that newly created project is selected
    		var selectFirstProject = false;
    		thisDomObj.goToProjects(selectFirstProject);    		
    	});
    	//close model
		this.onCancel();
    	
    },
  //edit project details
	editProjectDetails: function(){
		this.onCancel();
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.editProjectDetails",this);
		this._oDialog.setModel(this.getView().getModel("projectsModel"),"projectsModel");
		this._oDialog.open();		
		
	},
    onEditProjectSubmit : function(oEvent) {
    	var thisDomObj = this;
    	var oModel = this.getView().getModel("projectsModel");
		var projectID = oModel.oData.Project_ID;
    	var _Name = sap.ui.getCore().byId("EditP_Name").getValue();
    	var _Description = sap.ui.getCore().byId("EditP_Description").getValue();
    	var _Deadline = sap.ui.getCore().byId("EditP_Deadline").getValue();
    	var _StartDate = sap.ui.getCore().byId("EditP_StartDate").getValue();
    	var _cilentID = sap.ui.getCore().byId("EditP_idSelected").getSelectedKey();
    	var b_OnSite = sap.ui.getCore().byId("EditP_OnSite").getSelected();;
    	var _OnSite;
    	if(b_OnSite){
    		_OnSite = 1;
    	}else{
    		_OnSite = 0;
    	}

    	$.post('CreateProject', {ID: projectID, Name: _Name ,ClientID: _cilentID,Desc: _Description, Deadl: _Deadline ,StartDate: _StartDate,OnSite:  _OnSite, Project_Creator: this.getConsultantID()},
    		function(responseText) {
    		MessageToast.show("Project Edited Succesfully");
    		thisDomObj.setProjectsModel();
    	});
    	//close model
		this.onCancel();
    },
    onSubmitClient: function(){
    	var _Name = sap.ui.getCore().byId("c_Name").getValue();
    	var _EmailAddress = sap.ui.getCore().byId("c_Email").getValue();
    	var _PhysicalAddress = sap.ui.getCore().byId("c_Address").getValue();
    	var _Number = sap.ui.getCore().byId("c_Number").getValue();
    	
    	$.post('AddClient', { Name: _Name ,EmailAddress: _EmailAddress,PhysicalAddress: _PhysicalAddress, Number: _Number},
        		function(responseText) {  
    				console.log(responseText);
        		}
    	);
    	this.onCancel();
    },
	onDelete: function(){
		var _projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
		$.post('DeleteProject', { projectID: _projectID},function(responseText) {  
			    	console.log(responseText);
			   });
			this.refreshData();
				//close model
			this._Dialog.destroy();
		},
		onRemove: function(oEvent){
				var _projectID = sap.ui.getCore().getModel("groupMember").getProperty("/Consultants");
				var Assignment_ID = sap.ui.getCore().byId("idRemoveCon").getSelectedKey();
				console.log("Assignment_ID" + _projectID);
		},
		addConsultantsViaCSV : function(oEvent){
			var fU = this.getView().byId("csvUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			reader.onload = function(e) {
			    var strCSV = e.target.result;
			    var rows = strCSV.split("\n");
			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress()); 
		    	var i;
			    for (i = 0; i < rows.length; i++) { 
			    	var _name = rows[i].split(",")[0];
			    	var _surname = rows[i].split(",")[1];
			    	var _email = rows[i].split(",")[2];
			    	var _cell = rows[i].split(",")[3];
			    	var _admin = "0";
			    	$.post('CreateConsultant', { 
						name: _name,
						surname: _surname,
						email: _email,
						cell: _cell,
						admin: _admin});
			    }
			};
			reader.readAsBinaryString(file);
		},
		addConsultantToProject: function(oEvent){
				this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultanttoProject",this);
				this._Dialog.setModel(this.getView().getModel("consultants"),"consultants");
				// Multi-select if required
				var bMultiSelect = !!oEvent.getSource().data("multi");
				this._Dialog.setMultiSelect(bMultiSelect);
				// Remember selections if required
				var bRemember = !!oEvent.getSource().data("remember");
				this._Dialog.setRememberSelections(bRemember);
				this._Dialog.open(); 				
				var arrConsultants;
				//getConsultants
				//return all consultants
		         $.post('GetProjectConsultants',function(responseText){
						console.log("servlet getProjectConsultants responded");
						console.log(responseText);
						arrConsultants = {Consultants:[]};
						var array = responseText.split(';');
						array.forEach(createConsultant);
						
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(JSON.parse(JSON.stringify(arrConsultants)));
						sap.ui.getCore().setModel(oModel,"consultants");
					});
					function createConsultant(stringVal){
						var array = stringVal.split(',');
						var Consultant = {
						 Consultant_ID: array[0],
						 Consultant_Name : array[1],
						 Consultant_Surname : array[2],
						 Consultant_email : array[3],
						 Consultant_Cell : array[4],
						 Consultant_Admin : array[5]
						};
						arrConsultants.Consultants.push((Consultant));
					}
		},
		onDeleteConsultantFromProject: function(oEvent){
//			create model to display list of consultants
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formRemoveConsultantFromProject",this);
			this._Dialog.setModel(this.getView().getModel("membersModel"),"membersModel");
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._Dialog.setMultiSelect(bMultiSelect);
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._Dialog.setRememberSelections(bRemember);
			this._Dialog.open();	
		},
		handleCloseRemoveConsultantFromProject: function(oEvent) {
			var oModel = this.getView().getModel("projectsModel");
			var projectID = oModel.oData.Project_ID;
			var aContexts = oEvent.getParameter("selectedContexts");
			var thisObj = this;
			if (aContexts && aContexts.length) {
				this.oUnassign = aContexts.map(
						function(oContext) {
							var assignmentID=oContext.getObject().Assignment_ID;
							var consultantID = oContext.getObject().Consultant_ID;
							$.post('UnassignConsultant', { 
								assignment: assignmentID
							},
								function(data) {  
								var array = data.split(';');
								thisView.setMembersModel();
							});
							return oContext.getObject().Assignment_ID; 
						}
				).join(", ");
				
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		handleCloseAddConsultantToProject: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var oModel = this.getView().getModel("projectsModel");
			var thisObj = this;
			if (aContexts && aContexts.length) {
				aContexts.map(
					function(oContext) {
						var consultantID = oContext.getObject().Consultant_ID;
						var projectID = oModel.oData.Project_ID;
						
						$.post('AssignConsultants', { 
							project: projectID,
							consultant: consultantID,
							succes:function(data){
                                var newMemberName;
                                var currentUserName;
                                var newMemberEmail;
                                OModel.read("/Consultants", {
                                    filters: [
                                          new sap.ui.model.Filter({
                                            path: "Consultant_ID",
                                            operator: sap.ui.model.FilterOperator.EQ,
                                            value1: consultantID
                                       })],
                                    success: function(data){
                                        newMemberName = data.results[0].Consultant_Name;
                                        newMemberEmail = data.results[0].Consultant_Email;
                                        OModel.read("/Consultants", {
                                            filters: [
                                                  new sap.ui.model.Filter({
                                                    path: "Consultant_ID",
                                                    operator: sap.ui.model.FilterOperator.EQ,
                                                    value1: thisObj.getConsultantID()
                                               })],
                                            success: function(data){
                                                currentUserName = data.results[0].Consultant_Name;
                                                OModel.read("/Projects", {
                                                    filters: [
                                                          new sap.ui.model.Filter({
                                                            path: "Project_ID",
                                                            operator: sap.ui.model.FilterOperator.EQ,
                                                            value1: projectID
                                                       })],
                                                    success: function(data){
                                                        var projectName = data.results[0].Project_Name;
                                                        $.post('EmailNotificationAddedToTeam',{newTeamMemberName:newMemberName, emailAddress: newMemberEmail, currentUserName: currentUserName, projectName: projectName }, function(response){
                                                            console.log("success");
                                                        });
                                                      },
                                                      error: function(oError) {
                                                          console.log("couldnt get consultant");
                                                      }
                                                });
                                              },
                                              error: function(oError) {
                                                  console.log("couldnt get consultant");
                                              }
                                        });
                                      },
                                      error: function(oError) {
                                          console.log("couldnt get consultant");
                                      }
                                });
                              }
							}, function(data) {  
								var array = data.split(';');
								console.log("In handleCloseAddConsultantToProject: "+data);
								thisView.setMembersModel();
							}
						);
						return oContext.getObject().Consultant_Name;
					}
				).join(", ");
			} else {
				MessageToast.show("No new item was selected.");
			}			
		},
		updateMembersList: function(){
			var membersDetailModel = new JSONModel();	
			OModel.read("/Assignments", {
				urlParameters: {
					"$expand" : "ProjectDetails, ConsultantDetails"
		        },
				filters: [ new sap.ui.model.Filter({
			          path: "ProjectDetails/Project_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: arguments[0]
			     })],
					  success: function(data){
						   membersDetailModel.setData(data);
							var results = JSON.stringify(data);
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
			thisView.getView().setModel(membersDetailModel,"membersModel"); 
		},
		onRemoveTaskFromProject: function(oEvent){
			//create model to display list of consultants
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formRemoveTaskFromProject",this);
			this._Dialog.setModel(this.getView().getModel("tasksModel"),"tasksModel");
			//Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._Dialog.setMultiSelect(bMultiSelect);
			//Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._Dialog.setRememberSelections(bRemember);
			this._Dialog.open();
		},
		handleCloseRemoveTask: function(oEvent){
			var oModel = this.getView().getModel("projectsModel");
	    	var _projectID = oModel.oData.Project_ID;
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				console.log("You have chosen " + aContexts.map(function(oContext) {
					console.log("test: "+JSON.stringify(oContext.getObject()));
					var taskID=oContext.getObject().Task_ID;
					$.post('RemoveTask', {task: taskID},
						function(data) {  
						var array = data.split(';');
						console.log(data);
						thisView.setTaskModel();
					});
					return oContext.getObject().Task_ID; 
				}).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onAddTask: function(){
			this.onCancel();
			this._DialogAddTask = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddTaskToProject", this);
			this._DialogAddTask.open();
		},
		onAddActivity: function(oEvent){
			var sPath = oEvent.getSource().getBindingContext("tasksModel").getObject();
			this.taskIDSelected = sPath.Task_ID;
			this._DialogAddActivity = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddActivityToTask", this);
			this._DialogAddActivity.open();
		},
		handleChange: function (oEvent) {
			var oText = this.byId("T1");
			var oDTP = oEvent.oSource;
			var sValue = oEvent.getParameter("value");
			var bValid = oEvent.getParameter("valid");
			this._iEvent++;
			oText.setText("Change - Event " + this._iEvent + ": DateTimePicker " + oDTP.getId() + ":" + sValue);

			if (bValid) {
				oDTP.setValueState(sap.ui.core.ValueState.None);
			} else {
				oDTP.setValueState(sap.ui.core.ValueState.Error);
			}
		},
		handleCloseAddTask: function(oEvent){
			var check = 0;
	    	var _Name = sap.ui.getCore().byId("t_Name").getValue();
	    	if(this.checkValueEntered(_Name,"t_Name")){
	    		check++;
	    	}
	    	var _Description = sap.ui.getCore().byId("t_Description").getValue();
	    	if(this.checkValueEntered(_Description,"t_Description")){
	    		check++;
	    	}
	    	var _DueDate = sap.ui.getCore().byId("t_Deadline").getValue();
	    	if(this.checkValueEntered(_DueDate,"t_Deadline")){
	    		check++;
	    	}
	    	var numSuccesfulTests = 3;
	    	if(check === numSuccesfulTests){
		    	var oModel = this.getView().getModel("projectsModel");
		    	var _projectID = oModel.oData.Project_ID;
		    	
		    	console.log(_Name+" "+_Description+" "+_DueDate+" "+_projectID);
		    	
		    	$.post('CreateTask',{description: _Description,dueDate: _DueDate,name:_Name, projectID: _projectID},function(responseText){
		    		  console.log("Creating task completed");
		    		  sap.m.MessageToast.show("Task Added Succesfully");
		    		  thisView.setTaskModel();
				});
				this._DialogAddTask.destroy();	    		
	    	}		
		},
		updateTasksList: function(){
			var tasksDetailModel = new JSONModel();
  			OModel.read("/Tasks", {
  				filters: [ 
  					new sap.ui.model.Filter({
  			          path: "ProjectDetails/Project_ID",
  			          operator: sap.ui.model.FilterOperator.EQ,
  			          value1: arguments[0]
  			     })],
  				  success: function(data){
  					 var result = JSON.stringify(data);
  					 tasksDetailModel.setData(data);
  				  },
  				  error: function(oError) {
  					  console.log("error");
  					 }
  				});
  		
  			thisView.getView().setModel(tasksDetailModel,"tasksModel");
		},
		handleCloseAddActivity: function(){
			var check = 0;
			var Consultant_ID = sap.ui.getCore().byId("consultantSelected").getSelectedKey();
	    	if(this.checkValueEntered(Consultant_ID,"consultantSelected")){
	    		check++;
	    	}
			var _AssignedHours = sap.ui.getCore().byId("allocatedHours").getValue();
	    	if(this.checkNumericValueEntered(_AssignedHours,"allocatedHours")){
	    		check++;
	    	}
			var _DateAssigned = sap.ui.getCore().byId("AT_dateAssigned").getValue();
	    	if(this.checkValueEntered(_DateAssigned,"AT_dateAssigned")){
	    		check++;
	    	}
			var _DueDate = sap.ui.getCore().byId("AT_Deadline").getValue();
	    	if(this.checkValueEntered(_DueDate,"AT_Deadline")){
	    		check++;
	    	}
	    	var _Description = sap.ui.getCore().byId("AT_Description").getValue();
	    	if(this.checkValueEntered(_Description,"AT_Description")){
	    		check++;
	    	}
	    	var thisObj = this;
	    	var numSuccesfulTests = 5;
	    	if(check === numSuccesfulTests){
				$.post('AssignConsultantToTask', { 
					dateAssigned:_DateAssigned, 
					dueDate:_DueDate, 
					assignedHours: _AssignedHours, 
					hoursWorked:0, 
					consultantID:Consultant_ID, 
					taskID:this.taskIDSelected, 
					description:_Description,
					succes:function(data){
	                    
						var oModel = thisObj.getView().getModel("projectsModel");
						var projectID = oModel.oData.Project_ID;
	                    var memberAddedToTask;
	                    var currentUserName;
	                    var newMemberEmail;
	                    
	                    OModel.read("/Consultants", {
	                        filters: [
	                              new sap.ui.model.Filter({
	                                path: "Consultant_ID",
	                                operator: sap.ui.model.FilterOperator.EQ,
	                                value1: Consultant_ID
	                           })],
	                        success: function(data){
	                            memberAddedToTask = data.results[0].Consultant_Name;
	                            OModel.read("/Consultants", {
	                                filters: [
	                                      new sap.ui.model.Filter({
	                                        path: "Consultant_ID",
	                                        operator: sap.ui.model.FilterOperator.EQ,
	                                        value1: thisObj.getConsultantID()
	                                   })],
	                                success: function(data){
	                                    currentUserName = data.results[0].Consultant_Name;
	                                    OModel.read("/Projects", {
	                                        filters: [
	                                              new sap.ui.model.Filter({
	                                                path: "Project_ID",
	                                                operator: sap.ui.model.FilterOperator.EQ,
	                                                value1: projectID
	                                           })],
	                                        success: function(data){
	                                            var projectName = data.results[0].Project_Name;
	                                            console.log(currentUserName);
	                                            
	                                            $.post('EmailNotificationAddedToTask',{newTaskMemberName:memberAddedToTask, emailAddress: newMemberEmail, 
	                                            	currentUserName: currentUserName, projectName: projectName,taskDescription:_Description,
	                                            	dueDate:_DueDate,dateAssigned:_DateAssigned, assignedHours:_AssignedHours}, function(response){
	                                                console.log("success");
	                                            });
	                                          },
	                                          error: function(oError) {
	                                              console.log("couldnt get consultant");
	                                          }
	                                    });
	                                  },
	                                  error: function(oError) {
	                                      console.log("couldnt get consultant");
	                                  }
	                            });
	                          },
	                          error: function(oError) {
	                              console.log("couldnt get consultant");
	                          }
	                    });
	                   
	                }
				
				},function(responseText) {
					console.log("Added activity: "+_AssignedHours);
					 sap.m.MessageToast.show("Activity Added Succesfully");	
				});
				this._DialogAddActivity.destroy();	    		
	    	}

		},
		confirmDeleteProject: function(){
			this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.confirmDelete",this);
			this._Dialog.open();
		},
		confirmRemoveConsultant: function(){
			this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.confirmRemove",this);
			this._Dialog.open();
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
		 onRemove: function(oEvent){
			var _projectID = sap.ui.getCore().getModel("groupMember").getProperty("/Consultants");
			var Assignment_ID = sap.ui.getCore().byId("idRemoveCon").getSelectedKey();
		},
		refreshData : function(oEvent){
	    	//Begin Refresh PRojects
	    	var oModel = new sap.ui.model.json.JSONModel();
			var arrProjects = {Projects:[]};
			var arrConsultants = {Consultants:[]};
			var model = this.getOwnerComponent().getModel("oModel");
			model.read( "/Projects", {
				filters: [ new sap.ui.model.Filter({
					urlparameters:{
						"$expand": "ClientDetails"
					},
			          path: "Project_Deleted",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: "false"
			     })],			
					success: function(oCreatedEn){
						GotProjects(oCreatedEn) 
					}, 
					error: function(){
						console.log("Error");
					}
			});
			function GotProjects(oCreatedEn){
				oModel.setData(oCreatedEn);
				console.log(oCreatedEn);
				sap.ui.getCore().setModel(oModel);
				app.to("detailPage");
			}
			var sOrderId = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
			//get model
			var oData = sap.ui.getCore().getModel().getProperty("/results");
			
			model = this.getOwnerComponent().getModel("oModel");
			model.read( "/Assignments", {
				filters: [ new sap.ui.model.Filter({
					urlParameters:{
						"$expand": "ConsultantDetails, ProjectDetails"
					},
			          path: "ProjectDetails/Project_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: sOrderId
			     })],
				async:false,
				success: function(oCreatedEn){
					GotMembers(oCreatedEn) 
				}, 
				error: function(){
					sap.m.MessageToast.show('Failed to extract project details', {
						duration: 5000,
						autoClose: true
					 });
				}
			});		
	    	function GotMembers(Members){
				console.log(Members);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(Members);
				sap.ui.getCore().setModel(oModel,"groupMember");
				app.to("detailPage");
			}
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read( "/Assignments", {
				filters: [ new sap.ui.model.Filter({
					urlParameters:{
						"$expand": "ConsultantDetails, ProjectDetails"
					},
			          path: "ProjectDetails/Project_ID",
			          operator: sap.ui.model.FilterOperator.EQ,
			          value1: sOrderId
			     })],
				async:false,
				success: function(oCreatedEn){
					gotTasks(oCreatedEn) 
				}, 
				error: function(){
					sap.m.MessageToast.show('Failed to extract project details', {
						duration: 5000,
						autoClose: true
					 });
				}
			});		
			function gotTasks(tasks){
				console.log(tasks);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(tasks);
				
				sap.ui.getCore().setModel(oModel,"tasks");
				app.to("detailPage");
			}
			function createProjectObj(stringVal){
				var array = stringVal.split(',');
				var location;
				
				if(array[4]=="0"){
					location = "No";
				}else{
					location = "Yes";
				}
				var projectObj = {
				 Project_ID: array[5],
			     Project_Name : array[0],
			     Project_DEscription : array[1],
			     Client_ID : array[2],
			     Project_Deadline : array[3],
			     Project_OnSite : location
				};
		    	arrProjects.Projects.push((projectObj));	
				}	
			},
			//Code for Task tab
			onMenuAction: function(oEvent) {
				var oItem = oEvent.getParameter("item"),
					sItemPath = "";
				while (oItem instanceof sap.m.MenuItem) {
					sItemPath = oItem.getText() + " > " + sItemPath;
					oItem = oItem.getParent();
				}

				sItemPath = sItemPath.substr(0, sItemPath.lastIndexOf(" > "));

				sap.m.MessageToast.show("Action triggered on item: " + sItemPath);
				
				if(sItemPath == "Feedback"){
					//Get feed back 
					var taskID = sap.ui.getCore().getModel("tasks").getProperty("/");
					 var oModel = this.getOwnerComponent().getModel("oModel");
					 oModel.read("/Feedbacks", {
							urlParameters: {
								"$expand" : "TaskDetails"
					        },
			  				filters: [new sap.ui.model.Filter({
			  			          path: "TaskDetails/Task_ID",
			  			          operator: sap.ui.model.FilterOperator.EQ,
			  			          value1: 1
			  			    })],
			  			    async:false,
			  			     
			  				success: function(oCreatedEn){
			  					 gotTasks(oCreatedEn) 	
			  				  },
			  				error: function(oError) {
			  					sap.m.MessageToast.show("Error in getting attachments", {
									duration: 5000,
									autoClose: true
								 });
			  				}
			  			});
					function gotTasks(tasks){
						console.log(tasks);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(tasks);
						
						sap.ui.getCore().setModel(oModel,"feedback");
						app.to("detailPage");
					}
					
					 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.feedback", this);
					 this._Dialog.open();
				}
			},
			onPost: function (oEvent) {
				var sValue = oEvent.getParameter("value");
				var sOrderId = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
				var id = sap.ui.getCore().getModel("taskID").getProperty("/id");
				console.log("task ID");
				$.post("CreateFeedback", {msg:sValue,consultant:2,project:sOrderId,task:id},function(responseText) {  
			        });
			},
			onSelectionChange: function(oEvent) {
		          var oSelectedItem = oEvent.getParameter("listItem");
		          var oModel = oSelectedItem.getBindingContext("tasks").getObject();
		          var taskID = {id:0};
		          taskID.id = oModel.Task_ID;
		          var TaskIDModel = new sap.ui.model.json.JSONModel();
		          TaskIDModel.setData(taskID);
		          sap.ui.getCore().setModel(TaskIDModel,"taskID");
		          var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
		          var oModel = this.getOwnerComponent().getModel("oModel");
		          oModel.read("/Feedbacks", {
					urlParameters: {
						"$expand" : "TaskDetails"
			        },
	  				filters: [ 
	  					new sap.ui.model.Filter({
	  			          path: "TaskDetails/Task_ID",
	  			          operator: sap.ui.model.FilterOperator.EQ,
	  			          value1: oModel.Task_ID
	  			     })],
	  			     async:false,
	  			     success: function(oCreatedEn){
	  			    	 gotTasks(oCreatedEn) 
	  			     }, 
	  			     error: function(){
	  			    	 sap.m.MessageToast.show("Error in getting attachments", {
	  			    		 duration: 5000,
	  			    		 autoClose: true
						 });
	  			     }
		          });
					function gotTasks(tasks){
						console.log(tasks);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(tasks);
						
						sap.ui.getCore().setModel(oModel,"feedback");
						app.to("detailPage");
					}
		        },
		    getFeedback: function(oEvent){
		    	this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.feedback", this);
				this._Dialog.open();
			},
			onFeedback : function(){
				
			},
			progress: function(){
				 sap.m.MessageToast.show("Progress triggered");
			},
			onUpload : function(e) {
					
					var fU = this.getView().byId("fileUploader");
					var domRef = fU.getFocusDomRef();
					var file = domRef.files[0];
					//upload to database
					$.post('AddFolder', { 
						fileName: file
					},function(responseText) {  
						console.log("Response");
				    	  console.log(responseText);
				      });
			},
			openCalender: function(oEvent){
				//get model of DetailConsultant controller
				var oModel = this.getView().getModel("projectsModel");
				//get Project_ID to pass to the calender view
				console.log("toCalender CID: "+consultantId);
				var oListId = oModel.oData.Project_ID;
				this.getRouter()
					.navTo("Calender", 
						{listId:oListId, projectId:oListId, consultantId:consultantId});
			},
			handleUploadPress: function(oEvent) {
						var oFileUploader = this.byId("fileUploader");
						oFileUploader.upload();
			},
            onMarkProjectCompleted: function(){
    			var thisObj = this;
    			$.post('MarkProjectCompleted', { projectID: PROJECT_ID},function(responseText) {  
    						MessageToast.show("Project Marked as Completed.");
    						var projectCompleted = true;
    						thisObj.setProjectsModel();
    						thisObj.selectProjectByID(PROJECT_ID, projectCompleted);
    				   });	
            },
			deleteTask: function(){
						var id = sap.ui.getCore().getModel("taskID").getProperty("/id");
						
						$.post('RemoveAssignedTask',{taskID:id},function(responseText){
				    		  
								console.log("Removed task!");
							});
				},
				openManageConFrag: function(){
						 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.feedback", this);
						 this._Dialog.open();
				},
				onAfterRendering: function() {
						
				},
                onNavBack: function(oEvent){
                    this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
                }
		});
});
	