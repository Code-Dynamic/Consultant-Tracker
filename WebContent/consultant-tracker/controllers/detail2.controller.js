sap.ui.controller("consultant-tracker.controllers.detail2", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf splitapp.detail
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf splitapp.detail
*/
//	onBeforeRendering: function() {
//
//	},
	onNavBack : function(oEvt){	
		app.to("detailPage");	
	},

//	openfragment
	confirmDeleteConsultant: function(){
		this._Dialog = sap.ui.xmlfragment("consultant-tracker.fragments.confirmDelete",this);
		this._Dialog.open();

	},
//	onClose event handler of the fragment
	onCancel : function() {
		this._Dialog.destroy();
	},
	onDelete: function(){
		var consultantID = sap.ui.getCore().getModel("selModel").getProperty("/Consultant_ID");
		console.log(consultantID);
		  $.post('RemoveConsultant', { consultant: consultantID},function(responseText) {  
		      	// var array = responseText.split(';');
		      	  //console.log(responseText);
			  this.goToConsultants();
		        });

		  
		//close model
		this._Dialog.destroy();
	},
	refreshData : function(oEvt){
		
			
	
		
		
		 
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
				//app.to("detail2Page");	
				
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
	goToConsultants : function(oEvt){
		btnConsultantSelected = true;
			
		//var item = this.getView().byId("orders").getMetadata("selectionChange"); //data("items","{/Consultants}");
		
		
		 
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