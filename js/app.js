//var initData;

function findMachine(type, ip) {
    var initData = JSON.parse(localStorage.getItem('index'));
    for (var i = 0; i < initData.length; i++) {
        for (var j = 0; j < initData[i].machines.length; j++) {
            if (initData[i].machines[j].ip === ip && initData[i].machines[j].type === type)
                return initData[i].machines[j];
        };
    }
    return null;
}

function findCluster(custerName) {
    var initData = JSON.parse(localStorage.getItem('index'));
    for (var i = 0; i < initData.length; i++) {
        if (initData[i].name === custerName) {
            return initData[i];
        }
    }
    return null;
}




var stop;

var routerApp = angular.module('spiderApp', ['ui.router']);

routerApp.service('requestService', function($http) {

    this.requestTomcatDetail = function($scope, ip,port) {
       $http.get('detail.json?ip='+ip+'&port='+port).success(function (data) {
            $scope.tomcat = data;
        });
    }

    this.requestIndex = function($scope){
        $http.get('index.json').success(function (data) {
            $scope.items = data;
            localStorage.setItem('index',JSON.stringify(data));
            // initData = data;
        });
    };

    this.tomcatToggle = function(live,ip,port){
        var url = live?"http://192.168.2.133:8081/shutdown.do":"http://192.168.2.133:8081/startup.do";
        url+='?ip='+ip+'&port='+port;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };
    this.tomcatServiceToggle = function(live,ip,port,path){
        var url = live?"http://192.168.2.133:8081/stop.do":"http://192.168.2.133:8081/start.do";
        url+='?ip='+ip+'&port='+port+'&path=/'+path;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };
    this.tomcatServiceReload = function(ip,port,path){
        var url ="http://192.168.2.133:8081/reload.do";
        url+='?ip='+ip+'&port='+port+'&path=/'+path;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };
    this.tomcatServiceUndeploy = function(ip,port,path){
        var url ="http://192.168.2.133:8081/undeploy.do";
        url+='?ip='+ip+'&port='+port+'&path=/'+path;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };

    this.requestIceDetail = function($scope, ip,port){
        var url = "http://192.168.2.133:8081/appDetail.do";
        url="detail.json";
        url+='?ip='+ip+'&port='+port;
        $http.get(url).success(function (data) {
            $scope.ice = data;
        });
    };
    
    this.iceToggle = function(live,ip,port){
        var url = live?"http://192.168.2.133:8081/appShutdown.do":"http://192.168.2.133:8081/appStartup.do";
        url+='?ip='+ip+'&port='+port;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };


    this.requestNgnixDetail = function($scope, ip,port){
        var url = "http://192.168.2.133:8081/nginxDetail.do";
        url="detail.json";
        url+='?ip='+ip+'&port='+port;
        $http.get(url).success(function (data) {
            $scope.nginx = data;
        });
    };

    this.nginxToggle = function(live,ip,port){
        var url = live?"http://192.168.2.133:8081/nginxShutdown.do":"http://192.168.2.133:8081/nginxStartup.do";
        url+='?ip='+ip+'&port='+port;
        $http.get(url).success(function (data) {
            console.log(data);
        });
    };

});

routerApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/index');

    $stateProvider
        .state('index', {
            url: '/index',
            views: {
                '': {
                    templateUrl: 'tpls/home.html',
                    controller: function(){
                        // Menu Toggle
                       jQuery('.toggle-btn').click(function(){
                           $(".left-side").getNiceScroll().hide();
                           if ($('body').hasClass('left-side-collapsed')) {
                               $(".left-side").getNiceScroll().hide();
                           }
                          var body = jQuery('body');
                          var bodyposition = body.css('position');

                          if(bodyposition != 'relative') {

                             if(!body.hasClass('left-side-collapsed')) {
                                body.addClass('left-side-collapsed');
                                jQuery('.custom-nav ul').attr('style','');

                                jQuery(this).addClass('menu-collapsed');

                             } else {
                                body.removeClass('left-side-collapsed chat-view');
                                jQuery('.custom-nav li.active ul').css({display: 'block'});

                                jQuery(this).removeClass('menu-collapsed');

                             }
                          } else {

                             if(body.hasClass('left-side-show'))
                                body.removeClass('left-side-show');
                             else
                                body.addClass('left-side-show');

                             //mainContentHeightAdjust();
                          }

                       });
                    }
                },
                'nav@index': {
                    templateUrl: 'tpls/nav.html',
                    controller: function($scope,$timeout,requestService) {

                        /*$http.get('index.json').success(function(data, status, headers, config) {

                            $scope.items = data;

                            initData = data;
                        });*/
                        (function tick(){
                            requestService.requestIndex($scope);
                            
                            //$timeout(tick, 2000);
                        })();

                    }
                },
                'main@index': {
                    templateUrl: 'tpls/main.html'
                    
                }
            }
        })
        .state('index.cluster', {
            url: '/cluster/:type',

            views: {
                'main@index': {
                    templateUrl: 'tpls/cluster.html',
                    parent: 'index',
                    controller: function($scope, $state, $http, $stateParams) {
                        console.log($scope);
                        $scope.cluster = findCluster($stateParams.type);

                        //console.log($stateParams);
                        //$state.go("index.cluster");
                    }
                }
            }
        })
        .state('index.tomcat', {
            url: '/tomcat/:ip/:port',
            views: {
                'main@index': {
                    templateUrl: 'tpls/tomcat.html',
                    controller: function($scope,$timeout, $state, $stateParams, requestService) {
                        //$state.go("index.cluster");

                        var ip = $stateParams.ip;
                        var port = $stateParams.port;
                        $scope.$state = $state;
                        $scope.tomcat = null;
                        if(stop){
                            $timeout.cancel(stop);
                            stop = undefined;
                        }

                        $scope.indexInfo = findMachine("tomcat",ip);

                        (function tick() {

                            requestService.requestTomcatDetail($scope,ip,port);
                            
                            stop = $timeout(tick, 1000);
                        })();
                        
                        $state.go('index.tomcat.phyInfo');
                    }
                }

            }
        })
        .state('index.tomcat.phyInfo', {
            url: '/phyInfo',

            views: {
                'content': {
                    templateUrl: 'tpls/t_phyInfo.html',
                    parent: 'index.tomcat',
                    controller: function($scope, $state, $stateParams,requestService) {
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.toggleMachine = function() {
                            requestService.tomcatToggle($scope.tomcat.live,ip,port);
                        }

                    }
                }
            }
        })
        .state('index.tomcat.serInfo', {
            url: '/serviceInfo',
            views: {
                'content@index.tomcat': {
                    templateUrl: 'tpls/t_serInfo.html',
                    controller: function($scope, $state, $stateParams,requestService) {
                        //console.log($stateParams);
                        //$state.go("index.cluster");
                        //console.log($scope);
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;
                        //var path = findMachine("tomcat",ip).name;

                        $scope.serviceToggle = function(index){
                            var service = $scope.tomcat.serviceinfo[index];
                            var path = service.name;
                            requestService.tomcatServiceToggle(service.live,ip,port,path);
                        };

                        $scope.serviceReload = function(index){
                            var service = $scope.tomcat.serviceinfo[index];
                            var path = service.name;
                            requestService.tomcatServiceReload(ip,port,path);
                        };

                        $scope.serviceUndeploy = function(index){
                            var r = confirm("卸载将永久删除服务器上的War包，确定要卸载吗？");
                            if (!r) {
                                return;
                            }
                            var service = $scope.tomcat.serviceinfo[index];
                            var path = service.name;
                            requestService.tomcatServiceUndeploy(ip,port,path);
                        }
                        //$scope.tomcat = findMachine('tomcat', ip);
                        //console.log($scope.tomcat);
                    }
                }
            }
        })
        .state('index.tomcat.serDeploy', {
            url: '/serviceDeploy',
            views: {
                'content': {
                    templateUrl: 'tpls/t_serDeploy.html',
                    controller: function($scope, $state, $http, $stateParams) {
                        
                        $scope.ip = $stateParams.ip;
                        $scope.port = $stateParams.port;

                    }
                }
            }
        })
        .state('index.ice', {
            url: '/ice/:ip/:port',
            views: {
                'main@index': {
                    templateUrl: 'tpls/ice.html',
                    controller: function($scope,$timeout, $state, $stateParams, requestService) {

                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.$state = $state;
                        $scope.ice = null;
                        if(stop){
                            $timeout.cancel(stop);
                            stop = undefined;
                        }

                        $scope.indexInfo = findMachine("ice",ip);

                        (function tick() {

                            requestService.requestIceDetail($scope,ip,port);
                            
                            stop = $timeout(tick, 1000);
                        })();
                        
                        $state.go('index.ice.phyInfo');
                    }
                }
            }
        })
        .state('index.ice.phyInfo', {
            url: '/phyInfo',

            views: {
                'content': {
                    templateUrl: 'tpls/i_phyInfo.html',
                    parent: 'index.ice',
                    controller: function($scope, $state, $stateParams,requestService) {
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.toggleMachine = function() {
                            requestService.iceToggle($scope.ice.live,ip,port);
                        }

                    }
                }
            }
        })
        .state('index.ice.serInfo', {
            url: '/serviceInfo',
            views: {
                'content': {
                    templateUrl: 'tpls/i_serInfo.html',
                    controller: function($scope, $state, $stateParams,requestService) {
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.serviceToggle = function(index){
                            var service = $scope.ice.serviceinfo[index];
                            requestService.iceServiceToggle(service.live,ip,port,path);
                        };

                        $scope.balance = function(index){
                            var service = $scope.ice.serviceinfo[index];
                        };

                    }
                }
            }
        })
        .state('index.nginx', {
            url: '/nginx/:ip/:port',
            views: {
                'main@index': {
                    templateUrl: 'tpls/nginx.html',
                    controller: function($scope,$timeout, $state, $stateParams, requestService) {
                        //$state.go("index.cluster");

                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.$state = $state;
                        $scope.nginx = null;
                        if(stop){
                            $timeout.cancel(stop);
                            stop = undefined;
                        }

                        $scope.indexInfo = findMachine("nginx",ip);

                        (function tick() {

                            requestService.requestNgnixDetail($scope,ip,port);
                            
                            stop = $timeout(tick, 1000);
                        })();
                        
                        $state.go('index.nginx.phyInfo');
                    }
                }
            }
        })
        .state('index.nginx.phyInfo', {
            url: '/phyInfo',

            views: {
                'content': {
                    templateUrl: 'tpls/n_phyInfo.html',
                    parent: 'index.nginx',
                    controller: function($scope, $state, $stateParams,requestService) {
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.toggleMachine = function() {
                            requestService.nginxToggle($scope.nginx.live,ip,port);
                        }

                    }
                }
            }
        })
        .state('index.nginx.serInfo', {
            url: '/serviceInfo',
            views: {
                'content': {
                    templateUrl: 'tpls/n_serInfo.html',
                    controller: function($scope, $state, $stateParams,requestService) {
                        
                        var ip = $stateParams.ip;
                        var port = $stateParams.port;

                        $scope.serviceToggle = function(index){
                            var service = $scope.ice.serviceinfo[index];
                            //var path = service.name;
                            requestService.iceServiceToggle(service.live,ip,port,path);
                        };

                        $scope.balance = function(index){
                            var service = $scope.ice.serviceinfo[index];
                        };

                    }
                }
            }
        })
        .state('index.redis', {
            url: '/redis/:ip/:port',
            views: {
                'main@index': {
                    templateUrl: 'tpls/cluster.html'
                }
            }
        })
       
});