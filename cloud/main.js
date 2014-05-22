//var util = require('util');
/* main.js
 * All calls here are publicly exposed as REST API endpoints.
 * - all parameters must be passed in a single JSON paramater.
 * - the return 'callback' method signature is 'callback (error, data)', where 'data' is a JSON object.
*/

/*
$fh.db({
    "act": "deleteall",
    "type": "ticket"
}, function(err, data) {
});
*/

/*
 var initialData = require('AppData/users.json');

 $fh.db({
 "act": "create",
 "type": "users",
 "fields": initialData
 }, function(err, data) {
 if (err) {
 console.log('error: ',err);
 } else {
 console.log(JSON.stringify(data));
 }
 });


 var initialTicketData = require('AppData/tickets.json');

 $fh.db({
 "act": "create",
 "type": "ticket",
 "fields": initialTicketData
 }, function(err, data) {
 if (err) {
 console.log('error: ',err);
 } else {
 console.log(JSON.stringify(data));
 }
 });
*/
/*
var TicketData = require('AppData/tickets.json');

createjson = function(ticketid, callback){
    var ticketitem = [];
    for(var i = 0; i < TicketData.length; i++ ){
        if(TicketData[i]['TICKETID'] === ticketid){
            item = {};
            item ["TICKETID"] = TicketData[i]['TICKETID'];
            item ["EXTERNALACCOUNTNO"] = TicketData[i]['EXTERNALACCOUNTNO'];
//            console.log(TicketData[i]['EXTERNALACCOUNTNO']);
            item ["ACCOUNT"] = TicketData[i]['ACCOUNT'];
            item ["ACCOUNTID"] = TicketData[i]['ACCOUNTID'];
            item ["TICKETNO"] = TicketData[i]['TICKETNO'];
            item ["RECEIVEDDATE"] = TicketData[i]['RECEIVEDDATE'];
            item ["SUBJECT"] = TicketData[i]['SUBJECT'];
            item ["SOLUTION"] = TicketData[i]['SOLUTION'];
            item ["STATUS"] = TicketData[i]['STATUS'];
            item ["COMPLETEDDATE"] = TicketData[i]['COMPLETEDDATE'];
            item ["DATASET"] = TicketData[i]['DATASET'];
            ticketitem.push(item);
        }
    }
    return callback(null, ticketitem);
};
*/

exports.tickets = function(params, callback) {
    $fh.db({
        "act": "list",
        "type": "ticket"
    }, function (err, data) {
        if (err) {
            console.log('error');
            return callback(err, { result: 'failure' });
        } else {
            var mydata = [];
            for(var i = 0; i < data.list.length; i++){
                var item = data.list[i].fields;
                item.guid = data.list[i].guid;
                mydata.push(item);
            }
            return callback(null, mydata);
        }
    })
};

exports.updateTicket = function(params, callback){
    $fh.db({
        "act": "update",
        "type": "ticket",
        "guid": params.ticket.guid,
        "fields": {
            "TICKETID": params.ticket.TICKETID,
            "EXTERNALACCOUNTNO": params.ticket.EXTERNALACCOUNTNO,
            "ACCOUNT": params.ticket.ACCOUNT,
            "ACCOUNTID": params.ticket.ACCOUNTID,
            "TICKETNO": params.ticket.TICKETNO,
            "RECEIVEDDATE": params.ticket.RECEIVEDDATE,
            "SUBJECT": params.ticket.SUBJECT,
            "SOLUTION": params.ticket.SOLUTION,
            "STATUS": params.ticket.STATUS,
            "COMPLETEDDATE": params.ticket.COMPLETEDDATE,
            "DATASET": params.ticket.DATASET
        }
    }, function(err, data) {
        if (err) {
            //process error
        } else {
           // update tickets in memory
        }
    })
};

/*
exports.ticket = function(params, callback){

    var ticketid = params.ticketid;
    console.log(ticketid);
    createjson(ticketid, function(err, jsonobj){
        if(err){
            return callback(err, null);
        }
        else {
            return callback(null, jsonobj);
        }
    })
}
*/
/*
 var initialData = require('./users.json');

 $fh.db({
 "act": "create",
 "type": "users",
 "fields": initialData
 }, function(err, data) {
 if (err) {
 console.log('error: ',err);
 } else {
 console.log(JSON.stringify(data));
 }
 });



 var initialData = require('./userapp.json');

 $fh.db({
 "act": "create",
 "type": "userapp",
 "fields": initialData
 }, function(err, data) {
 if (err) {
 console.log('error: ',err);
 } else {
 console.log(JSON.stringify(data));
 }
 });

 */



function checkUser(username, password, callback) {
    $fh.db({
        "act": "list",
        "type": "users",
        "eq": {
            "username": username,
            "password": password
        }
    }, function (err, data) {
        if (err) {
            console.log('error');
            return callback(err, { result: 'failure' });
        } else {
            if (data &&
                data.count > 0) {
                console.log('success');
                return callback(null, { result: 'success' });
            }
            else {
                console.log('failure');
                return callback(null, { result: 'failure' });
            }
        }
    });
}

exports.login = function(params, callback) {

    var username = params.username;
    var password = params.password;

    checkUser(username, password, function(err, result) {
        if (err) {
            return callback(err, null);
        }
        else {
            return callback(null, result);
        }
    });
};






