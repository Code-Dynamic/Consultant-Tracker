sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',
		'jquery.sap.global',
		'sap/ui/core/Fragment',
		"sap/m/MessageToast"
	], function(BaseController,JSONModel,Controller,jQuery,Fragment,MessageToast) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailAdmin", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitapp.detail
*/
	onInit: function() {
		//getting id from the URL
		var oRouter = this.getRouter();
		oRouter.getRoute("DetailAdmin").attachMatched(this.onRouteMatched, this);
	},
	onRouteMatched: function(oEvent) {
		
//		///set model for detail page
		var oModel = this.getOwnerComponent().getModel("oModel");
		var projectsDetailModel = new JSONModel();
		
		var oArgs, oView;
		oArgs = oEvent.getParameter("arguments");
		
		//1
		//read the Project table based on id
			oModel.read("/Projects("+oArgs.projectId+")", {
				urlParameters: {
		            "$expand" : "ClientDetails",
		        },
				  success: function(data){
					   projectsDetailModel.setData(data);
//						var results = JSON.stringify(data);
//						console.log(results);
//						alert(results);
				  },
				  error: function(oError) {
					  alert("error");
					 }
				});
			//set the project detail model
			this.getView().setModel(projectsDetailModel,"projectsModel"); 
//			
			
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
			          value1: oArgs.projectId
			     })],
					  success: function(data){
						   membersDetailModel.setData(data);
							var results = JSON.stringify(data);
//							console.log(results);
//							alert(results);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
//				set the project detail model
				this.getView().setModel(membersDetailModel,"membersModel"); 
//
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
					filters: [ 
						new sap.ui.model.Filter({
				          path: "TaskDetails/ProjectDetails/Project_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: oArgs.projectId
				     })],
					  success: function(data){
						 var result = JSON.stringify(data);
						 tasksDetailModel.setData(data);
//						 alert(result);
//						 console.log("tasksModel" +result);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				
//				console.log(projectsModel);
				this.getView().setModel(tasksDetailModel,"tasksModel");
				
				//2
				//get Team members for the selected Project (from master)
				var consultantsDetailModel = new JSONModel();	
				oModel.read("/Consultants", {
						  success: function(data){
							  consultantsDetailModel.setData(data);
								var results = JSON.stringify(data);
								//console.log(results);
								//console.log(data);
//								alert(results);
						  },
						  error: function(oError) {
							  alert("error");
							 }
						});
//					set the project detail model
					this.getView().setModel(consultantsDetailModel,"consultants"); 
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
		
		if (this._oDialog) {
			this._oDialog.destroy();
		}
		
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
	onClose: function () {
		if (this._oDialog) {
			this._oDialog.destroy();
		}
	},
	// onSubmit event handler of the fragment
    onSubmitProject : function() {
    	var thisDomObj = this;
    	var oProject = {
    			Project_Name: "none", 
    			Project_DEscription: "none",  
    			Project_Deadline: "none",
    			Project_StartDate: "none", 
    			Project_OnSite: "none",
    			Project_Creator:"none"
			};
    	
    	var _Name = sap.ui.getCore().byId("p_Name").getValue();
    	var _Description = sap.ui.getCore().byId("p_Description").getValue();
    	var _Deadline = sap.ui.getCore().byId("p_Deadline").getValue();
    	var _StartDate = sap.ui.getCore().byId("p_StartDate").getValue();
    	//var _OnSite = sap.ui.getCore().byId("p_OnSite").getValue();
    	var b_OnSite = sap.ui.getCore().byId("p_OnSite").getSelected();;
    	var _OnSite;
    	if(b_OnSite){
    		_OnSite = 1;
    	}else{
    		_OnSite = 0;
    	}
//    	var oModel2 =  new sap.ui.model.odata.v2.ODataModel('http://localhost:8080/OdataSap/emplist.svc/'); 
    	oProject.Project_Name = _Name;
    	oProject.Project_Description = _Description;
    	oProject.Project_Deadline = _Deadline;
    	oProject.Project_StartDate = _StartDate;
    	oProject.Project_OnSite = _OnSite;    
    	$.post('CreateProject', { Name: _Name ,ClientID: 2,Desc: _Description, Deadl: _Deadline ,StartDate: _StartDate,OnSite:  _OnSite, Project_Creator: this.getConsultantID()},
    		function(responseText) {  
    		//var array = responseText.split(';');
    		MessageToast.show("Project Created Succesfully");
    		//ensures that newly created project is selected
    		var selectFirstProject = false;
    		thisDomObj.goToProjects(selectFirstProject);    		
    		
    	});
	
    	//close model
		this.onClose();
    	
    },
	onDelete: function(){
		var _projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
		console.log(_projectID);
		$.post('DeleteProject', { projectID: _projectID},function(responseText) {  
			    	 // var array = responseText.split(';');
			    	console.log(responseText);
			   });
				
			this.refreshData();
				
				//close model
			this._Dialog.destroy();
				
		},
		onRemove: function(oEvent){
				var _projectID = sap.ui.getCore().getModel("groupMember").getProperty("/Consultants");
				var Assignment_ID = sap.ui.getCore().byId("idRemoveCon").getSelectedKey();
				
				
//				$.post('UnassignConsultant', { assignment: 10},function(responseText) {  
//					// var array = responseText.split(';');
//					console.log(responseText);
//				});
				console.log("Assignment_ID" + _projectID);
				
		},
		//*********************************************************************//
		//the following functions are to handle functionality in the Members tab
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
		         $.post('getProjectConsultants',function(responseText){
						console.log("servlet getProjectConsultants responded");
						console.log(responseText);
						arrConsultants = {Consultants:[]};
						var array = responseText.split(';');
						array.forEach(createConsultant);
						
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(JSON.parse(JSON.stringify(arrConsultants)));
//						console.log(JSON.parse(JSON.stringify(arrConsultants)));
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
//				    		console.log(arrProjects);
				    		
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
		handleClose: function(oEvent) {
			
			
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length) {
				this.oUnassign = aContexts.map(
						function(oContext) {
							var assignmentID=oContext.getObject().Assignment_ID;
							
							$.post('UnassignConsultant', { 
								assignment: assignmentID},
								function(data) {  
								var array = data.split(';');
								console.log(data);
							});
							return oContext.getObject().Assignment_ID; 
						}
				).join(", ");
				
				
				MessageToast.show("You have chosen " + this.oUnassign);
//					this.oUnassugn  = oContext.getObject().ConsultantDetails.Consultant_ID;
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		
			console.log("Assignment_ID" + this.oUnassign);
//			this.refreshData();
		},
		handleClose2: function(oEvent) {
			var aContexts = oEvent.getParameter("selectedContexts");
			var oModel = this.getView().getModel("projectsModel");
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
//					console.log("test: "+JSON.stringify(oContext.getObject()));
//					console.log("Consultant_ID " + oContext.getObject().Consultant_ID);
//					console.log("Project_ID " + oModel.oData.Project_ID);
					var consultantID = oContext.getObject().Consultant_ID;
					var projectID = oModel.oData.Project_ID;
					$.post('AssignConsultants', { 
						project: projectID,
						consultant: consultantID},
						function(data) {  
						var array = data.split(';');
						console.log(data);
					});
					return oContext.getObject().Consultant_Name; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			
//			oEvent.getSource().getBinding("items").filter([]);
			
		},
		//Members tab functions end here
		//*********************************************************************//
		
		
		//*********************************************************************//
		//The following section contains functions under the Tasks tab
		onRemoveTaskFromProject: function(oEvent){
//			create model to display list of consultants
			this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formRemoveTaskFromProject",this);
			this._Dialog.setModel(this.getView().getModel("tasksModel"),"tasksModel");
			
			
			// Multi-select if required
			var bMultiSelect = !!oEvent.getSource().data("multi");
			this._Dialog.setMultiSelect(bMultiSelect);
			
			// Remember selections if required
			var bRemember = !!oEvent.getSource().data("remember");
			this._Dialog.setRememberSelections(bRemember);

			this._Dialog.open();
		},
		handleCloseRemoveTask: function(oEvent){
			var aContexts = oEvent.getParameter("selectedContexts");
			console.log(aContexts);
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
					console.log("test: "+JSON.stringify(oContext.getObject()));
					return oContext.getObject().TaskDetails.Name; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onAddTask: function(){
			 this._DialogAddTask = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddTaskToProject", this);
			 this._DialogAddTask.open();
		},
		handleCloseAddTask: function(oEvent){
			var aContexts = oEvent.getParameter("selectedContexts");
			console.log(aContexts);
			if (aContexts && aContexts.length) {
				MessageToast.show("You have chosen " + aContexts.map(function(oContext) {
					console.log("test: "+JSON.stringify(oContext.getObject()));
					return oContext.getObject().TaskDetails/Name; }).join(", "));
			} else {
				MessageToast.show("No new item was selected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onSubmitTask: function(){
			console.log("Start creating task");
			
	    	var _Name = sap.ui.getCore().byId("t_Name").getValue();
	    	var _Description = sap.ui.getCore().byId("t_Description").getValue();
	    	var _DueDate = sap.ui.getCore().byId("t_Deadline").getValue();
	    	var _projectID = this.oProjectId;
//	    	
	    	  $.post('createTask',{description: _Description,dueDate: _DueDate,name:_Name, projectID: _projectID},function(responseText){
	    		  console.log("Creating task completed");
//					console.log("Done!");
				});
	    	  
	    	//close model
			this._DialogAddTask.destroy();
		
		},
		//Task tabs functions ends here
		//*********************************************************************//
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
		                	
		 },
		 onRemove: function(oEvent){
				var _projectID = sap.ui.getCore().getModel("groupMember").getProperty("/Consultants");
				var Assignment_ID = sap.ui.getCore().byId("idRemoveCon").getSelectedKey();
				
				
//				$.post('UnassignConsultant', { assignment: 10},function(responseText) {  
//					// var array = responseText.split(';');
//					console.log(responseText);
//				});
				console.log("Assignment_ID" + _projectID);

		},
		refreshData : function(oEvent){
		    	//Begin Refresh PRojects
		    	var oModel = new sap.ui.model.json.JSONModel();
				var oDataProjects =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
				var arrProjects = {Projects:[]};
				var arrConsultants = {Consultants:[]};
				oDataProjects.read(
						"/Projects?$expand=ClientDetails&$filter=Project_Deleted%20eq%20false",{success: function(oCreatedEn){ GotProjects(oCreatedEn) }, error: function(){console.log("Error");}}		
				);
				
//				$.post('getProjects',function(responseText){
//					console.log("servlet responded");
				function GotProjects(oCreatedEn){
//					arrProjects = {Projects:[]};
//					var array = responseText.split(';');
					//array.forEach(createProjectObj);
							
					oModel.setData(oCreatedEn);
					console.log(oCreatedEn);
					sap.ui.getCore().setModel(oModel);
					app.to("detailPage");
				}
		    	//End Refresh PRojects

		    	//BEgin refresh get members
		    	var oDataProjects =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
				//get selected project id
				var sOrderId = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
				//get model
				var oData = sap.ui.getCore().getModel().getProperty("/results");
				
				oDataProjects.read(
						"/Assignments?$expand=ConsultantDetails,ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ GotMembers(oCreatedEn) }, error: function(){console.log("Error");}}		
						);
		    	function GotMembers(Members){
					console.log(Members);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(Members);
					//console.log(JSON.parse(JSON.stringify(arrConsultants)));
					sap.ui.getCore().setModel(oModel,"groupMember");
					app.to("detailPage");
				}
		    	//END refresh get members
		    	
		    	//Begin Refresh Members
		    	var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
				attachModel.read(
						"/Tasks?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ gotTasks(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
						);
				
				function gotTasks(tasks){
					console.log(tasks);
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.setData(tasks);
					
					sap.ui.getCore().setModel(oModel,"tasks");
					app.to("detailPage");
				}
		    	//END Refresh Members


					
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
//			    		console.log(arrProjects);
			    		
				}
				
				

				
//				oModel.setData();
//				sap.ui.getCore().setModel(oModel);
//				app.to("detailPage");	
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
					
//					var model = sap.ui.getCore().getModel("tasks");
//					  console.log(model);
//					   
//					  var path = oEvent.getSource().getBindingContext().getPath();
//					  var obj = model.getProperty(path);
					 console.log(oItem);
//					console.log("TaskID");
//					console.log(taskID);
					var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
					attachModel.read(
							"/Feedbacks?$expand=TaskDetails&$filter=TaskDetails/Task_ID%20eq%201",{async:false,success: function(oCreatedEn){ gotTasks(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
							);
					
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
//				console.log(id);
				$.post("CreateFeedback", {msg:sValue,consultant:2,project:sOrderId,task:id},function(responseText) {  
			      	// var array = responseText.split(';');
			      	  //console.log(responseText);
				  
			        });
				
				
			},
			onSelectionChange: function(oEvent) {
		          var oSelectedItem = oEvent.getParameter("listItem");
		          var oModel = oSelectedItem.getBindingContext("tasks").getObject();
		          //console.log(oModel.Task_ID);
		          var taskID = {id:0};
		          taskID.id = oModel.Task_ID;
		          var TaskIDModel = new sap.ui.model.json.JSONModel();
		          TaskIDModel.setData(taskID);
		          sap.ui.getCore().setModel(TaskIDModel,"taskID");
		          var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
					attachModel.read(
							"/Feedbacks?$expand=TaskDetails&$filter=TaskDetails/Task_ID%20eq%20"+oModel.Task_ID,{async:false,success: function(oCreatedEn){ gotTasks(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
							);
					
					function gotTasks(tasks){
						console.log(tasks);
						var oModel = new sap.ui.model.json.JSONModel();
						oModel.setData(tasks);
						
						sap.ui.getCore().setModel(oModel,"feedback");
						app.to("detailPage");
					}
		        },
		        getFeedback: function(oEvent){
				 //console.log("Oevent");
//				var myE = oEvent;
//				var myE2 = oEvent.getSource().getParent();
//				var myE3 = oEvent.getSource().getParent().getParent();
//				console.log(myE);
//				console.log(myE2);
//				console.log(myE3);
				 //console.log(oEvent.getSource().getParent().getParent());
//				//Get feed back 
//				 var oSelectedItem = oEvent.getSource().getParent().getParent().getParameter("listItem");
//		         var oModel = oSelectedItem.getBindingContext("tasks").getObject();
//		         console.log(oModel.Task_ID);
		         
				
				
				
				 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.feedback", this);
				 this._Dialog.open();
			},
			onFeedback : function(){
				
			},
			progress: function(){
				 sap.m.MessageToast.show("Progress triggered");
			},
			//End of Code for Task tab
			//Code for Attachment tab 
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
					
					
					// Create a File Reader object
					
			},
			handleUploadPress: function(oEvent) {
						var oFileUploader = this.byId("fileUploader");
						oFileUploader.upload();
			},
			deleteTask: function(){
						var id = sap.ui.getCore().getModel("taskID").getProperty("/id");
						
						$.post('removeAssignedTask',{taskID:id},function(responseText){
				    		  
								console.log("Removed task!");
							});
				},
				openManageConFrag: function(){
						 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.feedback", this);
						 this._Dialog.open();
				},
				onAfterRendering: function() {
						
				}

		});
});
	