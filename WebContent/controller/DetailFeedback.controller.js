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
        
            var oModel = new JSONModel("model/feed.json");
            this.getView().setModel(oModel);
            
        },

        onPost: function(oEvent) {
            var oFormat = DateFormat.getDateTimeInstance({ style: "medium" });
            var oDate = new Date();
            var sDate = oFormat.format(oDate);
            // create new entry
            var sValue = oEvent.getParameter("value");
            var oEntry = {
                Author: "Anom",
                AuthorPicUrl: "https://www.ienglishstatus.com/wp-content/uploads/2018/04/Anonymous-Whatsapp-profile-picture.jpg",
                Type: "Reply",
                Date: "" + sDate,
                Text: sValue
            };

            // update model
            var oModel = this.getView().getModel();
            var aEntries = oModel.getData().EntryCollection;
            aEntries.push(oEntry);
            oModel.setData({
                EntryCollection: aEntries
            });
        },

        onSenderPress: function(oEvent) {
            MessageToast.show("Clicked on Link: " + oEvent.getSource().getSender());
        },

        onIconPress: function(oEvent) {
            MessageToast.show("Clicked on Image: " + oEvent.getSource().getSender());
        }

    });

});