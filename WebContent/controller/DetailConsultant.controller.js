var curLatlng;		
var epPos = [];
var directionsService;
var directionsRenderer;
var map;
sap.ui.define([
		"consultanttracker/Consultant-Tracker_Prototype-1/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		'sap/ui/core/mvc/Controller',

		'jquery.sap.global',
		'sap/ui/core/Fragment',

	], function(BaseController,JSONModel,Controller,jQuery,Fragment) {
	"use strict";

	return BaseController.extend("consultanttracker.Consultant-Tracker_Prototype-1.controller.DetailConsultant", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf consultanttracker.Consultant-Tracker_Prototype-1.view.DetailConsultant
		 */
			onInit: function() {
				
				//geting id from the URL
				var oRouter = this.getRouter();
				oRouter.getRoute("DetailConsultant").attachMatched(this.onRouteMatched, this);
				
				//for timepicker
				// for the data binding example do not use the change event for check but the data binding parsing events
				sap.ui.getCore().attachParseError(
					function(oEvent) {
						var oElement = oEvent.getParameter("element");

						if (oElement.setValueState) {
							oElement.setValueState(sap.ui.core.ValueState.Error);
						}
					});

				sap.ui.getCore().attachValidationSuccess(
					function(oEvent) {
						var oElement = oEvent.getParameter("element");

						if (oElement.setValueState) {
							oElement.setValueState(sap.ui.core.ValueState.None);
						}
					});
				
				this._iEvent = 0;

				//end the loading indicator
				sap.ui.core.BusyIndicator.hide();
			},

			onSelectTab: function(oEvent){
				
				
				this.pKey = oEvent.getParameter("id");
				
				console.log("dashboard select :"+this.pKey);
				if(this.pKey ==  1){
					
				}else if (this.pKey == "__component0---DetailConsultant--2"){
					
					this.getView().byId("iconTabBar").setSelectedKey("key2");
					
				}else if (this.pKey == "__component0---DetailConsultant--3"){
					
					this.getView().byId("iconTabBar").setSelectedKey("key3");
				
				}else if (this.pKey == "__component0---DetailConsultant--7"){
					
				
					this.getView().byId("iconTabBar").setSelectedKey("key5");
					this.showMap(oEvent);

				}
			},
			showMap: function(oEvent) {
				
				//Generate map when correct tab selected
			
				if(!(oEvent.getParameters().selectedKey == "key5" || oEvent.getParameter("id")=="__component0---DetailAdmin--7")){
					return;
				}
				var viewDivId = sap.ui.getCore().byId(this.createId("map_canvas"));
				// instanciate google map
				 map = new google.maps.Map(viewDivId.getDomRef(), {
						zoom: 12,
						center: curLatlng//Initial Location on Map
					});
//				console.log('Called initmap');
				var geocoder =new google.maps.Geocoder();
				var officeAddress = this.getView().getModel('projectsModel').getProperty('/ClientDetails/Client_Address');
				 directionsRenderer = new google.maps.DirectionsRenderer({
						map: null
					});
				
				var CurrLocationMarker = new google.maps.Marker();
				var ClientMarker = new google.maps.Marker();
				
				directionsService = new google.maps.DirectionsService;
				var thisPtr = this;
				
				//Get user current location
				if (navigator.geolocation) {
				     navigator.geolocation.getCurrentPosition(function (position) {
				    	 curLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
				         map.setCenter(curLatlng);
				         CurrLocationMarker.setPosition(curLatlng);
				         officeLocation();
				         
				     });
				 }
				//Get Client address -- Currently defaulted to Epiuse Office
				function officeLocation(){
				 geocoder.geocode( { 'address': officeAddress},function(result,status){
					 if(status == google.maps.GeocoderStatus.OK){
						 ClientMarker.setPosition(result[0].geometry.location);
						 epPos[0] = result[0].geometry.location.lat();
						 epPos[1] = result[0].geometry.location.lng();
						 thisPtr.DistFromCurrent();
					 }
				 });
				}
				

				 var infoWindowCurrentLocation = new google.maps.InfoWindow({
			         content: "Current Location"
			     });
				 var infoWindowClient = new google.maps.InfoWindow({
			         content: "Client Location"
			     });
				 
				CurrLocationMarker.setMap(map);
				infoWindowCurrentLocation.open(map, CurrLocationMarker);
				

				ClientMarker.setMap(map);
				infoWindowClient.open(map, ClientMarker);
			    
				
				var control = this.getView().byId('front-div');

			},
			ShowHide: function(){
				var thisPtr = this;
				if(directionsRenderer.getMap() == null)
					thisPtr.DistFromCurrent();
				else
					thisPtr.HideRoute();
			},
			//Hides map Directions
			HideRoute: function (){
				directionsRenderer.setMap(null);
			},
			//Calculates distance and route between client and current location
			DistFromCurrent: function (){
				directionsRenderer.setMap(map);
				var req = {
						origin:  new google.maps.LatLng(epPos[0], epPos[1]),
						destination: new google.maps.LatLng(curLatlng.lat(), curLatlng.lng()),
						travelMode: 'DRIVING'
					};
				var thisPtr =this;
					directionsService.route(req, function(response, status) {
						if (status === 'OK') {
							console.log(response.routes[0].legs[0].distance.text);
							directionsRenderer.setDirections(response);
							var distElement = sap.ui.getCore().byId(thisPtr.createId("Distance"));
							console.log(distElement);
							distElement.setText("Distance: "+response.routes[0].legs[0].distance.text);	
					}
					});
			},
			
			onRouteMatched: function(oEvent) {
				//gets reference to ratings button and saves it in global so that it is accessible in base controller
				this.setRatingsBtnRef();
//				///set model for detail page
				var oModel = this.getOwnerComponent().getModel("oModel");
				var projectsDetailModel = new JSONModel();
				
				var oArgs, oView;
				oArgs = oEvent.getParameter("arguments");
				
				//variables for counting members and tasks on a project
				var countMembers;
				var countTasks;
				

					//2
					//get Team members for the selected Project (from master)
					var membersDetailModel = new JSONModel();	
					oModel.read("/Assignments", {
						urlParameters: {
							"$expand" : "ProjectDetails,ConsultantDetails"
				        },
						filters: [ new sap.ui.model.Filter({
					          path: "ProjectDetails/Project_ID",
					          operator: sap.ui.model.FilterOperator.EQ,
					          value1: oArgs.listId
					     })],
							  success: function(data){
								   membersDetailModel.setData(data);
//									var results = JSON.stringify(data);
//									console.log(results);
								   countMembers = data.results.length;
							  },
							  error: function(oError) {
								  conosle.log("error");
								 }
							});
//						set the project detail model
						this.getView().setModel(membersDetailModel,"membersModel"); 

					//3
					//get all tasks that a client is assigned to for the selected Project (from master)
								
						//get consultant_ID, tasks that the consultant is 
						//assigned to
						var tasksDetailModel = new JSONModel();
						oModel.read("/Assigned_Tasks", {
							urlParameters: {
					            "$expand" : "ConsultantDetails, TaskDetails, TaskDetails/ProjectDetails"
					        },
							filters: [ new sap.ui.model.Filter({
						          path: "ConsultantDetails/Consultant_ID",
						          operator: sap.ui.model.FilterOperator.EQ,
						          value1: oArgs.consultantId
						     }),new sap.ui.model.Filter({
						          path: "TaskDetails/ProjectDetails/Project_ID",
						          operator: sap.ui.model.FilterOperator.EQ,
						          value1: oArgs.listId
						     })],
							  success: function(data){
								 var result = JSON.stringify(data);
								 tasksDetailModel.setData(data);
//								 conosle.log(result);
//								 console.log("tasksModel" +result);
								 countTasks = data.results.length;
									
							  },
							  error: function(oError) {
								  conosle.log("error");
								 }
							});
						
//						console.log(projectsModel);
						this.getView().setModel(tasksDetailModel,"tasksModel");
						//1
						//read the Project table based on id
							oModel.read("/Projects("+oArgs.listId+")", {
								urlParameters: {
						            "$expand" : "ClientDetails",
						        },
								  success: function(data){
									  data.countMembers = countMembers;
									  data.countTasks = countTasks;
									   projectsDetailModel.setData(data);
//										var results = JSON.stringify(data);
//										console.log(results);
//										conosle.log(results);
								  },
								  error: function(oError) {
									  conosle.log("error");
									 }
								});
							//set the project detail model
							this.getView().setModel(projectsDetailModel,"projectsModel"); 
							
							
			},
			setRatingsBtnRef : function(){
				RatingsBtn = this.getView().byId("rateTeamBtn");
			},
			handleMemberRatingDialog: function (oEvent) {
				
				//get id of selected list item(consultantId)
//				var oListId = oEvent.getSource().getBindingContext().getProperty("membersModel>ConsultantDetails/Consultant_ID");
				
				
				var sPath = oEvent.getSource().getBindingContext("membersModel").getPath();
				var oData = this.getView().getModel("membersModel").getProperty(sPath);
				
				var consultantId = oData.ConsultantDetails.Consultant_ID;
				
				
				//
				var oModel = this.getOwnerComponent().getModel("oModel");
				
				var consultantDetailModel = new JSONModel();
				oModel.read("/Consultants", {
					
					filters: [ new sap.ui.model.Filter({
				          path: "Consultant_ID",
				          operator: sap.ui.model.FilterOperator.EQ,
				          value1: consultantId
				     })],
					  success: function(data){
						 var result = JSON.stringify(data);
						 consultantDetailModel.setData(data);
//						 conosle.log(result);
						 console.log("oModel" +result);
					  },
					  error: function(oError) {
						  conosle.log("error");
						 }
					});
				
				this.getView().setModel(consultantDetailModel,"consultantModel");
				
				this.memberRating_oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.MemberRatingDialog", this);

				this.memberRating_oDialog.setModel(this.getView().getModel("consultantModel"),"consultantModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.memberRating_oDialog);
				this.memberRating_oDialog.open();
				
			},
			openCalender: function(oEvent){
				
				//get model of DetailConsultant controller
				var oModel = this.getView().getModel("projectsModel");
				//console.log(oModel);

				//get Project_ID to pass to the calender view
				var oListId = oModel.oData.Project_ID;
				this.getRouter()
					.navTo("Calender", 
						{listId:oListId, projectId:oListId});

			},
			
			onPressed: function(oEvent){
				conosle.log("hello world");
			},
			onSubmit: function () {
//				if (this._oDialog) {
//					this._oDialog.destroy();
//				}
			},
			onClose: function () {
				if (this.timeEntry_oDialog) {
					this.timeEntry_oDialog.destroy();
				}else if(this.memberRating_oDialog){
					this.memberRating_oDialog.destroy();
				}
			},
			handleTimeEntry: function(oEvent){
				this.timeEntry_oDialog = sap.ui.xmlfragment("consultanttracker.Consultant-Tracker_Prototype-1.fragments.TimeEntry", this);
				
//				console.log(this.getView().getModel("tasksModel"));
				this.timeEntry_oDialog.setModel(this.getView().getModel("tasksModel"),"tasksModel");
				// toggle compact style
				jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this.timeEntry_oDialog);
				this.timeEntry_oDialog.open();
			},
			handleChange: function (oEvent) {
				var oText = this.byId("T1");
				var oTP = oEvent.oSource;
				var sValue = oEvent.getParameter("value");
				var bValid = oEvent.getParameter("valid");
				this._iEvent++;
//				oText.setText("Change - Event " + this._iEvent + ": TimePicker " + oTP.getId() + ":" + sValue);

				if (bValid) {
					oTP.setValueState(sap.ui.core.ValueState.None);
				} else {
					oTP.setValueState(sap.ui.core.ValueState.Error);
				}
				
				console.log("HH: "+sValue+"MM: "+bValid)
			},
			onExit: function () {
				if (this._oQuickView) {
					this._oQuickView.destroy();
				}
			},
			//Start---Mobile view code
            onNavBack: function(oEvent){
                
            	if(this.isConsultantAdmin()){
                    this.getRouter().navTo("MasterAdmin",{consultantId:this.getConsultantID()});
            	}else{
                    this.getRouter().navTo("MasterConsultant",{consultantId:this.getConsultantID()});

            	}
            }
            //End---Mobile view code
	});

});