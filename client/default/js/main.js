var app = angular.module('inTouchLogApp', ['ui.bootstrap', 'inTouchLogApp.directives', 'inTouchLogApp.services', 'ngRoute','ngTouch']);
app.config(['$routeProvider',
    function($routeProvider, $location){

        $routeProvider
            .when('/', {
                controller: 'ctrlList',
                templateUrl: '../templates/ticketlst.html'
            })
/*
            .when('/login', {
                controller: 'ctrlLogin',
                templateUrl: '../templates/login.html'
            })
            .when('/view/:ticketid', {
                controller: 'ctrlView',
                templateUrl: '../templates/ticketview.html'
            })
*/
           .otherwise({redirect: '/'});
}]);

app.controller('ctrlList', ['$scope', '$location', 'LoginService', 'MultiTicketLoader',
    function($scope, $location, LoginService, MultiTicketLoader){

/*
        MultiTicketLoader.getTickets();
        $scope.tickets = JSON.parse(localStorage.getItem('intouchtickets'));
        if(!$scope.$$phase) {
            $scope.$apply();
        }
        window.tickets = $scope.tickets;

        $scope.showTicket = function(ticket){
            $location.path('/view/' + ticket.TICKETID);
        };

        $scope.clearAuth = function(){
            localStorage.removeItem('intouchlogauth');
        };
*/
    }
]);

/*
app.controller('ctrlView', ['$scope', '$location', 'TicketLoader', 'LoginService', function($scope, $location, TicketLoader, LoginService) {

    if(!LoginService.isAuth()) {
        $location.path('/login');
    }

    var id = $location.path().substring($location.path().indexOf("/",2)+1);

    $scope.tickets = TicketLoader.getTicket(id);
    $scope.dataSet = TicketLoader.getDataSet($scope.tickets[0]);
    if(!$scope.$$phase) {
        $scope.$apply();
    }

    $scope.hideDIV = function(dataSet, nFlag){
        var toHide;
        for(var i = 0; i < dataSet.length; i++){
            if(dataSet[i][nFlag] === "1"){
                toHide = false;
                break;
            }
            else{
                toHide = true;
            }
        }
        return toHide;
    };

    $scope.back = function(){
        window.tickets = $scope.tickets;
        $location.path("/");
    };

    $scope.prevTicket = function(){
        var id = $location.path().substring($location.path().indexOf("/",2)+1);
        var newid = getTicketID(id,"-");
        $scope.direction = 'right';
        $location.path('/view/' + newid);
    };

    $scope.nextTicket = function(){
        var id = $location.path().substring($location.path().indexOf("/",2)+1);
        var newid = getTicketID(id,"+");
        $scope.direction = 'left';
        $location.path('/view/' + newid);
    };

    getTicketID = function(id,action){
        var tickets = JSON.parse(localStorage.getItem('intouchtickets'));
        var ticket = [];
        for(var i = 0; i < tickets.length; i++){
            if(tickets[i].TICKETID === id){
                if(action === "+" && i+1 < tickets.length){
                    ticket.push(tickets[i+1]);
                }
                else if(action === "-" && i != 0){
                    ticket.push(tickets[i-1]);
                }
                else{
                    ticket.push(tickets[i]);
                }
                break;
            }
        }
        return ticket[0].TICKETID;
    };
}]);


app.controller('ctrlEdit', ['$scope', '$location', 'ticket',
    function($scope, $location, ticket){
        $scope.ticket = ticket;

        $scope.save = function(){
            $scope.ticket.$save(function(ticket){
                $location.path('/view/' + ticket.id);
            });
        };

        $scope.remove = function(){
            delete $scope.ticket;
            $location.path('/');
        };
    }
]);

app.controller('ctrlLogin', function($scope, $location) {

    $scope.login = function() {

        $fh.act(
            {
                act:'login',
                req: {
                    username: $scope.username,
                    password: $scope.password
                }
            },
            function(res) {
                if (res.result === 'success') {
                    localStorage.setItem('intouchlogauth', Math.random());
                }
                else {
                    localStorage.removeItem('intouchlogauth');
                    alert("Incorrect username or password");
                }

                $location.path('/');

                $scope.$apply();
            },
            function(code, errorprops, params) {
                console.error('An error occured: ' + code + ' : ' + JSON.stringify(errorprops));
            }
        );
    };
});

app.controller('ctrlLoadModal', ['$scope', '$modal', '$log', 'LoadLoader', function ($scope, $modal, $log, LoadLoader) {

    $scope.open = function (size, ticket, loadid) {
        var loadData = LoadLoader.getLoadTable(ticket, 'tblIngredientQty', loadid);
        var modalInstance = $modal.open({
            templateUrl: 'myModalContent.html',
            controller: 'ctrlLoadModalInstance',
            size: size,
            resolve: {
                items: function () {
                    return loadData;
                },
                loadno: function(){
                    return loadid;
                }
            }
        });
    };
}]);

app.controller('ctrlLoadModalInstance', ['$scope', '$modalInstance', 'items', 'loadno', function ($scope, $modalInstance, items, loadno) {

    $scope.load = items;
    $scope.loadno = loadno;

    $scope.close = function () {
        $modalInstance.dismiss('cancel');
    };
}]);

app.controller('ctrlEditModal', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {

    $scope.edit = function (size, ticket) {
        var modalInstance = $modal.open({
            templateUrl: 'myModalTicketEdit.html',
            controller: 'ctrlEditModalInstance',
            size: size,
            resolve: {
                ticket: function () {
                    return ticket;
                }
            }
        });
        if(!$scope.$$phase) {
            $scope.$apply();
        }

    };
}]);

app.controller('ctrlEditModalInstance', ['$scope', '$modalInstance', 'ticket', 'updateTickets', function ($scope, $modalInstance, ticket, updateTickets) {

    $scope.ticket = ticket;
    $scope.statuslist = ['Open', 'Closed', 'Cancelled', 'In Process'];

    $scope.submit = function () {
        updateTickets.saveTicket(ticket);
        $modalInstance.dismiss('cancel');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

}]);
*/
