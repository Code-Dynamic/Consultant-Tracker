var btnConsultantSelected = false;
sap.ui.define([
	"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	'jquery.sap.global',
	'sap/ui/core/mvc/Controller',
	
	
], function(BaseController,MessageToast,JSONModel,jQuery,Controller){
	
"use strict";

return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterAdmin", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf splitapp.master
	 */
	onInit: function() {
		
		var projectsModel = new sap.ui.model.json.JSONModel();
		var consultantsModel = new sap.ui.model.json.JSONModel();
		
		var oModel = this.getOwnerComponent().getModel("oModel");
		
		//read projects
		oModel.read(
				"/Projects?$filter=Project_Deleted%20eq%20false",{
					success: function(data){ 
						projectsModel.setData(data);
//						console.log(data);
						},
						
					error: function(){
						console.log("Error");}
						}		
		);
		
		this.getView().setModel(projectsModel,"projectsModel");
		
		//read consultant data
		oModel.read("/Consultants",{
					
					success: function(data){ 
						consultantsModel.setData(data);
//						console.log(data);
						},
						
					error: function(){
						console.log("Error");}
						}		
		);
		
		this.getView().setModel(consultantsModel,"consultantsModel");
		

	},
	onProjectListItemPress: function(evt){
		
		var sPath = evt.getSource().getBindingContext("projectsModel").getPath();
		var oData = this.getView().getModel("projectsModel").getProperty(sPath);
		//NB as a manager you can view all projects under you
//		var oProjectId = evt.getSource().getBindingContext("projectsModel").getProperty("projectsModel>/Project_ID");
//		var model = evt.getSource("projectsModel");
//		console.log(oData.Project_ID);
		var oProjectId = oData.Project_ID;
		
		this.getRouter()
			.navTo("DetailAdmin", 
				{projectId:oProjectId});
//		console.log(sListId);
		MessageToast.show("Pressed : " + evt.getSource().getTitle());
		
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
		MessageToast.show("Pressed : " + evt.getSource().getTitle());
		
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
	goToProjects : function(oEvt){
		btnConsultantSelected = false;
		
		//var item = this.getView().byId("orders").data("items","{/Projects}");



		
	
	},

	goToConsultants : function(oEvt){
		btnConsultantSelected = true;
		console.log("goToConsultants");
		//var item = this.getView().byId("orders").getMetadata("selectionChange"); //data("items","{/Consultants}");
		
		
		 var list = this.getView().byId("orders");
         
         list.bindItems("/results",
        		 new sap.m.StandardListItem({
        			 title: "{Consultant_Name}",
        			 press: "onSelect"
           }).addStyleClass("listItems")
       );
        var oDataConsultants =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
 		oDataConsultants.read(
 				"/Consultants",{success: function(oCreatedEn){ 
 					
 					GotConsultants(oCreatedEn) }, error: function(){console.log("Error");}}		
 		);
         //return all consultants
//         $.post('getProjectConsultants',function(responseText){
         function  GotConsultants(oCreatedEn) {
//				console.log("servlet getProjectConsultants responded");
//				console.log(responseText);
//				arrConsultants = {Consultants:[]};
//				var array = responseText.split(';');
//				array.forEach(createConsultant);
				
				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(oCreatedEn);
//				console.log(JSON.parse(JSON.stringify(arrConsultants)));
				sap.ui.getCore().setModel(oModel);
				app.to("detail2Page");	
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
				 Consultant_Admin : array[5]
				};
				arrConsultants.Consultants.push((Consultant));
//		    		console.log(arrProjects);
		    		
			}
		
	
	},


	/**
	 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
	 * (NOT before the first rendering! onInit() is used for that one!).
	 * @memberOf splitapp.master
	 */
//	onBeforeRendering: function() {

//	},


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

			var oDataProjects =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
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
			var attachModel = new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/');
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
			
			//End code display task
			//start code for progress
		
			$.post('getProjectProgress',{Project_Id:sOrderId},function(responseText){
				var progress = {percVal:0,displayVal:0};
				progress.percVal = parseFloat(responseText);
				progress.displayVal = responseText;
		          var progressModel = new sap.ui.model.json.JSONModel();
		          progressModel.setData(progress);
		          sap.ui.getCore().setModel(progressModel,"progress");
				
			});
			//end code for progress

		}

	},
	
	addProjectOrConsultant: function(){
		
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf splitapp.master
	 */
		//openfragment
	addProjectOrConsultant: function(){
		if(btnConsultantSelected){
			 this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.formAddConsultant",this);
			 this._Dialog.open();
		 
		}else{
			this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.formAddProject",this);
			this._Dialog.open();
		}
		
	},
	// onClose event handler of the fragment
    onClose : function() {
                this._Dialog.destroy();
    },
	// onSubmit event handler of the fragment
    onSubmitProject : function() {
    	var oProject = {
    			Project_Name: "none", 
    			Project_DEscription: "none",  
    			Project_Deadline: "none", 
    			Project_OnSite: "none"
			};
    	
    	var _Name = sap.ui.getCore().byId("p_Name").getValue();
    	var _Description = sap.ui.getCore().byId("p_Description").getValue();
    	var _Deadline = sap.ui.getCore().byId("p_Deadline").getValue();
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
    	oProject.Project_OnSite = _OnSite;
//    	var entry = {};
//		var yourTotal = parseInt(1);
//		entry.CLIENT_CLIENT_ID=yourTotal;
//		entry.Project_Deadline = _Deadline;
//		entry.Project_Deleted =false;
//		entry.Project_Description = _Description;
//		entry.Project_Name = _Name;
//		entry.Project_OnSite= b_OnSite;
//		var x =oModel2.create('/Projects',entry, {sucess:function(oCreatedEn){ console.log(("Success")); }, error:function(){console.log("Error");}});
//
//		console.log(entry);
//    
    	$.post('CreateProject', { Name: _Name ,ClientID: 2,Desc: _Description, Deadl: _Deadline ,OnSite:  _OnSite},function(responseText) {  
    		var array = responseText.split(';');
    		console.log(array);
    	});
		
    	this.goToProjects();
    	
    	//console.log(oProject);
    	
    	//close model
		this._Dialog.destroy();
    	
    },
   
    onSubmitConsultant : function() {
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
    	
//    	oConsultant.Consultant_Name = _Name;
//    	oConsultant.Consultant_Surname = _Surname;
//    	oConsultant.Consultant_email = _email;
//    	oConsultant.Consultant_Cell = _Cell;
//    	
//    	console.log(oConsultant);
//    	   
//    	$.post('createConsultant', { name: _Name,surname: _Surname,email: _email, cell: _Cell ,admin: 0},function(responseText) {  
//    		// var array = responseText.split(';');
//    		console.log(responseText);
//    	});
    	var t = this;
    	var oDataProjects =   new sap.ui.model.odata.v2.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
    	var x=	oDataProjects.createEntry('/Consultants',{
			properties:{
				//Client_Details:{},
				Consultant_Admin:0,
				Consultant_Cell: _Cell,
				Consultant_Name: _Name,
				Consultant_Surname: _Surname,
				Consultant_email:_email},
				async:false,
			created:function(){ console.log(("posting Project (created)- It Worked!!")); console.log("submitting cahnges");console.log(oDataProjects.oData);oDataProjects.submitChanges({async:false});t.goToConsultants();},
			sucesss: function(){ console.log(("posting Project(sucess) It Worked!!")); }
			, error:function(){console.log("Error in posting Project");}
    	});
    	
    	this.goToConsultants();
    
    	//close model
		this._Dialog.destroy();
    },
    
	/**
	 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
	 * @memberOf splitapp.master
	 */
//	onExit: function() {

//	}

		});
});