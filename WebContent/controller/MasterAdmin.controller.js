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
var RatingIndicatorArr;
var RatingResults;
var RatingsErrTxt;
var consultantId;
var OModel;
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
		OModel = this.getOwnerComponent().getModel("oModel");
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
		consultantId = oArgs.consultantId; 
		if(sessionStorage){
			sessionStorage.ConsultantID = oArgs.consultantId;
			sessionStorage.ConsultantAdmin = true;
		}
		else{
			ConsultantAdmin = true;
			ConsultantID = oArgs.consultantId;
		}
		var oModel = this.getOwnerComponent().getModel("oModel");
		var thisObj = this;
		oModel.read( "/Users", {
			urlParameters:{
				"$expand": "ConsultantDetails"
			},
			filters: [ new sap.ui.model.Filter({
		          path: "ConsultantDetails/Consultant_ID",
		          operator: sap.ui.model.FilterOperator.EQ,
		          value1: oArgs.consultantId
		     })],
	    	success: function(data){
	    	 	if(data.results.length > 0 && !data.results[0].Completed){
	    	 		var consultantModel = new sap.ui.model.json.JSONModel();
	    	 		consultantModel.setData(data);
	    	 		thisObj._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.updateUserDetails",thisObj);
	    	 		thisObj._Dialog.setModel(consultantModel,"consultantModel");
	    	 		console.log(consultantModel);
	    	 		thisObj._Dialog.open();
	    	 	}
	 		}, 
	 		error: function(oError){
				sap.m.MessageToast.show('Unable to extract user details');
	 		}
	 	});	
	},
	onSearchProject: function(oEvent) {
		
      var searchString = this.getView().byId("projectSearchField").getValue();
      this.searchProjects(searchString, "Admin");
      
	},
	onSearchConsultant: function(oEvent) {
		
	      var searchString = this.getView().byId("consultantSearchField").getValue();
	      this.searchConsultants(searchString);
	      
	},
	onProjectListItemPress: function(evt){
		var sPath = evt.getSource().getBindingContext("projectsModel").getPath();
		var oData = this.getView().getModel("projectsModel").getProperty(sPath);
		
		//NB as a manager you can view all projects under you
		console.log(oData);
		var projectID;
		if (oData.ProjectDetails != null)
			projectID = oData.ProjectDetails.Project_ID;
		else
			projectID = oData.Project_ID;
			
		var consultantId = this.getConsultantID();
		console.log("in MasterAdmin ID:" +consultantId);

		
		this.getRouter().navTo("DetailAdmin", 
		{projectId:projectID,consultantId: consultantId});
		
		PROJECT_ID = projectID;
		var consultantID = this.getConsultantID();		
		//console.log("Project ID: "+ projectID);
		//RATINGS CODE
		var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
		var projectCompleted =  oData.Project_Completed;
		var thisObj = this;
		//console.log(projectCompleted);
//		attachModel.read(
//				"/Ratings_Entrys?$expand=ProjectDetails,ConsultantDetails&$filter=ProjectDetails/Project_ID%20eq%20"+projectID+"%20and%20ConsultantDetails/Consultant_ID%20eq%20"+consultantID,{async:false,success: function(oCreatedEn){ thisObj.ratingsBtnConfig(oCreatedEn,projectCompleted) }, error: function(e){console.log(e);}}		
//				);					
		var oModel = this.getOwnerComponent().getModel("oModel");
		oModel.read( "/Ratings_Entrys", {
			urlparameters:{
				"$expand": "ProjectDetails, ConsultantDetails"
			},
			filters: [ new sap.ui.model.Filter({
		        path: "ProjectDetails/Project_ID",
		        operator: sap.ui.model.FilterOperator.EQ,
		        value1: projectID,
		        path:"ConsultantDetails/Consultant_ID",
		        operator: sap.ui.model.FilterOperator.EQ,
		        value1: consultantID
		     })],
	    	async:false,
	    	success: function(oCreatedEn){ 
	    		thisObj.ratingsBtnConfig(oCreatedEn,projectCompleted) 
	    	}, 
	    	error: function(error){
	    		console.log(error);
	    	}
	    });
		
		//TODO fix project progress
		$.post('GetProjectProgress',{Project_Id:projectID},function(responseText){
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
		var oConsultantId;
		var thisObj = this;
		if (oData.User_TypeDetails != null)
			oConsultantId =  oData.Consultant_ID;
		else
			oConsultantId = oData.ConsultantDetails.Consultant_ID;
		thisObj.getRouter().navTo("DetailConsultantView",{consultantId:oConsultantId});
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
//			var oDataProjects =  new sap.ui.model.odata.ODataModel(this.getModelAddress()); 
			//get selected project id
			var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Project_ID");
			//get model
			var oData = sap.ui.getCore().getModel().getProperty("/results");
			
//			oDataProjects.read(
//					"/Assignments?$expand=ConsultantDetails,ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ GotMembers(oCreatedEn) }, error: function(){console.log("Error");}}		
//					);
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read( "/Assignments", {
				urlParameters:{
					"$expand": "ConsultantDetails,ProjectDetails"
				},
				filters: [ new sap.ui.model.Filter({
			        path: "ProjectDetails/Project_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1: sOrderId
			     })],
		    	async:false,
		    	success: function(oCreatedEn){
		    		GotMembers(oCreatedEn) 
		    	},
		    	error: function(){
		    		console.log("Error");
		    	}
		 	});
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
//			var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
			console.log("Project Id= "+sOrderId);
//			attachModel.read(
//					"/Attachments?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ gotAttachments(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
//					);
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read( "/Attachments", {
				urlParameters:{
					"$expand": "ProjectDetails"
				},
				filters: [ new sap.ui.model.Filter({
			        path: "ProjectDetails/Project_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1: sOrderId
			     })],
		    	async:false,
		    	success: function(oCreatedEn){
		    		gotAttachments(oCreatedEn) 
		    	},
		    	error: function(){
		    		console.log("Error");
		    	}
		 	});
			
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
//			var attachModel = new sap.ui.model.odata.ODataModel(this.getModelAddress());
//			attachModel.read(
//					"/Tasks?$expand=ProjectDetails&$filter=ProjectDetails/Project_ID%20eq%20"+sOrderId,{async:false,success: function(oCreatedEn){ gotTasks(oCreatedEn) }, error: function(){console.log("Error in getting attachments");}}		
//					);
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.read( "/Tasks", {
				urlParameters:{
					"$expand": "ProjectDetails"
				},
				filters: [ new sap.ui.model.Filter({
			        path: "ProjectDetails/Project_ID",
			        operator: sap.ui.model.FilterOperator.EQ,
			        value1: sOrderId
			    })],
		    	async:false,
		    	success: function(oCreatedEn){
		    		gotTasks(oCreatedEn) 
		    	},
		    	error: function(){
		    		console.log("Error");
		    	}
		 	});
			
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
		this.onClose();
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddProject",this);
		this._oDialog.open();		
	},
	removeProject: function(oEvent){
		this.onClose();
		var projectModel = this.getView().getModel("projectsModel");
		
		this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.confirmDeleteProject",this);
		this._Dialog.setModel(projectModel,"projectsModel");		

		this._Dialog.open();

	},
	addClient: function(){
		this.onClose();
		this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddClient",this);
		this._oDialog.open();		
	},
	addConsultant: function(){
		this.onClose();
		this._Dialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.formAddConsultant",this);
		this._Dialog.open();
   },
   setClientsModel: function(){
		var clientDetailModel = new JSONModel();
		OModel.read("/Clients", {
			  success: function(data){
				 var result = JSON.stringify(data);
				 clientDetailModel.setData(data);
//				 console.log(result);
				// console.log("clientsModel##");
//				 console.log(data);
				 sap.ui.getCore().setModel(clientDetailModel,"clientList");
//					console.log("Cli##");
//					console.log(clientDetailModel.oData.results);
			  },
			  error: function(oError) {
//				  console.log("error");
				  console.log("Error");
				 }
		});
	},
	onSubmitClient: function(){
		var thisObj = this;
		var check = 0;
    	var _ClientName = sap.ui.getCore().byId("c_Name").getValue();
    	if(this.checkValueEntered(_ClientName,"c_Name")){
    		check++;
    	}
    	var _ClientPhysicalAddress = sap.ui.getCore().byId("c_Address").getValue();
    	if(this.checkValueEntered(_ClientPhysicalAddress,"c_Address")){
    		check++;
    	}
    	var _ClientNumber = sap.ui.getCore().byId("c_Number").getValue();
    	if(this.checkValueEntered(_ClientNumber,"c_Number")){
    		check++;
    	}
    	var numSuccesfulTests = 3;
    	if(check === numSuccesfulTests){
        	var _ContactName = sap.ui.getCore().byId("c_ContactPersonName").getValue();
        	var _ContactNumber = sap.ui.getCore().byId("c_ContactPersonCell").getValue();
        	var _ContactEmailAddress = sap.ui.getCore().byId("c_ContactPersonEmail").getValue();
        	$.post('AddClient', { ClientName: _ClientName, ClientPhysicalAddress: _ClientPhysicalAddress, ClientNumber: _ClientNumber,ContactName: _ContactName, ContactNumber: _ContactNumber, ContactEmailAddress: _ContactEmailAddress, Latitude: 0, Longitude: 0},
            		function(responseText) {  
          				MessageToast.show("Client Submitted Succesfully");
        				console.log(responseText);
        				thisObj.setClientsModel(PROJECT_ID);
            		}
        	);
        	//close model
        	this.onClose();   		
    	}

    },
	 onSubmitProject: function() {
	    	var thisDomObj = this;
	    	var check = 0;
	    	var _Name = sap.ui.getCore().byId("p_Name").getValue();
	    	if(this.checkValueEntered(_Name,"p_Name")){
	    		check++;
	    	}
	    	var _Description = sap.ui.getCore().byId("p_Description").getValue();
	    	if(this.checkValueEntered(_Description,"p_Description")){
	    		check++;
	    	}
	    	var _Deadline = sap.ui.getCore().byId("p_Deadline").getValue();
	    	if(this.checkValueEntered(_Deadline,"p_Deadline")){
	    		check++;
	    	}	    	
	    	var _StartDate = sap.ui.getCore().byId("p_StartDate").getValue();
	    	if(this.checkValueEntered(_StartDate,"p_StartDate")){
	    		check++;
	    	}	
	    	var _cilentID = sap.ui.getCore().byId("idSelected").getSelectedKey();
	    	if(this.checkValueEntered(_cilentID,"idSelected")){
	    		check++;
	    	}	
	    	var b_OnSite = sap.ui.getCore().byId("p_OnSite").getSelected();;
	    	var _OnSite;
	    	if(b_OnSite){
	    		_OnSite = 1;
	    	}else{
	    		_OnSite = 0;
	    	}
	    	if(check === 5){
	   	    	$.post('CreateProject', { Name: _Name ,ClientID: _cilentID,Desc: _Description, Deadl: _Deadline,StartDate: _StartDate,OnSite:  _OnSite, Project_Creator: this.getConsultantID()},
		    	function(responseText) {
		    		MessageToast.show("Project Submitted Succesfully");
		    		//ensures that newly created project is selected
		    		var selectFirstProject = false;
		    		thisDomObj.goToProjects(selectFirstProject);    		
		    	});
		    	//close model
				this.onClose();	    		
	    	}
	    },
	    onSubmitConsultant : function() {
	    	var thisDomObj = this;
	    	var check = 0;
	    	var oConsultant = {
					 Consultant_Name : "none",
					 Consultant_Surname : "none",
					 Consultant_email : "none",
					 Consultant_Cell : "none"				
				};
	    	
	    	var _Name = sap.ui.getCore().byId("c_Name").getValue();
	    	if(this.checkValueEntered(_Name,"c_Name")){
	    		check++;
	    	}
	    	var _Email = sap.ui.getCore().byId("c_email").getValue();
	    	if(this.checkValueEntered(_Email,"c_email") && this.validateEmail(_Email)){
	    		check++;
	    	}
	    	
	    	var numSuccesfulTests = 2 ;
	    	if(check === numSuccesfulTests){
		    	var t = this;
		    	var oModel = this.getOwnerComponent().getModel("oModel");
		    	var _Privilege;
		    	var _teamID;
		    	
		    	oModel.read( "/Consultants", {
					urlParameters: {
						"$expand" : "User_TypeDetails"
					},
					filters: [ new sap.ui.model.Filter({
				          path: "Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: thisDomObj.getConsultantID()
				     })],
			    	success: function(oData){
			    	 	if(oData.results.length > 0){
			    	 		if (oData.results[0].User_TypeDetails.User_Type_Id == 100)
			    	 			_Privilege = 200;
			    	 		else if (oData.results[0].User_TypeDetails.User_Type_Id == 200)
			    	 			_Privilege = 300;
			    	 		//create a team of consultants with the group leader
		    	    		oModel.read ("/Teams",{
		    		    		urlParameters: {
		    						"$expand" : "ConsultantDetails"
		    					},
		    					filters: [ new sap.ui.model.Filter({
		    				          path: "ConsultantDetails/Consultant_ID",
		    				          operator: sap.ui.model.FilterOperator.EQ,
		    				          value1: thisDomObj.getConsultantID()
		    				     })],
		    				     success:function(data){
		    				    	if (data.results.length == 0){
		    				    		$.post('CreateTeam',
		    				    			{leaderID: thisDomObj.getConsultantID()},
		    				    			function(response){
		    				    				_teamID = response;
	    				    				createConsultant(_teamID);
		    				    			}
		    				    		);
		    				    	}
		    				    	else{
		    				    		_teamID = data.results[0].Team_ID;
	    				    		createConsultant(_teamID);
		    				    	}
		    				     },
		    					error: function(){
		    						 MessageToast.show("Failed to extract team details");
		    					}
		    		    	});
			    	 	}
			    	},
			    	error: function(){
			    		 MessageToast.show("Failed to extract consultant details");
			    	}
		    	});
		    	//close model
		    	this.onClose();	
		    	
		    	function createConsultant(_teamID){
	    		$.post('CreateConsultant', { 
					name: _Name,
					email: _Email,
					admin: _Privilege
					}, 
    				function(responseText) {
						console.log(_teamID);
    					$.post('AssignConsultantToTeam',{consultantID:responseText, teamID: _teamID});
    					$.post('CreateUser', {conID:responseText, resetpassword: null},
    						function(response){
    							$.post('MailingServlet',{name:_Name, emailAddress: _Email, password: response }, function(){
    								MessageToast.show("Consultant succesfully added.");
    							}); 
    					});
				});
	    	}
	    	}
	    },
	    addConsultantsViaCSV : function(){
			var fU = sap.ui.getCore().byId("csvUploader");
//			console.log("csvUploader");
			var domRef = fU.getFocusDomRef();
			var file = domRef.files[0];
			
			if (this._Dialog) {
				this._Dialog.destroy();
			}
			
			// Create a File Reader object
			var reader = new FileReader();
			var thisDomObj = this;
	    	var oModel = this.getOwnerComponent().getModel("oModel");
			
			reader.onload = function(e) {
			    var strCSV = e.target.result;
			    var rows = strCSV.split("\n");

//			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress()); 
		    	var i;
		    	var _Privilege;
		    	var _teamID;
		    	oModel.read( "/Consultants", {
					urlParameters: {
						"$expand" : "User_TypeDetails"
					},
					filters: [ new sap.ui.model.Filter({
				          path: "Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: thisDomObj.getConsultantID()
				     })],
			    	success: function(oData){
			    	 	if(oData.results.length > 0){
			    	 		if (oData.results[0].User_TypeDetails.User_Type_Id == 100)
			    	 			_Privilege = 200;
			    	 		else if (oData.results[0].User_TypeDetails.User_Type_Id == 200)
			    	 			_Privilege = 300;

			    	 		//create a team of consultants with the group leader
		    	    		oModel.read ("/Teams",{
		    		    		urlParameters: {
		    						"$expand" : "ConsultantDetails"
		    					},
		    					filters: [ new sap.ui.model.Filter({
		    				          path: "ConsultantDetails/Consultant_ID",
		    				          operator: sap.ui.model.FilterOperator.EQ,
		    				          value1: thisDomObj.getConsultantID()
		    				     })],
		    				     success:function(data){
		    				    	if (data.results.length == 0){
		    				    		$.post('CreateTeam',
		    				    				{leaderID: thisDomObj.getConsultantID()},
		    				    				function(response){
		    				    					_teamID = response;
		    							});
		    				    	}
		    				    	else{
		    				    		_teamID = data.results[0].Team_ID;
		    				    	}
		    				    	//create consultant
		    				    	 for (i = 1; i < rows.length; i++) { 
		    						    	var _name = (rows[i].split(",")[0]).trim();              
		    						    	var _surname = (rows[i].split(",")[1]).trim();           
		    						    	var _email = (rows[i].split(",")[2]).trim();             
		    						    	var _cell = (rows[i].split(",")[3]).trim();
		    						    	$.post('CreateConsultant', { 
		    									name: _name,
		    									surname: _surname,
		    									email: _email,
		    									cell: _cell,
		    									admin: _Privilege}, 
				    		    				function(responseText) {
				    		    					$.post('AssignConsultantToTeam', {
				    		    						consultantID:responseText,
				    		    						teamID: _teamID},
				    		    						function(){
				    		    							$.post('CreateUser', {conID:responseText},
							    		    						function(response){	
					    		    									$.ajaxSetup({async: false});
								    		    						$.post('MailingServlet',{name:_name, emailAddress: "u16094965@tuks.co.za", password: response}, function(){
								    		    						});
							    		    						});
				    		    							});
				    		    				});
		    						    }
		    				     }
		    		    	});
			    	 	}
			    	}
		    	});
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
			    
			    console.log("Length file: "+rows[0].split(",").length);
			    //Test errors
			    if(strCSV.length == 0){
			    	MessageToast.show("Error! The CSV File is empty");
			    	return;
			    }
			    else if(rows[0].split(",").length != 8){
			    	MessageToast.show("Error! The CSV File has a wrong format");
			    	return;
			    }
			    
			    var oDataProjects =   new sap.ui.model.odata.v2.ODataModel(t.getModelAddress());
		    	var i;
			    for (i = 1; i < rows.length; i++) { 
			    	var _Name = (rows[i].split(",")[0]).trim();
			    	var _Email = (rows[i].split(",")[1]).trim();
			    	var _Cell = (rows[i].split(",")[2]).trim();
			    	var _Address = (rows[i].split(",")[3]).trim();
			    	var _Latitude = (rows[i].split(",")[4]).trim();
			    	var _Longitude = (rows[i].split(",")[5]).trim();
			    	var _ContactName = (rows[i].split(",")[6]).trim();
			    	var _ContactNumber = (rows[i].split(",")[7]).trim();
			    	
			    	$.post('AddClient', { ClientName: _Name, ClientPhysicalAddress: _Address, ClientNumber: _Cell, ContactName: _ContactName, ContactNumber: _ContactNumber, ContactEmailAddress: _Email, Latitude: 0, Longitude: 0},
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
		onOpenPopover: function (oEvent) {

			// create popover
			if (!this._oPopover) {
				/*this._oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.Popover",this);
				this._oDialog.open();*/
				this._oPopover = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.popoverMenu", this);
//				this._oPopover.open();
				this.getView().addDependent(this._oPopover);
			}

			this._oPopover.openBy(oEvent.getSource());
		},
		handleCloseRemoveProject: function(oEvent){
			
			var oModel = this.getView().getModel("projectsModel");
	    	var _projectID = oModel.oData.Project_ID;
			var aContexts = oEvent.getParameter("selectedContexts");
//			console.log(aContexts);
			
			if (aContexts && aContexts.length) {
				MessageToast.show("You have selected " + aContexts.map(function(oContext) {
					console.log("test data: "+JSON.stringify(oContext.getObject()));
					var projectID=oContext.getObject().Project_ID;
					
					$.post('RemoveProject', {project: projectID},
						function(data) {  
						var array = data.split(';');
						console.log("Remove project: "+data);
						thisView.updateTasksList(_projectID);
					});
					return oContext.getObject().Project_ID; 
				}).join(", "));
			} else {
				MessageToast.show("No new item lected.");
			}
			oEvent.getSource().getBinding("items").filter([]);
		},
		onDelete: function(){
			$.post('DeleteProject', { projectID: PROJECT_ID},function(responseText) {  
				    	 // var array = responseText.split(';');
				    	console.log(responseText);
				   });					
			
			var selectFirstProject = true;
			this.goToProjects(selectFirstProject);
			this._Dialog.destroy();
					
		}
		
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf splitapp.master
	 */

//	onExit: function() {

//	}

		});
});