var app = angular.module('inTouchLogApp', ['ui.bootstrap', 'inTouchLogApp.directives', 'inTouchLogApp.services', 'ngRoute', 'ngTouch']);

app.config(['$routeProvider',
    function($routeProvider, $location){

        $routeProvider
            .when('/', {
                controller: 'ctrlList',
                templateUrl: '../templates/ticketlst.html'
            })
            .when('/login', {
                controller: 'ctrlLogin',
                templateUrl: '../templates/login.html'
            })
            .when('/view/:ticketid', {
                controller: 'ctrlView',
                templateUrl: '../templates/ticketview.html'
            })
            .otherwise({redirect: '/'});
}]);

app.controller('ctrlList', ['$scope', '$location', 'LoginService', 'MultiTicketLoader',
    function($scope, $location, LoginService, MultiTicketLoader){

        if(!LoginService.isAuth()) {
            $location.path('/login');
        }

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

        /*
        $scope.tickets = MultiTicketLoader.getTickets;
        console.log('tom is not here');
        $scope.$apply();
        */
    }
]);

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
                if(action === "+"){
                    ticket.push(tickets[i+1]);
                }
                else if(action === "-"){
                    ticket.push(tickets[i-1]);
                }
                else{
                    ticket.push(tickets[i]);
                }
                break;
            }
        }
        return ticket.TICKETID;
    };
}]);


app.controller('ctrlEdit', ['$scope', '$location', 'ticket',
    function($scope, $location, ticket){
        $scope.ticket = ticket;

        $scope.save = function(){
            $scope.ticket.$save(function(ticket){
                $location.path('/view/' + ticket.id);
            })
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

//http://plnkr.co/edit/bfpma2?p=preview login example
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

// Please note that $modalInstance represents a modal window (instance) dependency.
// It is not the same as the $modal service used above.

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

    /*
    function changeCompletedDate(newValue, oldValue, scope) {

        if(newValue.STATUS === "Closed" && oldValue.STATUS != "Closed"){
            $scope.tRequired = true;
        }
        else{
            $scope.tRequired = false;
        }
        console.log($scope.tRequired);

    };

    $scope.$watch($scope.ticket,changeCompletedDate);
*/
}]);

    /*

     http://docs.feedhenry.com/v2/api_client_hybrid.html#$fh.data
     https://github.com/feedhenry-training/OAuth-Tutorial/blob/master/client/default/js/FHOAuthUsers.js
     http://stackoverflow.com/questions/2010892/storing-objects-in-html5-localstorage
     http://www.w3schools.com/html/html5_webstorage.asp
     http://stackoverflow.com/questions/3718349/html5-localstorage-security
     http://amitavroy.com/justread/content/articles/html5-local-storage-angular-js
     https://docs.angularjs.org/api/ngResource/service/$resource

     app.config(['$urlRouterProvider', '$stateProvider',
     function($urlRouterProvider, $stateProvider){
     $urlRouterProvider.otherwise(('/'));
     $stateProvider
     .state('home',{
     url:'/',
     templateUrl: 'templates/home.html'
     }

     )
     .state('Login', {
     url: '/login',
     templateUrl: 'templates/login.html'
     }
     )
     .state('ticketlst', {
     url: '/ticketlst',
     templateUrl: 'templates/ticketlst.html'
     }
     )
     .state('ticketdtl', {
     url: '/ticketdtl',
     templateUrl: 'templates/ticketdtl.html'
     }
     )
     }]);

    // Load data into memory
    $fh.data({
        act: "save",
        key: "tickets",
        val
    })

    $scope.tickets = [];

    $scope.tickets = function() {
    $fh.act({
        act: 'tickets'
        },
        function(res) {
           return res.data
        },
        function(code, errorprops) {
            console.error('An error occured: ' + code + ' : ' + JSON.stringify(errorprops));
        });
    };
});


function ctrlTicketLst($scope, $http) {

    $scope.tickets = [];

    $scope.tickets = function() {
        var httpRequest = $http({
            method: 'POST',
            url: '/AppData/',
            data: mockDataForThisTest

        }).success(function(data, status) {
            $scope.people = data;
        });

    };
)
*/
