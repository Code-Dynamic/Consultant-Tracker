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
		 // create model filter

		  var filters = [];

		  var query = evt.getParameter("query");

		  if (query && query.length > 0) {

		  var filter = new sap.ui.model.Filter("Search_Parameter", sap.ui.model.FilterOperator.Contains, query);

		  filters.push(filter);

		  }

		  // update list binding

		  var list = this.getView().byId("orders");

		  var binding = list.getBinding("items");

		  binding.filter(filters);
	},
	PR_Search: function(oEvent) {
        var tpmla = oEvent.getParameter("newValue");
        var filters = new Array();
        var oFilter = new sap.ui.model.Filter("PoNumber", sap.ui.model.FilterOperator.Contains, tpmla);
        filters.push(oFilter);

        //get list created in view
        this.oList = sap.ui.getCore().byId("orders");
        this.oList.getBinding("items").filter(filters);
    },

	goToProjects : function(oEvt){
		btnConsultantSelected = false;

		//var item = this.getView().byId("orders").data("items","{/Projects}");
		 var list = this.getView().byId("orders");
		         
		         list.bindItems("/Projects",
		           new sap.m.StandardListItem({
		             title: "{Project_Name}",
		             press: "onSelect"
		         
		           })
		       );
				

		var oModel = new sap.ui.model.json.JSONModel();
		var arrProjects = {Projects:[]};
		var arrConsultants = {Consultants:[]};
		
		
		$.post('getProjects',function(responseText){
//			console.log("servlet responded");
			arrProjects = {Projects:[]};
			var array = responseText.split(';');
			array.forEach(createProjectObj);
					
			oModel.setData(JSON.parse(JSON.stringify(arrProjects)));
			console.log(JSON.parse(JSON.stringify(arrProjects)));
			sap.ui.getCore().setModel(oModel);
			app.to("detailPage");
		});
			
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
		
		

		
//		oModel.setData();
//		sap.ui.getCore().setModel(oModel);
//		app.to("detailPage");	
	},

	goToConsultants : function(oEvt){
		btnConsultantSelected = true;
			
		//var item = this.getView().byId("orders").getMetadata("selectionChange"); //data("items","{/Consultants}");
		
		
		 var list = this.getView().byId("orders");
         
         list.bindItems("/Consultants",
           new sap.m.StandardListItem({
             title: "{Consultant_Name}",
             press: "onSelect"
         
           })
       );
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
				sap.ui.getCore().setModel(oModel);
				app.to("detail2Page");	
				
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
			var oData = sap.ui.getCore().getModel().getProperty("/Consultants");


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


			//get selected project id
			var sOrderId = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Project_ID");
			//get model
			var oData = sap.ui.getCore().getModel().getProperty("/Projects");
			//get the specific project selected data 
			$.post('getProjectConsultants',{ projectID: sOrderId},function(responseText){
				console.log("servlet getProjectConsultants responded");
				//console.log(responseText);
				arrConsultants = {Consultants:[]};
				var array = responseText.split(';');
				array.forEach(createConsultant);

				var oModel = new sap.ui.model.json.JSONModel();
				oModel.setData(JSON.parse(JSON.stringify(arrConsultants)));
				//console.log(JSON.parse(JSON.stringify(arrConsultants)));
				sap.ui.getCore().setModel(oModel,"groupMember");
				app.to("detailPage");

			});

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

//			//model for members of project

//			//get array of members of project
//			var arrayOfMembers = oEvent.getSource().getSelectedItem().getBindingContext().getProperty("Project_Members")
//			//console.log(sOrderId2[0].Consultant_ID);
//			//Load data from consultants json then loop array of members id's
//			var oModel = new sap.ui.model.json.JSONModel();
//			oModel.loadData("splitapp/model/consultants.json");

//			//array for members
//			var projectMembers = {
//			members:[

//			]
//			};

//			oModel.attachRequestCompleted(function() {				
//			for(var id in arrayOfMembers){
//			//console.log(arrayOfMembers[id].Consultant_ID);

//			var consultants = oModel.getProperty("/Consultants");
//			function getMembers(Consultant_ID) {
//			return consultants.filter(
//			function(consultants) {
//			return consultants.Consultant_ID == Consultant_ID
//			}
//			);
//			}

//			var groupMember = getMembers(arrayOfMembers[id].Consultant_ID);
//			//console.log(groupMember[0].Consultant_Name);
//			projectMembers.members.push(groupMember[0]);
//			}

//			//console.log(projectMembers);
//			var oGroupMember = new sap.ui.model.json.JSONModel(projectMembers);			
//			sap.ui.getCore().setModel(oGroupMember,"groupMember");	
//			});

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
		         
		           })
		       );
				

		var oModel = new sap.ui.model.json.JSONModel();
		var arrProjects = {Projects:[]};
		var arrConsultants = {Consultants:[]};
		
		
		$.post('getProjects',function(responseText){
//			console.log("servlet responded");
			arrProjects = {Projects:[]};
			var array = responseText.split(';');
			array.forEach(createProjectObj);
					
			oModel.setData(JSON.parse(JSON.stringify(arrProjects)));
			console.log(JSON.parse(JSON.stringify(arrProjects)));
			sap.ui.getCore().setModel(oModel);
			app.to("detailPage");
		});
			
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
    	
    	oProject.Project_Name = _Name;
    	oProject.Project_DEscription = _Description;
    	oProject.Project_Deadline = _Deadline;
    	oProject.Project_OnSite = _OnSite;
    	
    	
    	$.post('CreateProject', { Name: _Name ,ClientID: 2,Desc: _Description, Deadl: _Deadline ,OnSite:  _OnSite},function(responseText) {  
    		var array = responseText.split(';');
    		console.log(array);
    	});
    	
    	  
    	console.log(oProject);
    	
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
    	
    	oConsultant.Consultant_Name = _Name;
    	oConsultant.Consultant_Surname = _Surname;
    	oConsultant.Consultant_email = _email;
    	oConsultant.Consultant_Cell = _Cell;
    	
    	console.log(oConsultant);
    	   
    	$.post('createConsultant', { name: _Name,surname: _Surname,email: _email, cell: _Cell ,admin: 0},function(responseText) {  
    		// var array = responseText.split(';');
    		console.log(responseText);
    	});
    	    
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