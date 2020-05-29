sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/resource/ResourceModel"
 ], function (Controller, MessageToast, ResourceModel) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.CheckoutBookTable", {

      onInit : function () {
         // set i18n model on view
         var i18nModel = new ResourceModel({
            bundleName: "org.ubb.books.i18n.i18n"
         });
         this.getView().setModel(i18nModel, "i18n");
      },

      onToggleInfoToolbar(oEvent) {
			var oTable = this.byId("checkoutBookTable");
			oTable.getInfoToolbar().setVisible(!oEvent.getParameter("pressed"));
      },
      
      onUpdateFinished() {

         var oTable = this.getView().byId("checkoutBookTable");
         var oItems = oTable.getItems();

         //debugger;
         for(var i = 0; i < oTable.getItems().length; i++) {
            oItems[i].getCells()[0].$().removeClass("cell_Color_Green");
            oItems[i].getCells()[0].$().removeClass("cell_Color_Red");

            if(parseInt( oItems[i].getCells(0)[4].getText()) === 0) {
               oItems[i].getCells()[0].$().addClass("cell_Color_Red");
            }
            else {
               oItems[i].getCells()[0].$().addClass("cell_Color_Green");
            }
         }
      },

      onBookBook(oEvent) {
            const aSelectedContexts = this.byId("checkoutBookTable").getSelectedContexts();
            const sPath = aSelectedContexts[0].getPath();

            var selRow = this.byId("checkoutBookTable").getModel().getProperty(sPath);
            var availableVal = parseInt(selRow.Available);

            var oBundle = this.getView().getModel("i18n").getResourceBundle();
            var sRecipient = this.getView().getModel().getProperty("/recipient/name");
            var successMsg = oBundle.getText("checkoutSuccess", [sRecipient]);
            var errorBackMsg = oBundle.getText("checkoutBackError", [sRecipient]);
            var errorFrontMsg = oBundle.getText("checkoutFrontError", [sRecipient]);

            if(availableVal > 0 ) {
               selRow.Available = parseInt(selRow.Available) - 1;

               var oBook =  {
                  ISBN: selRow.ISBN,
                  Title: "",
                  Author: "",
                  Published: selRow.Published,
                  Language: "",
                  Available: ""
              };

               this.getView().getModel().create("/CheckoutBooks", oBook, {
                  success: function () {
                     MessageToast.show(successMsg);
                  },
                  error: function () {
                     MessageToast.show(errorBackMsg);
                  }
               }); 
            } else {
               MessageToast.show(errorFrontMsg);
            }
      }, 
     
      filtering : function(value) {
         var oFilter1 = new sap.ui.model.Filter("ISBN", sap.ui.model.FilterOperator.Contains, value);
         var oFilter2 = new sap.ui.model.Filter("Author", sap.ui.model.FilterOperator.Contains, value);
         var oFilter3 = new sap.ui.model.Filter("Title", sap.ui.model.FilterOperator.Contains, value);
         var oFilter4 = new sap.ui.model.Filter("Published", sap.ui.model.FilterOperator.Contains, value);
         var oFilter5 = new sap.ui.model.Filter("Language", sap.ui.model.FilterOperator.Contains, value);
         var allFilter = new sap.ui.model.Filter([oFilter1, oFilter2, oFilter3, oFilter4, oFilter4], false); 
         var oBinding = oEvent.getSource().getBinding("items");
         oBinding.filter(allFilter);
      }
    });
 });