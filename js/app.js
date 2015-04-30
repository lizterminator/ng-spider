var initData;

function findMachine(type, ip) {
    for (var i = 0; i < initData.length; i++) {
        for (var j = 0; j < initData[i].machines.length; j++) {
            if (initData[i].machines[j].ip === ip && initData[i].machines[j].type === type)
                return initData[i].machines[j];
        };
    }
    return null;
}

function findCluster(custerName) {
    for (var i = 0; i < initData.length; i++) {
        if (initData[i].name === custerName) {
            return initData[i];
        }
    }
    return null;
}

var routerApp = angular.module('spiderApp', ['ui.router']);

routerApp.service('requestService',function(){
    
    this.machine = null;
    this.inter = null;
    this.requestMachineDetail = function($scope,type,params){
        // alert(this.test);
        //console.log(ip,params);
        var url = "detail.json";
        if(this.inter){
            clearInterval(this.inter);
        }else{
            this.inter = setInterval(function(){
                $.ajax({
                    url:url,
                    data:params,
                    async: true,
                    method:'GET',
                    dataType: 'json',
                    success: function(data) {
                        $scope[type] = data;
                        //updataMachine(data);
                    }
                })
            },2000);

            //clearInterval(this.inter);
        }

    }
});

routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');
    
    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'tpls/home.html'
                },
                'nav@index': {
                    templateUrl: 'tpls/nav.html',
                    controller: function($scope, $state,$http) {
                        
                        $http.get('index.json').success(function(data, status, headers, config){
                            
                            $scope.items = data;

                            initData = data;
                        });
                    }
                },
                'main@index': {
                    templateUrl: 'tpls/main.html'
                    /*controller: function($scope, $state,$http) {
                        $state.go("index.cluster");
                    }*/
                }
                /*'sidebar@index': {
                    templateUrl: 'tpls3/sidebar.html',
                    controller: function($scope, $state,$http) {
                        
                       

                        $scope.addToStorage = function(){
                            Storage.setObject('machine',this.machine);
                        };
                            // $state.go("index.usermng.addusertype");
                        
                    }
                },
                'main@index': {
                    templateUrl: 'tpls3/home.html'
                }*/
            }
        })
        .state('index.cluster',{
            url: '/cluster/:type',
            views:{ 
                'main@index':{
                    templateUrl: 'tpls/cluster.html',
                    controller: function($scope, $state,$http,$stateParams) {

                        $scope.cluster = findCluster($stateParams.type);

                        //console.log($stateParams);
                        //$state.go("index.cluster");
                    }
                }
            }
        })
        .state('index.tomcat',{
            url: '/tomcat/:ip/:port',
            views:{
                'main@index':{
                    templateUrl: 'tpls/tomcat.html',
                    controller: function($scope, $state,$http,$stateParams,requestService) {
                        console.log($stateParams);
                        //$state.go("index.cluster");
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        requestService.requestMachineDetail($scope,'tomcat',port);

                        //$scope.tomcat = findMachine('tomcat',ip);
                        $state.go('index.tomcat.phyInfo');
                        //console.log($scope.tomcat);
                    }
                }

            }
        })
        .state('index.tomcat.phyInfo',{
            url: '/phyInfo',
            views:{
                'content@index.tomcat':{
                   templateUrl: 'tpls/phyInfo.html',
                   controller: function($scope, $state,$http,$stateParams) {
                        //console.log($stateParams);
                        //$state.go("index.cluster");
                        $http.get('detail.json').success(function(data, status, headers, config){
                            $scope.osinfo = data.osinfo;
                        });
                        //$scope.osinfo = findMachine('tomcat',ip).osinfo;


                        $scope.toggleMachine = function(){
                            alert($stateParams.ip);
                        }
                        
                    }
                }
            }
        })
        .state('index.tomcat.serInfo',{
            url: '/serviceInfo',
            views:{
                'content@index.tomcat':{
                   templateUrl: 'tpls/serInfo.html',
                   controller: function($scope, $state,$http,$stateParams) {
                        //console.log($stateParams);
                        //$state.go("index.cluster");
                        //
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.tomcat = findMachine('tomcat',ip);
                        console.log($scope.tomcat);
                    }
                }
            }
        })
        .state('index.tomcat.serDeploy',{
            url: '/serviceDeploy',
            views:{
                'content':{
                   templateUrl: 'tpls/serDeploy.html',
                   controller: function($scope, $state,$http,$stateParams) {
                        //console.log($stateParams);
                        //$state.go("index.cluster");
                        //
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.tomcat = findMachine('tomcat',ip);
                        console.log($scope.tomcat);
                    }
                }
            }
        })
        .state('index.ice',{
            url: '/ice/:ip/:port',
            views:{
                'main@index':{
                    templateUrl: 'tpls/cluster.html'
                }
            }
        })
        .state('index.nginx',{
            url: '/nginx/:ip/:port',
            views:{
                'main@index':{
                    templateUrl: 'tpls/tomcat.html'
                }
            }
        })
        .state('index.redis',{
            url: '/redis/:ip/:port',
            views:{
                'main@index':{
                    templateUrl: 'tpls/cluster.html'
                }
            }
        })
        /*.state('index.machine',{
            url: '/machine',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/machine.html',
                    controller: function($scope, $state) {
                        $scope.machine = Storage.getObject('machine');
                        console.log($scope.machine);
                    }
                }
            }
        })
        .state('index.usermng', {
            url: '/usermng',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/usermng.html',
                    controller: function($scope, $state) {
                        $scope.addUserType = function() {
                            $state.go("index.usermng.addusertype");
                        }
                    }
                }
            }
        })
        .state('index.usermng.highendusers', {
            url: '/highendusers',
            templateUrl: 'tpls3/highendusers.html'
        })
        .state('index.usermng.normalusers', {
            url: '/normalusers',
            templateUrl: 'tpls3/normalusers.html'
        })
        .state('index.usermng.lowusers', {
            url: '/lowusers',
            templateUrl: 'tpls3/lowusers.html'
        })
        .state('index.usermng.addusertype', {
            url: '/addusertype',
            templateUrl: 'tpls3/addusertypeform.html',
            controller: function($scope, $state) {
                $scope.backToPrevious = function() {
                    window.history.back();
                }
            }
        })
        .state('index.permission', {
            url: '/permission',
            views: {
                'main@index': {
                    template: '这里是权限管理'
                }
            }
        })
        .state('index.report', {
            url: '/report',
            views: {
                'main@index': {
                    template: '这里是报表管理'
                }
            }
        })
        .state('index.settings', {
            url: '/settings',
            views: {
                'main@index': {
                    template: '这里是系统设置'
                }
            }
        })*/
});
