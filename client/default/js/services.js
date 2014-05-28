var services = angular.module('inTouchLogApp.services', []);

services.service('LoginService', function() {
    this.isAuth = function () {
        if (localStorage.getItem('intouchlogauth')) {
            return true;
        }
        else {
            return false;
        }
    };
});

services.service('MultiTicketLoader', function(){
    this.getTickets = function() {
        $fh.act(
            {
                act: 'tickets'
            },
            function (res) {
                localStorage.setItem('intouchtickets', JSON.stringify(res));
            },
            function (msg, err) {
                console.error('An error occured: ' + msg + ' : ' + err);
            }
        );
    };
});


services.service('TicketLoader', function() {
    this.getTicket = function(id) {
        var tickets = JSON.parse(localStorage.getItem('intouchtickets'));
        var ticket = [];
        for(var i = 0; i < tickets.length; i++){
            if(tickets[i].TICKETID === id){
                ticket.push(tickets[i]);
                break;
            }
        }
        return ticket;
    };

    this.getDataSet = function(array){
        var myArray = [];
        for(var i = 0; i < array.DATASET.length; i++){
            var tableArray = getDataTable(array, array.DATASET[i].DATATABLENAME);
            for(var j = 0; j < tableArray.length; j++){
                myArray.push(tableArray[j]);
            }
        }
        return myArray;
    };


    getDataTable = function(array, tableName) {
        for (var i = 0; i < array.DATASET.length ; i++) {
            if (array.DATASET[i].DATATABLENAME === tableName) {
                var myArray = array.DATASET[i].DATATABLE;
                if(tableName === 'tblIngredientQty'){
                    return groupByLoadSelectTopDiff(myArray, 'ID_Load', 'calcLoadDiffPercent');
                }
                else{
                    return myArray;
                }
            }
        }
    };

    groupByLoadSelectTopDiff = function(array, groupBy, topField){
        var newArray = [], item = {};
        array.sort(function(a,b){return parseFloat(b[groupBy])-parseFloat(a[groupBy]);});
        item = array[0];
        window.item0 = array[0];
        window.item1 = array[1];
        for (var i = 1; i < array.length; i++){
            if(array[i-1][groupBy] != array[i][groupBy]){
                newArray.push(item);
                item = array[i];
            }
            else{
                if(Math.abs(parseFloat(item[topField])) < Math.abs(parseFloat(array[i][topField]))){
                    item = array[i];
                }
            }
        }
        return newArray;
    };
});

services.service('LoadLoader', function(){
    this.getLoadTable = function(array, tableName, loadid){
        var item = {};
        var loadArray = [];
        for (var i = 0; i < array.DATASET.length ; i++) {
            if (array.DATASET[i].DATATABLENAME === tableName) {
                var myArray = array.DATASET[i].DATATABLE;
                for(var j = 0; j < myArray.length; j++){
                    if(myArray[j].ID_Load === loadid){
                        loadArray.push(myArray[j]);
                    }
                }
            }
        }
        return loadArray;
    };
});

services.service('updateTickets', function(){
    this.saveTicket = function(newTicket){
        $fh.act(
            {
                act: 'updateTicket',
                req: {
                    ticket: newTicket
                }
            },
            function (res) {
                MultiTicketLoader.getTickets();
            },
            function (msg, err) {
                //console.error('An error occured: ' + msg + ' : ' + err);
            }
        );
    };
});

/*
service.service('getDataSet', function(){
   this.dataSet = function(array){
       var myArray = [];
       for(var i = 0; i < array.DATASET.length; i++){
            myArray.push(array.DATASET[i].DATATABLENAME);
       }
       return myArray;
   }
});
*/
