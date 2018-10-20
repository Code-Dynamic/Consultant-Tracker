var button = 1;

sap.ui.define([
    "consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
    "jquery.sap.global",   
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"
], function (BaseController, jQuery, Controller, JSONModel, History) {
    "use strict";
    return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterFeedback", {

        onInit: function (evt) {
        	var oModel = this.getOwnerComponent().getModel("oModel");
        	var taskDetailModel = new JSONModel();
			var consultantID = this.getConsultantID();
			//read the Project table based on id
				oModel.read("/Assigned_Tasks", {
					urlParameters: {
						"$expand" : "ConsultantDetails,TaskDetails"
			        },
					filters: [ new sap.ui.model.Filter({
				          path: "ConsultantDetails/Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: consultantID
				     })],
					  success: function(data){
						  taskDetailModel.setData(data);
					  },
					  error: function(oError) {
						  console.log("error");
						 }
					});
				//set the project detail model
				this.getView().setModel(taskDetailModel); 
				console.log(this.getView().getModel());
        },
        onNavBack: function (oEvent) {
            
            var oHistory, sPreviousHash;
            oHistory = History.getInstance();
            sPreviousHash = oHistory.getPreviousHash();
            if (sPreviousHash !== undefined) {
                
                window.history.go(-1);
            } else {
                console.log("no back");
            }
        },
        goToDetail: function () {
            this.getRouter().navTo("detailProject");
        },
        /**
         *@memberOf consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterManager
         */
        getTasks: function (oEvent) {
        	
        },
        /**
         *@memberOf consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterManager
         */
        getConsultants: function (oEvent) {
            var oModel = new JSONModel("model/consultants.json");
            this.getView().setModel(oModel);

            var list = this.getView().byId("list1");

            list.bindItems("/Consultants",
                new sap.m.StandardListItem({
                    title: "{ConsultantName}",
                    press: "onSelect"

                })
            );

            button = 2;
        },
        /**
         *@memberOf consultanttracker.Consultant-Tracker_Prototype-1.controller.MasterManager
         */
        getProjects: function (oEvent) {
            var oModel = new JSONModel("model/projects.json");
            this.getView().setModel(oModel);

            var list = this.getView().byId("list1");

            list.bindItems("/Projects",
                new sap.m.StandardListItem({
                    title: "{ProjectsName}",
                    press: "onSelect"

                })
            );

            button = 3;
        },
        onTaskSelect: function (oEvent) {
        	var taskID = oEvent.getSource().getBindingContext().getProperty("TaskDetails/Task_ID");
        	
				this.getRouter()
				.navTo("DetailFeedback", 
						{taskID:taskID});
        },
        onConsultantSelect: function (oEvent) {
        },
        onProjectsSelect: function (oEvent) {
        },
        onSelect: function (oEvent) {
            if (button == 1) {
                this.onTaskSelect(oEvent);
            } else if (button == 2) {
                this.onConsultantSelect(oEvent);
            } else if (button == 3) {
                this.onProjectsSelect(oEvent);
            }
        }
    });
});