sap.ui.define([
    "consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function(BaseController, jQuery, MessageToast, DateFormat, Controller, JSONModel) {
    "use strict";

    return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailFeedback", {

        onInit: function() {
            // set mock model
        	var oRouter = this.getRouter();
			oRouter.getRoute("DetailFeedback").attachMatched(this._onRouteMatched, this);
            
        },

        onPost: function(oEvent) {
            var oFormat = DateFormat.getDateTimeInstance({ style: "long" });
            var oDate = new Date();
            var sDate = oFormat.format(oDate);
            // create new entry
            var consultantID = this.getConsultantID();
            var oArgs = oEvent.getParameter("arguments");
            
            var sValue = oEvent.getParameter("value");
            var oModel = this.getOwnerComponent().getModel("oModel");
            var taskDetailModel = new JSONModel();
            var thisObj = this;
            $.post('CreateFeedback', {msg: sValue, consultant:consultantID, project: 1, task:this.passedTaskID },function(responseText) {  
        		var array = responseText.split(';');
        		//console.log(array);
        		oModel.read("/Feedbacks", {
					urlParameters: {
						"$expand" : "TaskDetails,ConsultantDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "TaskDetails/Task_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: thisObj.passedTaskID
				     })],
					  success: function(data){
						  taskDetailModel.setData(data);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
        		thisObj.getView().setModel(taskDetailModel);
        	});
            
        },
        
        _onRouteMatched: function(oEvent) {
			
//			///set model for detail page
			var oArgs, oView;
			oArgs = oEvent.getParameter("arguments");
			
			var oModel = this.getOwnerComponent().getModel("oModel");
        	var taskDetailModel = new JSONModel();
			
        	this.passedTaskID = oArgs.taskID;
			//read the Project table based on id
				oModel.read("/Feedbacks", {
					urlParameters: {
						"$expand" : "TaskDetails,ConsultantDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "TaskDetails/Task_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: oArgs.taskID
				     })],
					  success: function(data){
						  taskDetailModel.setData(data);
					  },
					  error: function(oError) {
						  alert("error");
						 }
					});
				this.getView().setModel(taskDetailModel);
				console.log(taskDetailModel)
				
		},

        onSenderPress: function(oEvent) {
            MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
        },

        onIconPress: function(oEvent) {
            MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
        }

    });

});