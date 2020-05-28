sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
 ], function (Controller, MessageToast) {
    "use strict";
    return Controller.extend("org.ubb.books.controller.CheckoutBookTable", {

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
               console.log(parseInt( oItems[i].getCells(0)[4].getText()));
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

            if(availableVal > 0 ) {
               selRow.Available = parseInt(selRow.Available) - 1;

               var oBook =  {
                  ISBN: "",
                  Title: "",
                  Author: "",
                  Published: null,
                  Language: "",
                  Available: 0
              };

              oBook.ISBN = selRow.ISBN;
              oBook.Title = selRow.Title;
              oBook.Author = selRow.Author;
              oBook.Published = selRow.Published;
              oBook.Language = selRow.Language;
              oBook.Available = selRow.Available;

               this.getView().getModel().update(sPath, oBook, {
                  success: function () {
                     MessageToast.show("Booked! :)");
                  },
                  error: function () {
                     MessageToast.show("Error from the dark side :(");
                  }
               }); 
            } else {
               MessageToast.show("That book is kinda red. Can not book... :(");
            }
 

            
      }
   
    });
 });