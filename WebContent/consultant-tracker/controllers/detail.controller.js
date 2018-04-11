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
			addMember: function(){
				//code to add consultant
				console.log("Adding member");
				
				var Client_ID = sap.ui.getCore().byId("idSelected").getSelectedKey();
				var _projectID = sap.ui.getCore().getModel("selModel").getProperty("/Project_ID");
				console.log(Client_ID);
				$.post('AssignConsultants', { project:_projectID ,consultant: Client_ID},function(responseText) {  
					// var array = responseText.split(';');
					console.log(responseText);
				});
				
				console.log(" Finished Adding member")
				
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