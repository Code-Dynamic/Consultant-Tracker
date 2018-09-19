var btnConsultantSelected = false;
sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller){
	
"use strict";
//TODO Ngoni change code to prevent use of globals
var PROJECT_ID;
var RatingIndicatorArr;
var RatingResults;
var RatingsErrTxt;

return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterAdmin", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf splitapp.master
	 */
	onInit: function() {
		var oRouter = this.getRouter();
		oRouter.getRoute("MasterAdmin").attachMatched(this.onRouteMatched, this);
		this.checkDeviceTypeAndDisplayProjects();
	},
	checkDeviceTypeAndDisplayProjects: function(){
		var selectFirstProject = true;
		this.setDeviceType();
		if(this.isDeviceMobile()){
			 this.goToProjects();
		} else{
			this.goToProjects(selectFirstProject);
		}
	},
	onRouteMatched: function(oEvent){
		var oArgs = oEvent.getParameter("arguments");
		if(sessionStorage){
			sessionStorage.ConsultantID = oArgs.consultantId;
			sessionStorage.ConsultantAdmin = true;
		}
		else{
			ConsultantAdmin = true;
			ConsultantID = oArgs.consultantId;
		}
	},
	onSearchProject: function(oEvent) {
		
      var searchString = this.getView().byId("projectSearchField").getValue();
      this.searchProjects(searchString);
      
	},
	onSearchConsultant: function(oEvent) {
		
	      var searchString = this.getView().byId("consultantSearchField").getValue();
	      this.searchConsultants(searchString);
	      
	},
	onProjectListItemPress: function(evt){
		var sPath = evt.getSource().getBindingContext("projectsModel").getPath();
		var oData = this.getView().getModel("projectsModel").getProperty(sPath);
		
		//NB as a manager you can view all projects under you
		var projectID = oData.Project_ID;
		//console.log(projectID);
		this.getRouter().navTo("DetailAdmin", 
		{projectId:projectID});
		
		PROJECT_ID = projectID;
		var consultantID = this.getConsultantID();		
		//console.log("Project ID: "+ projectID);
		//RATINGS CODE
		var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
		var projectCompleted =  oData.Project_Completed;
		var thisObj = this;
		//console.log(projectCompleted);
		attachModel.read(
				"/Ratings_Entrys?$expand=ProjectDetails,ConsultantDetails&$filter=ProjectDetails/Project_ID%20eq%20"+projectID+"%20and%20ConsultantDetails/Consultant_ID%20eq%20"+consultantID,{async:false,success: function(oCreatedEn){ thisObj.ratingsBtnConfig(oCreatedEn,projectCompleted) }, error: function(e){console.log(e);}}		
				);					
		
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
	 onConsultantListItemPress: function(evt){
		
		
		var sPath = evt.getSource().getBindingContext("consultantsModel").getPath();
		var oData = this.getView().getModel("consultantsModel").getProperty(sPath);
		//NB as a manager you can view all projects under you
//		var oProjectId = evt.getSource().getBindingContext("projectsModel").getProperty("projectsModel>/Project_ID");
//		var model = evt.getSource("projectsModel");
//		console.log(oData.Project_ID);
		var oConsultantId = oData.Consultant_ID;
		
		this.getRouter()
			.navTo("DetailConsultantView", 
				{consultantId:oConsultantId});
//		console.log(sListId);
	/*	MessageToast.show("Pressed : " + evt.getSource().getTitle());*/
		
	},
	onPressButton: function(evt){
		
	},
	onSearch: function(evt){
	
	},
	onSelectionChange: function (oEvent) {
		//the selected item could be found via the "item" parameter of "selectionChange" event
		sap.m.MessageToast.show("oEvent.getParameter('item').getText(): " + oEvent.getParameter("item").getText() + " selected");
		//the selected item could also be found via the "selectItem" association not only when "selectionChange" but when needed
		this.byId('selectedItem').setText("getSelectedItem(): " +
		sap.ui.getCore().byId(this.byId('item').getSelectedItem()).getText());
	},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf splitapp.master
	 */
//	onBeforeRendering: function() {

//	},
/*	onAfterRendering: function() {

	},	*/


	onSelect: function(oEvent) {
	
		if(btnConsultantSelected){

			var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Consultant_ID");
			var oData = sap.ui.getCore().getModel().getProperty("/results");
//			var oDataConsultants =  new sap.ui.model.odata.ODataModel('http://localhost:8080/OdataSap/emplist.svc/'); 
//			oDataConsultants.read(
//					"/Consultants?$filter=Consultant_ID%20eq%20"+sOrderId,{success: function(oCreatedEn){ GotConsultants(oCreatedEn) }, error: function(){console.log("Error");}}		
//			);

			function getCountryByCode(Consultant_ID) {
				return oData.filter(
						function(oData) {
							return oData.Consultant_ID == Consultant_ID
						}
				);
			}

			var found = getCountryByCode(sOrderId);
			//console.log(found[0])

			var oSelModel = new sap.ui.model.json.JSONModel(found[0]);			
			sap.ui.getCore().setModel(oSelModel,"selModel");					


		}else{
			console.log("Project Selected--> on select");
			var oDataProjects =  new sap.ui.model.odata.ODataModel(this.getModelAddress()); 
			//get selected project id
			var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Project_ID");
			//get model
			var oData = sap.ui.getCore().getModel().getProperty("/results");
			
			oDataProjects.read(
					"/Assignments?$expand=ConsultantDetails,ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ GotMembers(oCreatedEn) }, error: function(){console.log("Error");}}		
					);
			//get the specific project selected data 
//			$.post('getProjectConsultants',{ projectID: sOrderId},function(responseText){
//				console.log("servlet getProjectConsultants responded");
				//console.log(responseText);
//				arrConsultants = {Consultants:[]};
//				var array = responseText.split(';');
//				array.forEach(createConsultant);

			function GotMembers(Members){
				console.log(Members);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(Members);
				//console.log(JSON.parse(JSON.stringify(arrConsultants)));
				sap.ui.getCore().setModel(oModel,"groupMember");
				app.to("detailPage");
			}

//			});

			function createConsultant(stringVal){
				var array = stringVal.split(',');
				var Consultant = {
						Consultant_ID: array[0],
						Consultant_Name : array[1],
						Consultant_Surname : array[2],
						Consultant_email : array[3],
						Consultant_Cell : array[4],
						Consultant_Admin : array[5],
						Assignment_ID: array[6]
				};
				arrConsultants.Consultants.push((Consultant));
				console.log("arrConsultants" + arrConsultants);

			}
			function getCountryByCode(Project_ID) {
				return oData.filter(
						function(oData) {
							return oData.Project_ID == Project_ID
						}
				);
			}

			var found = getCountryByCode(sOrderId);
			var oSelModel = new sap.ui.model.json.JSONModel(found[0]);			
			sap.ui.getCore().setModel(oSelModel,"selModel");
			
//Start Code to display Attachments
			var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
			console.log("Project Id= "+sOrderId);
			attachModel.read(
					"/Attachments?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ gotAttachments(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
					);
			
			function gotAttachments(attach){
				console.log(attach);
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(attach);
				//console.log(JSON.parse(JSON.stringify(arrConsultants)));
				sap.ui.getCore().setModel(oModel,"attachment");
				app.to("detailPage");
			}
			
//End Code to display Attachments
			//Start code diplay task
			var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
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

		}

	},
    onFeedbackPress: function(){
        this.getRouter().navTo("Feedback");
    },
	addProject: function(){
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddProject",this);
		this._oDialog.open();		
	},
	confirmDeleteProject: function(){
//		console.log("removing projects");
		this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.confirmDelete",this);
		this._Dialog.open();

	},
	addClient: function(){
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddClient",this);
		this._oDialog.open();		
	},
	addConsultant: function(){
		this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultant",this);
		this._Dialog.open();
   },
	onSubmitClient: function(){
    	var _Name = sap.ui.getCore().byId("c_Name").getValue();
    	var _EmailAddress = sap.ui.getCore().byId("c_Email").getValue();
    	var _PhysicalAddress = sap.ui.getCore().byId("c_Address").getValue();
    	var _Number = sap.ui.getCore().byId("c_Number").getValue();
    	
    	$.post('AddClient', { Name: _Name ,EmailAddress: _EmailAddress,PhysicalAddress: _PhysicalAddress, Number: _Number, Latitude:-25.780221, Longitude: 28.277232},
        		function(responseText) {  
      				MessageToast.show("client submitted Succesfully");
    				console.log(responseText);
        		}
    	);
    	
    	//close model
    	this.onClose();
    },
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
	    		MessageToast.show("project submitted Succesfully");
	    		//ensures that newly created project is selected
	    		var selectFirstProject = false;
	    		thisDomObj.goToProjects(selectFirstProject);    		
	    	});
	    	//close model
			this.onClose();
	    	
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
	    	var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(this.getModelAddress()); 
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
					MessageToast.show("Consultant submitted Succesfully");
					thisDomObj.goToConsultants();
					oDataProjects.submitChanges({async:false});
					},
				sucesss: function(){ console.log(("posting Project(sucess) It Worked!!")); }
				, error:function(){console.log("Error in posting Project");}
	    	});
	    	
	    	//close model
	    	this.onClose();

	    },
	    addConsultantsViaCSV : function(){
//	    	console.log("CSV function in MasterAdmin");
	    	
//			console.log(oEvent);
//			MessageToast.show(oEvent.getParameters("fileName"));
			var fU = sap.ui.getCore().byId("csvUploader");
//			console.log("csvUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			
			if (this._Dialog) {
				this._Dialog.destroy();
			}
			
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			
			reader.onload = function(e) {
			    var strCSV = e.target.result;
			    var rows = strCSV.split("\n");

			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress()); 
		    	var i;
			    for (i = 1; i < rows.length; i++) { 
			    	var _name = (rows[i].split(",")[0]).trim();              
			    	var _surname = (rows[i].split(",")[1]).trim();           
			    	var _email = (rows[i].split(",")[2]).trim();             
			    	var _cell = (rows[i].split(",")[3]).trim();              
			    	var _admin = "0";
			    	
			    	$.post('createConsultant', { 
						name: _name,
						surname: _surname,
						email: _email,
						cell: _cell,
						admin: _admin }, 
						function(responseText) {
//							console.log("At adding User Equivalent: "+responseText);
							$.post('CreateUser', 
									{password:"default", conID:responseText}
							);
						}
					);
			    }
			    MessageToast.show((rows.length-1)+" Consultants, succesfully added.");
			};
			reader.readAsBinaryString(file);
			
		},
		addProjectsViaCSV : function(){
			var fU = sap.ui.getCore().byId("csvUploader");
//			console.log("csvUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			
			reader.onload = function(e) {
			    var strCSV = e.target.result;
			    var rows = strCSV.split("\n");
			    
			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress()); 
		    	var i;
			    for (i = 1; i < rows.length; i++) { 
			    	var _Name = (rows[i].split(",")[0]).trim();
			    	var _Description = (rows[i].split(",")[1]).trim();
			    	var _StartDate = (rows[i].split(",")[2]).trim();
			    	var _Deadline = (rows[i].split(",")[3]).trim();
			    	var _OnSite = (rows[i].split(",")[4]).trim();
			    	var _cilentID = (rows[i].split(",")[5]).trim();
			    	
			    	$.post('CreateProject', { 
			    		Name: _Name ,
			    		ClientID: _cilentID,
			    		Desc: _Description, 
			    		Deadl: _Deadline ,
			    		StartDate: _StartDate,
			    		OnSite:  _OnSite, 
			    		Project_Creator: t.getConsultantID()
			    	});
			    }
			    MessageToast.show((rows.length-1)+" Projects, succesfully added.");
			};
			reader.readAsBinaryString(file);
		},
		addClientsViaCSV : function(){
			var fU = sap.ui.getCore().byId("csvUploader");
//			console.log("csvUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			
			if (this._oDialog) {
				this._oDialog.destroy();
			}
			
			// Create a File Reader object
			var reader = new FileReader();
			var t = this;
			
			reader.onload = function(e) {
			    var strCSV = e.target.result;
			    var rows = strCSV.split("\n");
			    
			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress());
		    	var i;
			    for (i = 1; i < rows.length; i++) { 
			    	var _Name = (rows[i].split(",")[0]).trim();
			    	var _Email = (rows[i].split(",")[1]).trim();
			    	var _Cell = (rows[i].split(",")[2]).trim();
			    	var _Address = (rows[i].split(",")[3]).trim();
			    	var _Latitude = (rows[i].split(",")[4]).trim();
			    	var _Longitude = (rows[i].split(",")[5]).trim();
			    	
			    	$.post('AddClient', { Name: _Name ,EmailAddress: _Email,PhysicalAddress: _Address, Number: _Cell, Latitude:_Latitude, Longitude:_Longitude},
			        		function(responseText) {  
//			      				MessageToast.show("client submitted Succesfully");
//			    				console.log(responseText);
			        		}
			    	);
			    }
			    MessageToast.show((rows.length-1)+" Clients, succesfully added.");
			};
			reader.readAsBinaryString(file);
		},
		onClose: function () {
//		console.log("on close button");
		if (this._oDialog) {
			this._oDialog.destroy();
		}
		
		if(this._Dialog){
			this._Dialog.destroy();
		}
//		this._oDialog.destroy();
	},
	
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf splitapp.master
	 */

//	onExit: function() {

//	}

		});
});