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
		        });

		
		//close model
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