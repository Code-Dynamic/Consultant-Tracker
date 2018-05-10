sap.ui.controller("consultant-tracker.controllers.detail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitapp.detail
*/
	onInit: function() {
		/*var oView = this.getView();

		// Show the appropriate action buttons
		oView.byId("__button0").setVisible(false);*/
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf splitapp.detail
*/
//	onBeforeRendering: function() {
//
//	},
			goToSecondPage : function(oEvt){	
				app.to("detail2Page");
			},
			onSelectionChange: function(){
				//need to add path to go to consultant page
				
			},
			onDeleteConsultantFromProject: function(){
				this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.formRemoveConsultantFromProject",this);
				this._Dialog.open();
							
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
				this.refreshData();
			},
			addMember: function(){
				//code to add consultant
				//console.log("Adding member");
				
				var Client_ID = sap.ui.getCore().byId("idSelected").getSelectedKey();
				var _projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
				//console.log(Client_ID);
				$.post('AssignConsultants', { project:_projectID ,consultant: Client_ID},function(responseText) {  
					// var array = responseText.split(';');
					console.log(responseText);
				});
				
				//console.log(" Finished Adding member")
				this.refreshData();
				//close model
				this._Dialog.destroy();
			},
			addConsultantToProject: function(){
				this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.formAddConsultanttoProject",this);
				this._Dialog.open();
				
				
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
						console.log(JSON.parse(JSON.stringify(arrConsultants)));
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
			//openfragment
			confirmDeleteProject: function(){
					this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.confirmDelete",this);
					this._Dialog.open();

			},
			confirmRemoveConsultant: function(){
				this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.confirmRemove",this);
				this._Dialog.open();

		},
			// onClose event handler of the fragment
			onCancel : function() {
		                this._Dialog.destroy();
		    },
		    
		    refreshData : function(oEvt){
				var oModel = new sap.ui.model.json.JSONModel();
				var arrProjects = {Projects:[]};
				var arrConsultants = {Consultants:[]};
				
				
//				$.post('getProjects',function(responseText){
////					console.log("servlet responded");
//					arrProjects = {Projects:[]};
//					var array = responseText.split(';');
//					array.forEach(createProjectObj);
//							
//					oModel.setData(JSON.parse(JSON.stringify(arrProjects)));
//					console.log(JSON.parse(JSON.stringify(arrProjects)));
//					sap.ui.getCore().setModel(oModel);
//					//app.to("detailPage");
//				});
					
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
					
					console.log("TaskID");
					console.log(taskID);
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
			onAddTask: function(){
				 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.addTask", this);
				 this._Dialog.open();
			},
			onFeedback : function(){
				
			},
			 onCancle :function(){
				 this._Dialog.destroy();
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
						if (!oFileUploader.getValue()) {
							MessageToast.show("Choose a file first");
							return;
						}
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
					//End of Code for Attachment tab 
					//Start of code for Task
					onSubmitTask: function(){
						console.log("Start creating task");
						
				    	var _Name = sap.ui.getCore().byId("t_Name").getValue();
				    	var _Description = sap.ui.getCore().byId("t_Description").getValue();
				    	var _DueDate = sap.ui.getCore().byId("t_Deadline").getValue();
				    	var _projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
				    	
				    	  $.post('createTask',{description: _Description,dueDate: _DueDate,name:_Name, projectID: _projectID},function(responseText){
				    		  console.log("Creating task completed");
								console.log("Done!");
							});
				    	  
				    	
				    	//close model
						this._Dialog.destroy();
					
					},
					//End of code for Task
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf splitapp.detail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf splitapp.detail
*/
//	onExit: function() {
//
//	}

});