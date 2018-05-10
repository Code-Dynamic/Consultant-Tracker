var btnConsultantSelected = false;

sap.ui.controller("consultant-tracker.controllers.master", {

	/**
	 * Called when a controller is instantiated and its View controls (if available) are already created.
	 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
	 * @memberOf splitapp.master
	 */
	onInit: function() {
		 
	},
	onSearch: function(evt){
//		 // create model filter
//
//		  var filters = [];
//
//		  var query = evt.getParameter("query");
//
//		  if (query && query.length > 0) {
//
//		  var filter = new sap.ui.model.Filter("Search_Parameter", sap.ui.model.FilterOperator.Contains, query);
//
//		  filters.push(filter);
//
//		  }
//
//		  // update list binding
//
//		  var list = this.getView().byId("orders");
//
//		  var binding = list.getBinding("items");
//
//		  binding.filter(filters);
	},
	PR_Search: function(oEvent) {
//        var tpmla = oEvent.getParameter("newValue");
//        var filters = new Array();
//        var oFilter = new sap.ui.model.Filter("PoNumber", sap.ui.model.FilterOperator.Contains, tpmla);
//        filters.push(oFilter);
//
//        //get list created in view
//        this.oList = sap.ui.getCore().byId("orders");
//        this.oList.getBinding("items").filter(filters);
    },

	goToProjects : function(oEvt){
		btnConsultantSelected = false;
		
		//var item = this.getView().byId("orders").data("items","{/Projects}");
		 var list = this.getView().byId("orders");
		         
		         list.bindItems("/results",
		           new sap.m.StandardListItem({
		             title: "{Project_Name}",
		             press: "onSelect"
		         
		           }).addStyleClass("listItems")
		       );
				

		var oModel = new sap.ui.model.json.JSONModel();
		var oDataProjects =  new sap.ui.model.odata.ODataModel('http://localhost:8080/Consultant-Tracker/emplist.svc/'); 
		var arrProjects = {Projects:[]};
		var arrConsultants = {Consultants:[]};
		oDataProjects.read(
				"/Projects?$expand=ClientDetails&$filter=Project_Deleted%20eq%20false",{success: function(oCreatedEn){ GotProjects(oCreatedEn) }, error: function(){console.log("Error");}}		
		);
		
//		$.post('getProjects',function(responseText){
//			console.log("servlet responded");
		function GotProjects(oCreatedEn){
//			arrProjects = {Projects:[]};
//			var array = responseText.split(';');
			//array.forEach(createProjectObj);
					
			oModel.setData(oCreatedEn);
			console.log(oCreatedEn);
			sap.ui.getCore().setModel(oModel);
			app.to("detailPage");
		}
//		});
			
	
		

		
//		oModel.setData();
//		sap.ui.getCore().setModel(oModel);
//		app.to("detailPage");	
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
 				"/Consultants",{success: function(oCreatedEn){ GotConsultants(oCreatedEn) }, error: function(){console.log("Error");}}		
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

		}

	},
	
	addProjectOrConsultant: function(){
		
	},

	/**
	 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * @memberOf splitapp.master
	 */
	onAfterRendering: function() {
		
		btnConsultantSelected = false;

		//var item = this.getView().byId("orders").data("items","{/Projects}");
		 var list = this.getView().byId("orders");
		         
		         list.bindItems("/Projects",
		           new sap.m.StandardListItem({
		             title: "{Project_Name}",
		             press: "onSelect"
		         
		           }).addStyleClass("listItems")
		       );
				

		var oModel = new sap.ui.model.json.JSONModel();
		var arrProjects = {Projects:[]};
		var arrConsultants = {Consultants:[]};
		
		
		function GotProjects(oCreatedEn){
//			arrProjects = {Projects:[]};
//			var array = responseText.split(';');
			//array.forEach(createProjectObj);
					
			oModel.setData(oCreatedEn);
			console.log(oCreatedEn);
			sap.ui.getCore().setModel(oModel);
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
//	    		console.log(arrProjects);
	    		
		}
	 	this.goToProjects();
		
		
	},
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