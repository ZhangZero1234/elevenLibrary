/*! Elevenlibrary - v0.1.0 - 2016-02-17 */
function url_base64_decode(str) {
    var output = str.replace("-", "+").replace("_", "/");
    switch (output.length % 4) {
    case 0:
        break;
    case 2:
        output += "==";
        break;
    case 3:
        output += "=";
        break;
    default:
        throw "Illegal base64url string!"
    }
    return window.atob(output)
}
var mainApp = angular.module("mainApp", ["ui.router", "bookApp", "ngCookies", "adminApp", "userApp"]);
mainApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/books/all"),
    $stateProvider.state("main", {
        url: "",
        templateUrl: "views/book/main.html",
        controller: "MainBooksCtrl"
    }).state("main.all", {
        url: "/books/all",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.frontend", {
        url: "/books/frontend",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.backend", {
        url: "/books/backend",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.database", {
        url: "/books/database",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.bigdata", {
        url: "/books/bigdata",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.ios", {
        url: "/books/ios&android",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.ui", {
        url: "/books/ui",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.other", {
        url: "/books/other",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.liked", {
        url: "/books/liked",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.borrowed", {
        url: "/books/borrowed",
        templateUrl: "views/book/allbooks.html",
        controller: "AllBooksCtrl"
    }).state("main.detail", {
        url: "/book/:bookId",
        templateUrl: "views/book/detailbook.html",
        controller: "DetailBookCtrl"
    }).state("main.home", {
        url: "/home",
        templateUrl: "views/user/home.html",
        controller: "UserHomeCtrl"
    }).state("login", {
        url: "/login",
        templateUrl: "views/user/login.html",
        controller: "LoginCtrl"
    }).state("register", {
        url: "/register",
        templateUrl: "views/user/register.html",
        controller: "RegCtrl"
    }).state("manage", {
        url: "",
        templateUrl: "views/admin/admin-main.html",
        controller: "ManageCtrl"
    }).state("manage.books", {
        url: "/manage/books",
        templateUrl: "views/admin/admin-books.html",
        controller: "ManageBooksCtrl"
    }).state("manage.events", {
        url: "/manage/events",
        templateUrl: "views/admin/admin-events.html",
        controller: "ManageEventsCtrl"
    }).state("manage.logs", {
        url: "/manage/logs",
        templateUrl: "views/admin/admin-logs.html",
        controller: "ManageLogsCtrl"
    }).state("manage.newBook", {
        url: "/manage/newBook",
        templateUrl: "views/admin/admin-new.html",
        controller: "NewBookCtrl"
    }).state("manage.detail", {
        url: "/manage/book/:bookId",
        templateUrl: "views/admin/admin-item.html",
        controller: "ManageBookCtrl"
    }).state("adminLogin", {
        url: "/adminLogin",
        templateUrl: "views/admin/adminlogin.html",
        controller: "AdminLoginCtrl"
    })
}),
mainApp.run(function($rootScope, $window, $cookies, $http, $location) {
    var user = $cookies.getObject("user");
    console.log("$cookies User=", user),
    $rootScope.logInUser = {
        name: user ? user.name: "",
        intrID: user ? user.intrID: "",
        phoneNum: user ? user.phoneNum: "",
        image: user ? user.image: ""
    },
    $rootScope.logOut = function() {
        $http.post("/user/logOut").success(function(res) {
            $rootScope.logInUser = {},
            $cookies.remove("user"),
            $cookies.remove("connect.sid")
        }).error(function(res) {
            console.log("Logout Failed!")
        })
    },
    $rootScope.adminLogOut = function() {
        $http.post("/admin/logOut").success(function(res) {
            $cookies.remove("status_admin");
            $location.path("/adminLogin")
        }).error(function(res) {
            console.log("Admin Logout Failed!")
        })
    }
}),
mainApp.factory("authInterceptor",
function($rootScope, $q, $window, $location) {
    return {
        responseError: function(rejection) {
            return console.log("rejection", rejection),
            401 === rejection.status && "User" === rejection.data ? (console.log("[responseError]session timeout"), $location.path("/login")) : 401 === rejection.status && "Admin" === rejection.data && $location.path("/adminLogin"),
            $q.reject(rejection)
        }
    }
}),
mainApp.config(function($httpProvider) {
    $httpProvider.interceptors.push("authInterceptor")
});
mainApp.controller("mainCtrl_zc",["$scope","$rootScope",function($scope,$rootScope){
    
}]);
var adminApp = angular.module("adminApp", ["ngMessages", "ngTable"]);
adminApp.controller("ManageCtrl", ["$cookies","$scope", "$state", "$timeout", "NgTableParams", "adminBooksService", "EventsService", "LogsService",
function($cookies,$scope, $state, $timeout, NgTableParams, adminBooksService, EventsService, LogsService) {
    function initData() {
        "manage.books" == $state.current.name ? $scope.currentState.route = 0 : "manage.events" == $state.current.name ? $scope.currentState.route = 1 : "manage.logs" == $state.current.name && ($scope.currentState.route = 2)
    }
    $scope.currentState = {
        route: 0,
        book: {
            count: {
                totalNum: 0,
                freeNum: 0,
                resNum: 0,
                borNum: 0
            },
            message: {
                type: 0,
                book: {}
            }
        },
        events: {
            count: 0,
            bCount: 0
        },
        logs: {
            count: 0
        }
    },
    $scope.alertMessage = function(type, book) {
        $scope.currentState.book.message.type = type,
        $scope.currentState.book.message.book = book,
        $timeout(function() {
            $scope.currentState.book.message.type = 0,
            $scope.currentState.book.message.book = {}
        },
        3e3)
    },
    initData(),
    $scope.findBook = function(bookId) {
        for (var index = 0; index < adminBooksService.books.length; index++) if (adminBooksService.books[index].unqId == bookId) return index
    },
    $scope.$watch(function() {
        return adminBooksService.books.length
    },
    function() {
        $scope.currentState.book.count.totalNum = adminBooksService.books.length,
        $scope.currentState.book.count.freeNum = 0,
        $scope.currentState.book.count.resNum = 0,
        $scope.currentState.book.count.borNum = 0,
        angular.forEach(adminBooksService.books,
        function(book) {
            0 == book.status ? $scope.currentState.book.count.freeNum++:1 == book.status ? $scope.currentState.book.count.resNum++:2 == book.status && $scope.currentState.book.count.borNum++
        })
    }),
    $scope.$watch(function() {
        return EventsService.events.length
    },
    function() {
        $scope.currentState.events.count = EventsService.events.length
    }),
    $scope.$watch(function() {
        return LogsService.logs.length
    },
    function() {
        $scope.currentState.logs.count = LogsService.logs.length
    }),
    $scope.getBookData = function() {
        var buffer = '';
        $scope.tableParams = new NgTableParams,
        adminBooksService.getAllBooks(function(res) {
            adminBooksService.books = [];
            var status_admin = $cookies.getObject("status_admin");
            // console.log("$cookies status_admin=", status_admin.intrID);
            if(status_admin!=undefined)
            {
                if(status_admin.intrID == 'libadmin@cn.ibm.com')
                {
                    buffer = 'ibm';
                }
                else
                {
                    buffer = status_admin.intrID;
                }
            }
            // if(status_admin.intrID == 'libadmin@cn.ibm.com')
            // {
            //     buffer = 'ibm';
            // }
            // else if(status_admin!=undefined)
            // {
            //     buffer = status_admin.intrID;
            // }
            console.log("buffer=", buffer);
            // console.log(res[0].owner);
            for(var i = 0; i<res.length;i++)
            {
                if(res[i].owner == buffer)
                {
                    adminBooksService.books.push(res[i]);
                }
            }
            // adminBooksService.books = adminBooksService.books.concat(res),
            console.log("GetAllBooks", res),
            $scope.tableParams = new NgTableParams({
                count: 10
            },
            {
                filterOptions: {
                    filterComparator: !1
                },
                counts: [5, 10, 25],
                dataset: adminBooksService.books
            })
        },
        function(res) {
            console.log("getAllBooks Error", res)
        })
    },
    //1017
    $scope.getEventData = function() {
        var owner_identify = '';
        EventsService.getAllEvents().success(function(res) {
            EventsService.events = [],
            console.log("GetAllEvents", res);
            if($cookies.getObject("status_admin")!= undefined)
            {
                if($cookies.getObject("status_admin").intrID == "libadmin@cn.ibm.com")
                {
                    owner_identify = 'ibm';
                }
                else{                    
                        owner_identify = $cookies.getObject("status_admin").intrID;                    
                }
            }
            // if($cookies.getObject("status_admin").intrID == "libadmin@cn.ibm.com")
            // {
            //     owner_identify = 'ibm';
            // }
            // else{
            //     if($cookies.getObject("status_admin").intrID != undefined)
            //     {
            //         owner_identify = $cookies.getObject("status_admin").intrID;
            //     }
            // }
            for(var i = 0 ; i < res.length; i++)
            {
                if(res[i].owner == undefined)
                {
                    continue;
                }
                else
                if(res[i].owner == owner_identify)
                {
                    EventsService.events.push(res[i]);
                }
            }
            // EventsService.events = res,
            $scope.eventTableParams = new NgTableParams({
                count: 10
            },
            {
                counts: [5, 10, 25],
                dataset: EventsService.events
            })
        }).error(function(err) {
            console.error("GetAllEvents", err)
        })
    },
    $scope.getLogData = function() {
        LogsService.getAllLogs().success(function(res) {
            LogsService.logs = [],
            LogsService.logs = res,
            console.log("GetAllLogs:", LogsService.logs),
            $scope.logTableParams = new NgTableParams({
                count: 25
            },
            {
                filterOptions: {
                    filterComparator: !1
                },
                counts: [25, 50, 100],
                dataset: LogsService.logs
            })
        }).error(function(res) {
            console.log("GetAllLogs Error:", res)
        })
    },
    $scope.getBookData(),
    $scope.getEventData(),
    $scope.getLogData()
}]),
adminApp.controller("ManageBooksCtrl", ["$scope", "$element", "$http", "$location", "$timeout", "NgTableParams", "adminBooksService",
function($scope, $element, $http, $location, $timeout, NgTableParams, adminBooksService) {

    function settingSearch() {
        "0" == $scope.setting.search.type ? ($scope.tableParams.filter().unqId = $scope.setting.search.value, $scope.tableParams.filter().name = "", $scope.tableParams.filter().author = "", $scope.tableParams.filter().isbn = "") : "1" == $scope.setting.search.type ? ($scope.tableParams.filter().name = $scope.setting.search.value, $scope.tableParams.filter().unqId = "", $scope.tableParams.filter().author = "", $scope.tableParams.filter().isbn = "") : "2" == $scope.setting.search.type ? ($scope.tableParams.filter().author = $scope.setting.search.value, $scope.tableParams.filter().unqId = "", $scope.tableParams.filter().name = "", $scope.tableParams.filter().isbn = "") : "3" == $scope.setting.search.type && ($scope.tableParams.filter().isbn = $scope.setting.search.value, $scope.tableParams.filter().unqId = "", $scope.tableParams.filter().name = "", $scope.tableParams.filter().author = "")
    }
    $scope.bookRoute = !0,
    $scope.setting = {
        search: {
            type: "0",
            value: ""
        },
        showStatusValue: "",
        showAllFilters: !1,
        showPublisher: !1,
        showPageCount: !1,
        showPrice: !1,
        showLikes: !0,
        showComments: !1,
        showEvaluations: !1
    },
    $scope.getBookData(),
    $scope.checkboxes = {
        checked: !1,
        items: {}
    },
    $scope.statuses = [{
        id: 0,
        title: "Free"
    },
    {
        id: 1,
        title: "Reserved"
    },
    {
        id: 2,
        title: "Borrowed"
    }],
    $scope.$watch(function() {
        return $scope.checkboxes.checked
    },
    function(value) {
        angular.forEach(adminBooksService.books,
        function(item) {
            $scope.checkboxes.items[item.unqId] = value
        })
    }),
    $scope.$watch(function() {
        return $scope.setting.search.type
    },
    function(values) {
        settingSearch()
    }),
    $scope.$watch(function() {
        return $scope.setting.search.value
    },
    function(values) {
        settingSearch()
    }),
    $scope.$watch(function() {
        return $scope.checkboxes.items
    },
    function(values) {
        var checked = 0,
        unchecked = 0,
        total = adminBooksService.books.length;
        angular.forEach(adminBooksService.books,
        function(item) {
            checked += $scope.checkboxes.items[item.unqId] || 0,
            unchecked += !$scope.checkboxes.items[item.unqId] || 0
        }),
        (0 == unchecked || 0 == checked) && 0 != total && ($scope.checkboxes.checked = checked == total),
        angular.element($element[0].getElementsByClassName("select-all")).prop("indeterminate", 0 != checked && 0 != unchecked)
    },
    !0);
    var defaultSetting = {
        search: {
            type: "0",
            value: ""
        },
        showStatusValue: "",
        showAllFilters: !1,
        showPublisher: !1,
        showPageCount: !1,
        showPrice: !1,
        showLikes: !0,
        showComments: !1,
        showEvaluations: !1,
        showStrict: !1
    },
    currentSetting = {
        search: {
            type: "",
            value: ""
        },
        showStatusValue: "",
        showAllFilters: !1,
        showPublisher: !1,
        showPageCount: !1,
        showPrice: !1,
        showLikes: !0,
        showComments: !1,
        showEvaluations: !1,
        showStrict: !1
    };
    $scope.setTable = function() {
        currentSetting.search.type = $scope.setting.search.type,
        currentSetting.search.value = $scope.setting.search.value,
        currentSetting.showStatusValue = $scope.tableParams.filter().status,
        currentSetting.showAllFilters = $scope.setting.showAllFilters,
        currentSetting.showPublisher = $scope.setting.showPublisher,
        currentSetting.showPageCount = $scope.setting.showPageCount,
        currentSetting.showPrice = $scope.setting.showPrice,
        currentSetting.showLikes = $scope.setting.showLikes,
        currentSetting.showComments = $scope.setting.showComments,
        currentSetting.showEvaluations = $scope.setting.showEvaluations,
        currentSetting.showStrict = $scope.tableParams.settings().filterOptions.filterComparator
    },
    $scope.restoreTable = function() {
        $scope.setting.search.type = defaultSetting.search.type,
        $scope.setting.search.value = defaultSetting.search.value,
        $scope.tableParams.filter().status = defaultSetting.showStatusValue,
        $scope.setting.showAllFilters = defaultSetting.showAllFilters,
        $scope.setting.showPublisher = defaultSetting.showPublisher,
        $scope.setting.showPageCount = defaultSetting.showPageCount,
        $scope.setting.showPrice = defaultSetting.showPrice,
        $scope.setting.showLikes = defaultSetting.showLikes,
        $scope.setting.showComments = defaultSetting.showComments,
        $scope.setting.showEvaluations = defaultSetting.showEvaluations,
        $scope.tableParams.settings().filterOptions.filterComparator = defaultSetting.showStrict
    },
    $scope.cancelTable = function() {
        $scope.setting.search.type = currentSetting.search.type,
        $scope.setting.search.value = currentSetting.search.value,
        $scope.tableParams.filter().status = currentSetting.showStatusValue,
        $scope.setting.showAllFilters = currentSetting.showAllFilters,
        $scope.setting.showPublisher = currentSetting.showPublisher,
        $scope.setting.showPageCount = currentSetting.showPageCount,
        $scope.setting.showPrice = currentSetting.showPrice,
        $scope.setting.showLikes = currentSetting.showLikes,
        $scope.setting.showComments = currentSetting.showComments,
        $scope.setting.showEvaluations = currentSetting.showEvaluations,
        $scope.tableParams.settings().filterOptions.filterComparator = currentSetting.showStrict
    },
    $scope.deleteBooks = function() {
        $scope.deleteBookList = {
            isDeleting: !1,
            deletedNum: 0,
            list: []
        },
        angular.forEach(adminBooksService.books,
        function(book) {
            if ($scope.checkboxes.items[book.unqId]) { ({
                    unqId: book.unqId,
                    name: book.name,
                    isbn: book.isbn,
                    delType: 0
                });
                $scope.deleteBookList.list.push(book)
            }
        }),
        0 !== $scope.deleteBookList.list.length && $("#deleteBooksModal").modal("toggle")
        console.log($scope.deleteBookList);
    },
    $scope.startDelete = function() {
        
        function result(count) {
            count == $scope.deleteBookList.list.length && ($("#deleteBooksModal").modal("hide"),0 == failCount ? $scope.alertMessage(3, {
                count: count
            }) : $scope.alertMessage(9, {
                succCount: succCount,
                failCount: failCount
            }))
        }
        var count = 0,
        succCount = 0,
        failCount = 0;
        angular.forEach($scope.deleteBookList.list,
        function(book) {
            
            adminBooksService.deleteOneBook(book.unqId,
            function(res) {
                console.log("success");   
                 0 == res.errType ? (adminBooksService.books.splice($scope.findBook(book.unqId), 1), $scope.tableParams.reload(), succCount++, result(++count)) : (failCount++, result(++count));
            },
            function(res) {
                console.log(res);
                failCount++;
                result(++count);
            });
            // console.log("err function");
        })
    },
    $scope.modifyBook = function() {
        var modifyBookList = [];
        angular.forEach(adminBooksService.books,
        function(book) {
            $scope.checkboxes.items[book.unqId] && modifyBookList.push(book.unqId)
        }),
        1 == modifyBookList.length && $location.path("/manage/book/" + modifyBookList[0])
    }
}]),
adminApp.controller("ManageBookCtrl", ["$scope", "$http", "$timeout", "$location", "$stateParams", "adminBooksService",
function($scope, $http, $timeout, $location, $stateParams, adminBooksService) {
    $scope.book = {},
    $scope.initBook = function() {
        for (var index = 0; index < adminBooksService.books.length; index++) if (adminBooksService.books[index].unqId == $stateParams.bookId) {
            $scope.book = adminBooksService.books[index],
            console.log($scope.book);
            break
        }
        $scope.book.unqId || $location.path("/manage/books")
    },
    $scope.initBook(),
    $scope.getDouban = function() {
        var iserror = !0;
        $http.jsonp("https://api.douban.com/v2/book/isbn/" + $scope.book.isbn, {
            params: {
                callback: "MyCallback"
            }
        }).error(function(data) {
            iserror && $scope.alertMessage(15, $scope.book)
        }),
        window.MyCallback = function(data) {
            iserror = !1,
            console.log("Complete book info:", data),
            $scope.book.name = data.title,
            $scope.book.image = data.images.large,
            $scope.book.author = data.author[0],
            $scope.book.publisher = data.publisher,
            $scope.book.pageCount = data.pages,
            $scope.book.price = data.price.replace(/[\u4e00-\u9fa5]/, ""),
            $scope.book.desc = data.summary
        }
    },
    $scope.saveBook = function() {
        $("#saveButton").button("loading"),
        adminBooksService.setBook($scope.book,
        function(res) {
            0 == res.errType ? (adminBooksService.books.splice($scope.findBook($scope.book.unqId), 1, $scope.book), $scope.alertMessage(4, $scope.book), $location.path("/manage/books")) : 1 == res.errType ? $scope.alertMessage(11, $scope.book) : $scope.alertMessage(12, $scope.book),
            $("#saveButton").button("reset")
        },
        function(res) {
            $("#saveButton").button("reset"),
            $scope.alertMessage(12, $scope.book)
        })
    },
    $scope.deleteBook = function() {
        $("#deleteButton").button("loading"),
        adminBooksService.deleteOneBook($scope.book.unqId,
        function(res) {
            0 == res.errType ? (adminBooksService.books.splice($scope.findBook($scope.book.unqId), 1), $scope.alertMessage(2, $scope.book), $timeout(function() {
                $location.path("/manage/books")
            },
            500)) : 1 == res.errType ? $scope.alertMessage(7, $scope.book) : $scope.alertMessage(8, $scope.book),
            $("#deleteButton").button("reset")
        },
        function(res) {
            $("#deleteButton").button("reset"),
            $scope.alertMessage(8, $scope.book)
        }),
        $("#deleteBookModal").modal("hide")
    }
}]),
adminApp.controller("NewBookCtrl", ["$cookies","$scope", "$http", "$timeout", "$location", "adminBooksService",
function($cookies,$scope, $http, $timeout, $location, adminBooksService) {
    var date = new Date();
    $scope.book = {},
    $scope.book.status = 0;
    $scope.book.unqId = (Date.parse(new Date())/2+parseInt(Math.random()*1000000000)).toString()+parseInt(Math.random()*100);
    // $scope.book.unqId = $scope.book.isbn;
    if($cookies.getObject("status_admin").intrID == "libadmin@cn.ibm.com")
    {
        $scope.book.owner = 'ibm'; 
    }
    else{
        if($cookies.getObject("status_admin").intrID!=undefined)
        {
             $scope.book.owner = $cookies.getObject("status_admin").intrID;
        }
       
    }
    $scope.getDouban = function() {
        var iserror = !0;
        $http.jsonp("https://api.douban.com/v2/book/isbn/" + $scope.book.isbn, {
            params: {
                callback: "MyCallback"
            }
        }).error(function(data) {
            iserror && $scope.alertMessage(15, $scope.book)
        }),
        window.MyCallback = function(data) {
            iserror = !1,
            console.log("Complete book info:", data),
            $scope.book.name = data.title,
            $scope.book.image = data.images.large,
            $scope.book.author = data.author[0],
            $scope.book.publisher = data.publisher,
            $scope.book.pageCount = data.pages,
            $scope.book.price = data.price.replace(/[\u4e00-\u9fa5]/, ""),
            $scope.book.desc = data.summary
        }
    },
    $scope.addBook = function() {
        $("#addButton").button("loading"),
        adminBooksService.addBook($scope.book,
        function(res) {
            0 == res.errType ? (adminBooksService.books.push($scope.book), $location.path("/manage/books"), $scope.alertMessage(1, $scope.book)) : 1 == res.errType ? $scope.alertMessage(5, $scope.book) : $scope.alertMessage(6, $scope.book),
            $("#addButton").button("reset")
        },
        function(res) {
            $("#addButton").button("reset"),
            $scope.alertMessage(6, $scope.book)
        })
    }
}]),
adminApp.controller("ManageEventsCtrl", ["$rootScope","$scope", "$rootScope", "EventsService", "NgTableParams", "adminBooksService",
function($rootScope, $scope, $rootScope, EventsService, NgTableParams, adminBooksService) {
    $scope.getEventData(),
    //1023 
    $scope.accept = function(event) {
        $scope.curEvent = event,
        EventsService.acceptEvent(event.unqId, event.intrID).success(function(res) { 
            // console.log(res);   
            if (0 == res.errType) {
                for (var i = 0; i < EventsService.events.length; i++) if (EventsService.events[i].unqId === event.unqId) {
                    EventsService.events[i].status = 2,
                    EventsService.events[i].borrowTime = res.borrowTime,
                    EventsService.events[i].returnTime = res.returnTime;
                    break
                }
            } else $("#warningModal").modal("show")
        }).error(function(res) {
            console.log(res),
            $("#warningModal").modal("show")
        })
    },
    //1031
    $scope["return"] = function(event) {
        EventsService.returnEvent(event.unqId, event.intrID).success(function(res) {
            if (0 == res.errType) {
                for (var i = 0; i < EventsService.events.length; i++) if (EventsService.events[i].unqId === event.unqId) {
                    EventsService.events.splice(i, 1),
                    $scope.eventTableParams.reload();
                    break
                }
            } else $("#returnModal").modal("show")
        }).error(function(res) {
            console.log(res),
            $("#returnModal").modal("show")
        })
    }
}]),
adminApp.controller("ManageLogsCtrl", ["$scope", "LogsService",
function($scope, LogsService) {
    $scope.getLogData(),
    $scope.deleteLog = function(_id) {
        LogsService.deleteLog(_id).success(function(res) {
            for (var i = 0; i < LogsService.logs.length; i++) if (LogsService.logs[i]._id == _id) {
                LogsService.logs.splice(i, 1),
                $scope.logTableParams.reload();
                break
            }
        })
    }
}]);
var bookApp = angular.module("bookApp", ["wu.masonry", "infinite-scroll", "serviceApp"]);
bookApp.controller("MainBooksCtrl", ["$scope", "$state", "$rootScope", "BooksService",
function($scope, $state, $rootScope, BooksService) {
   
    console.log("MainBooksCtrl Start"),
    $scope.books = [],
    $scope.popBooks = [],
    $scope.getDataOver = !1,
    $scope.showScrollToTop = !1;
    $scope.$watch(function() {
        return $state.current.name
    },
    function() {
        "main.all" == $state.current.name ? $scope.cate = "": "main.frontend" == $state.current.name ? $scope.cate = "Frontend": "main.backend" == $state.current.name ? $scope.cate = "Backend": "main.database" == $state.current.name ? $scope.cate = "Database": "main.bigdata" == $state.current.name ? $scope.cate = "Big Data": "main.ios" == $state.current.name ? $scope.cate = "IOS/Android": "main.ui" == $state.current.name ? $scope.cate = "UI Design": "main.other" == $state.current.name ? $scope.cate = "Other": "main.liked" == $state.current.name ? $scope.cate = "userLiked": "main.borrowed" == $state.current.name && ($scope.cate = "userBorrowed")
    }),
    $scope.updatePop = function() {
        function sortLikes(a, b) {
            return b.likes.length - a.likes.length
        }
        var books = [];
        $scope.popBooks = [];
        for (var index in $scope.books) books.push($scope.books[index]);
        $scope.popBooks = books.sort(sortLikes)
    },
    $scope.showMoreBooks = function() {},
    $scope.update = function() {
        $scope.books = [],
        $scope.getDataOver = !1,
        $scope.showScrollToTop = !1,
        BooksService.getAllBooks().success(function(res) {
            for (var intrID = $rootScope.logInUser.intrID,
            total = 0,
            i = 0; i < res.length; i++) {
                for (var k = 0; k < res[i].likes.length; k++) if (res[i].likes[k] === intrID) {
                    res[i].isLiked = !0;
                    break
                }
                total = 0;
                for (var k = 0; k < res[i].rates.length; k++) total += res[i].rates[k].value,
                res[i].rates[k].intrID === intrID && (res[i].isRated = !0, res[i].rateValue = res[i].rates[k].value);
                res[i].avaValue = 0 == res[i].rates.length ? 0 : parseFloat(total / res[i].rates.length).toFixed(1),
                res[i].image = res[i].image ? res[i].image: "images/gray.jpg",
                $scope.books.push(res[i])
            }
            $scope.updatePop(),
            $scope.getDataOver = !0
        })
    }
}]),
bookApp.controller("AllBooksCtrl", ["$scope", "$rootScope", "$state", "$timeout", "BooksService",
function($scope, $rootScope, $state, $timeout, BooksService) {
    console.log("AllBooksCtrl Start"),
    $scope.update();
    var timeout;
    
    $scope.like = function(book) {
        book.isLiked = !book.isLiked,
        timeout && $timeout.cancel(timeout),
        timeout = $timeout(function() {
            BooksService.likeBook(book.isbn, $rootScope.logInUser.intrID, book.isLiked).success(function(res) {
                book.likes = res;
                for (var i = 0; i < book.likes.length; i++) if (book.likes[i] === $rootScope.logInUser.intrID) {
                    book.isLiked = !0;
                    break
                }
                $scope.updatePop()
            })
        },
        500)
    }
}]),
bookApp.controller("DetailBookCtrl", ["$http","$cookies","$scope", "$rootScope", "$timeout", "$state", "$location", "BooksService", "$window",
function($http,$cookies,$scope, $rootScope, $timeout, $state, $location, BooksService, $window) {
    console.log("DetailBookCtrl Start"),
    $scope.simBooks = [],
    $scope.tarValue = 0,
    $scope.content = "",
    $scope.index = -1,
    $scope.update(),
    $scope.expireDate = new Date;
    // Charlene
    // lzishuo@cn.ibm.com
    // 17709812886
    // if($cookies.getObject("status_admin").intrID == "libadmin@cn.ibm.com")
    // {
    //     $scope.contact_name = "Charlene";
    //     $scope.contact_email = "lzishuo@cn.ibm.com";
    //     $scope.contact_phone = "17709812886";
    // }
    // else if($cookies.getObject("status_admin").intrID != undefined)
    // {
    //     $scope.contact_name = "Charlene";
    //     $scope.contact_email = "lzishuo@cn.ibm.com";
    //     $scope.contact_phone = "17709812886";
    // }
    $scope.$watch(function() {
        return $scope.getDataOver
    },
    function() {
        for (var i = 0; i < $scope.books.length; i++) if ($scope.books[i].isbn == $state.params.bookId) {
            $scope.index = i,
            $scope.books[i].applyTime && ($scope.expireDate = new Date($scope.books[i].applyTime).setDate(new Date($scope.books[i].applyTime).getDate() + 2));
            break
        }
            $http.post("/details/contact/info",{isbn:$state.params.bookId}).success(function(res){
            console.log(res);
            if(res.errType==0){if(res.owner =='ibm'){
                $scope.contact_name = "Charlene";
                $scope.contact_email ="lzishuo@cn.ibm.com";
                $scope.contact_phone ="17709812886";
            }
            else
            {
                $scope.contact_name = res.name;
                $scope.contact_email = res.owner;
                $scope.contact_phone = res.phone;
            }}
        });
    }),
    
    BooksService.getSimilarBooks($state.params.bookId).success(function(res) {
        $scope.simBooks = res,
        $scope.showSimilarBooks = 0 != $scope.simBooks.length ? !0 : !1
    }),
    //975
    $scope.borrow = function() {
        BooksService.borrrowBook($state.params.bookId, $rootScope.logInUser.intrID).success(function(res) {
             // console.log(res);
            0 == res.errType ? ($scope.books[$scope.index].intrID = $rootScope.logInUser.intrID, $scope.books[$scope.index].status = 1, $scope.books[$scope.index].applyTime = res.applyTime, $scope.showMsg = !0, $scope.books[$scope.index].applyTime && ($scope.expireDate = new Date($scope.books[$scope.index].applyTime).setDate(new Date($scope.books[$scope.index].applyTime).getDate() + 2))) : 1 == res.errType ? $("#warningModal").modal("show") : 2 == res.errType ? $("#noneModal").modal("show") : 3 == res.errType && $("#errorModal").modal("show")
        }).error(function(res) {
        	// console.log(res);
            console.log(res, "BorrowBook")
        })
    },
    $scope.cancel = function() {
        $timeout(function() {
            BooksService.cancelBook($state.params.bookId, $rootScope.logInUser.intrID).success(function(res) {
                delete $scope.books[$scope.index].intrID,
                $scope.books[$scope.index].status = 0
            }).error(function(res) {
                console.log("cancelBook error")
            })
        },
        200)
    };
    var timeout;
    var flag_click_submitComent = true;
    var flag_like=true;
    $scope.like = function() {
        console.log(1);
        if(!flag_like){
            return;
        }
        flag_like = false;
        $scope.books[$scope.index].isLiked = !$scope.books[$scope.index].isLiked,
        timeout && $timeout.cancel(timeout),
        // timeout = $timeout(function() {
            BooksService.likeBook($scope.books[$scope.index].isbn, $rootScope.logInUser.intrID, $scope.books[$scope.index].isLiked).success(function(res) {
                $scope.books[$scope.index].likes = res,
                $scope.updatePop();
                flag_like = true;
            })
        // },
        // 500)
    },
    $scope.rate = function(value) {
        $scope.books[$scope.index].rateValue = value,
        BooksService.rateBook($scope.books[$scope.index].isbn, $rootScope.logInUser.intrID, value).success(function(res) {
            $scope.books[$scope.index].rates = res;
            for (var total = 0,
            i = 0; i < $scope.books[$scope.index].rates.length; i++) total += $scope.books[$scope.index].rates[i].value,
            $scope.books[$scope.index].rates[i].intrID === $rootScope.logInUser.intrID && ($scope.books[$scope.index].isRated = !0, $scope.books[$scope.index].rateValue = $scope.books[$scope.index].rates[i].value);
            $scope.books[$scope.index].avaValue = 0 == $scope.books[$scope.index].rates.length ? 0 : parseFloat(total / $scope.books[$scope.index].rates.length).toFixed(1)
        })
    },
    $scope.comment = function() {

        if(!flag_click_submitComent)
        {
            return;
        }
        flag_click_submitComent = false;
        0 != $scope.content.length && BooksService.commentBook($scope.books[$scope.index].isbn, $rootScope.logInUser.intrID, $scope.content).success(function(res) {
            flag_click_submitComent = true;
            $scope.books[$scope.index].comments = res,
            $scope.content = ""
        })
    },
    $scope.deleteComment = function(id) {
        BooksService.deleteComment($scope.books[$scope.index].isbn, id).success(function(res) {
            $scope.books[$scope.index].comments = res
        }).error(function(res) {
            console.error("deleteComment error", res)
        })
    }
}]);
var userApp = angular.module("userApp", ["ngMessages", "directApp", "serviceApp"]);
userApp.controller("LoginCtrl", ["$scope", "$rootScope", "$http", "$location", "$timeout", "$cookies",
function($scope, $rootScope, $http, $location, $timeout, $cookies) {
    $scope.user = {},
    $scope.submitted = !1;
    if($cookies.getObject("register_info"))
        {
            $scope.user.intrID = $cookies.getObject("register_info").intrID;
            $scope.user.pwd = $cookies.getObject("register_info").pwd;
        }
    $scope.initState = function() {
        $scope.pwdError = !1,
        $scope.userError = !1,
        $scope.serverError = !1,
        $scope.loginForm.submitted = !1
    },
    $scope.login = function() {
        $cookies.remove("register_info");
        if ($scope.initState(), $scope.loginForm.$valid) {
            $("#loginBtn").button("loading");
            var user = {
                intrID: $scope.user.intrID,
                pwd: $scope.user.pwd
            };
            console.log(user);
            $http.post("/intrIDLogin", user).success(function(res, status, headers, config) {
               	// console.log(res.errType);
                if (0 === res.errType) {
                    $("#loginBtn").button("reset"),
                    $location.path("/books/popular"),
                    $rootScope.logInUser.name = res.name,
                    $rootScope.logInUser.phoneNum = res.phoneNum,
                    $rootScope.logInUser.image = res.image,
                    $rootScope.logInUser.intrID = user.intrID;
                    var expireDate = new Date;
                    expireDate.setDate(expireDate.getDate() + 1),
                    $cookies.putObject("user", {
                        intrID: $scope.user.intrID,
                        name: res.name,
                        phoneNum: res.phoneNum,
                        image: res.image
                    },
                    {
                        expires: expireDate
                    });
                    console.log($cookies.getObject("user"));
                } else 1 === res.errType || 2 === res.errType ? ($("#loginBtn").button("reset"), $scope.pwdError = !0, $timeout($scope.initState, 3e3)) : ($("#loginBtn").button("reset"), $scope.serverError = !0, $timeout($scope.initState, 3e3))
            }).error(function(res) {
               // console.log(res);
                $("#loginBtn").button("reset"),
                $scope.serverError = !0,
                $timeout($scope.initState, 3e3)
            })
        } else $("#loginBtn").button("reset"),
        $scope.loginForm.submitted = !0,
        $timeout($scope.initState, 3e3)
    }
}]),
userApp.controller("RegCtrl",["$window","$scope", "$rootScope", "$http", "$location", "$timeout", "$window","$cookies"
,function($window,$scope, $rootScope, $http, $location, $timeout, $window,$cookies) {
    $scope.submitted = !1,
    $scope.user = {},
    $scope.initState = function() {
        $scope.emailError = !1,
        $scope.formatError = !1,
        $scope.serverError = !1,
        $scope.signupForm.submitted = !1
    },
    $scope.register = function() {
        // $scope.$emit('Changed', {intrID:$scope.user.intrID,pwd:$scope.user.pwd});
        if ($scope.signupForm.$valid) {
            var user = {};
            user = null == $scope.user.phoneNum ? {
                intrID: $scope.user.intrID,
                name: $scope.user.name,
                pwd: $scope.user.pwd
            }: {
                intrID: $scope.user.intrID,
                name: $scope.user.name,
                pwd: $scope.user.pwd,
                phoneNum: $scope.user.phoneNum
            };
            $http.post("/register", user).success(function(res) {
                // 0 === res.errType ? ($location.path("/books/popular"), $rootScope.logInUser.intrID = user.intrID, $rootScope.logInUser.name = user.name, console.log("check user name : " + user.name)) : 1 === res.errType ? ($scope.emailError = !0, console.log("user exist, return 1"), $timeout($scope.initState, 3e3)) : 2 === res.errType ? ($scope.formatError = !0, $timeout($scope.initState, 3e3), console.log("return 2")) : ($scope.serverError = !0, $timeout($scope.initState, 3e3), console.log("other error"));
                // 0 === res.errType ? ($location.path("/login"), $rootScope.logInUser.intrID = user.intrID, $rootScope.logInUser.name = user.name, console.log("check user name : " + user.name)) : 1 === res.errType ? ($scope.emailError = !0, console.log("user exist, return 1"), $timeout($scope.initState, 3e3)) : 2 === res.errType ? ($scope.formatError = !0, $timeout($scope.initState, 3e3), console.log("return 2")) : ($scope.serverError = !0, $timeout($scope.initState, 3e3), console.log("other error"));                
                // console.log("hahahahahahahah",res);
                if(res.errType == 0)
                {
                    $location.path("/login"); 
                    $rootScope.logInUser = {};
                    $cookies.remove("user");
                    $cookies.remove("connect.sid");
                    // $rootScope.user.intrID = res.RegUser.intrID;
                    // $rootScope.user.pwd = res.RegUser.pwd;
                    //console.log("check user name : " + user.name);
                    $cookies.putObject("register_info",{
                        intrID:$scope.user.intrID,
                        pwd: $scope.user.pwd
                    });
                }
            }).error(function(res) {
                $scope.serverError = !0,
                $timeout($scope.initState, 3e3)
            })
        } else $scope.signupForm.submitted = !0,
        $timeout($scope.initState, 3e3)
    }
}]),
userApp.controller("AdminLoginCtrl", ["$cookies","$scope", "$http", "$location", "$timeout",
function($cookies,$scope, $http, $location, $timeout) {
    if($cookies.getObject("status_admin") != undefined)
    {
        $location.path("/manage/books");
    }
    $scope.user = {},
    $scope.submitted = !1,
    $scope.initState = function() {
        $scope.adminemailError = !1,
        $scope.adminloginError = !1,
        $scope.serverError = !1
    },
    $scope.login = function() {
        if ($scope.initState(), $scope.loginForm.$valid) {
            $("#adminLoginBtn").button("loading");
            var user = {
                intrID: $scope.user.intrID,
                pwd: $scope.user.pwd
            };
            $http.post("/adminLogin", user).success(function(res) {
                0 === res.errType ? $location.path("/manage/books") : 1 === res.errType ? ($scope.adminemailError = !0, $timeout($scope.initState, 3e3)) : ($scope.adminloginError = !0, $timeout($scope.adminloginError, 3e3)),
                $("#adminLoginBtn").button("reset");
                console.log(res.intrID);
                if(res.errType == 0)
                {
                    var expireDate = new Date;
                    expireDate.setDate(expireDate.getDate() + 1),
                    $cookies.putObject("status_admin", {
                        intrID: res.intrID
                    },
                    {
                        expires: expireDate
                    });
                    var status_admin = $cookies.getObject("status_admin");
                    console.log("$cookies status_admin=", status_admin);
                }
            }).error(function(res) {
                $("#adminLoginBtn").button("reset"),
                $scope.serverError = !0,
                $timeout($scope.initState, 3e3),
                console.log("Error: " + res)
            })
        }
    }
}]),
userApp.controller("UserHomeCtrl", ["$scope", "$rootScope", "$timeout", "BooksService",
function($scope, $rootScope, $timeout, BooksService) {
    $scope.books = [],
    $scope.likedBooks = [],
    $scope.borrowedBooks = [],
    BooksService.getAllBooks().success(function(res) {
        BooksService.books = [];
        for (var i = 0; i < res.length; i++) {
            res[i].image = res[i].image ? res[i].image: "images/gray.jpg",
            res[i].isLiked = !1,
            res[i].intrID === $rootScope.logInUser.intrID && $scope.borrowedBooks.push(res[i]);
            for (var j = 0; j < res[i].likes.length; j++) if (res[i].likes[j] === $rootScope.logInUser.intrID) {
                res[i].isLiked = !0,
                $scope.likedBooks.push(res[i]);
                break
            }
            BooksService.books.push(res[i])
        }
    })
}]);
var directApp = angular.module("directApp", []),
validateEmail = /^\w{1,22}(@cn.ibm.com)$/,
validatePwd = /(?=^\S{6,}$)(?!(^[a-zA-Z\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))(?!(^[0-9\`\~\!\@\#\$\%\^\&\*\;\:\'\"\,\<\.\>\-\_\=\+\(\)\[\]\{\}\?\/\\\|]*$))/,
validatePhone = /^[0-9]{11}$/;
directApp.directive("customEmailFormat",
function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel,
            function() {
                var viewValue = scope.user.intrID;
                void 0 != viewValue ? validateEmail.test(viewValue) ? ctrl.$setValidity("format", !0) : ctrl.$setValidity("format", !1) : ctrl.$setValidity("format", !0)
            })
        }
    }
}),
directApp.directive("customPwdFormat",
function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel,
            function() {
                var viewValue = scope.user.pwd;
                validatePwd.test(viewValue) ? ctrl.$setValidity("format", !0) : ctrl.$setValidity("format", !1)
            })
        }
    }
}),
directApp.directive("customPhoneNumFormat",
function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ctrl) {
            scope.$watch(attrs.ngModel,
            function() {
                var viewValue = scope.user.phoneNum;
                void 0 != viewValue ? validatePhone.test(viewValue) ? ctrl.$setValidity("format", !0) : ctrl.$setValidity("format", !1) : ctrl.$setValidity("format", !0)
            })
        }
    }
});
var serviceApp = angular.module("serviceApp", []);
serviceApp.factory("adminBooksService", ["$http",
function($http) {
    var books = [];
    return {
        addBook: function(book, success, error) {
            $http.post("/admin/books", book).success(success).error(error)
        },
        deleteOneBook: function(unqId, success, error) {
            console.log(unqId);
            $http.get("/admin/book/" + unqId).success(success).error(error)
        },
        setBook: function(book, success, error) {
            $http.put("/admin/book/unqId", book).success(success).error(error)
        },
        getAllBooks: function(success, error) {
            $http.get("/admin/books").success(success).error(error)
        },
        books: books
    }
}]),
serviceApp.factory("BooksService", ["$http",
function($http) {
    var books = [];
    return {
        getAllBooks: function() {
            return $http.get("/books")
        },
        getSimilarBooks: function(isbn) {
            return $http.get("/book/" + isbn + "/similar")
        },
        //716
        borrrowBook: function(isbn, intrID) {
            return $http.put("/book/" + isbn + "/borrow", {
                intrID: intrID
            })
        },
        cancelBook: function(isbn, intrID) {
            return $http.put("/book/" + isbn + "/cancelBorrow", {
                intrID: intrID
            })
        },
        likeBook: function(isbn, intrID, ifYou) {
            return $http.put("/book/" + isbn + "/like", {
                intrID: intrID,
                ifYou: ifYou
            })
        },
        rateBook: function(isbn, intrID, value) {
            return $http.put("/book/" + isbn + "/rate", {
                intrID: intrID,
                value: value
            })
        },
        commentBook: function(isbn, intrID, content) {
            return $http.put("/book/" + isbn + "/comment", {
                intrID: intrID,
                content: content
            })
        },
        deleteComment: function(isbn, _id) {
            return $http["delete"]("/book/" + isbn + "/comment/" + _id)
        },
        books: books
    }
}]),
serviceApp.factory("EventsService", ["$http",
function($http) {
    var events = [];
    return {
    	//237
        getAllEvents: function() {
            return $http.get("/admin/events")
        },
        //581
        acceptEvent: function(unqId, intrId, name) {
            return $http.put("/admin/events/" + unqId, {
                intrId: intrId
            })
        },
        //599
        returnEvent: function(unqId) {
            return $http.post("/admin/events/" + unqId)
        },
        events: events
    }
}]),
serviceApp.factory("LogsService", ["$http",
function($http) {
    var logs = [];
    return {
        getAllLogs: function() {
            return $http.get("/admin/logs")
        },
        deleteLog: function(_id) {
            return $http["delete"]("/admin/log/" + _id)
        },
        logs: logs
    }
}]),
serviceApp.constant("category", {
    Frontend: "1",
    Backend: "2",
    Database: "3",
    "Big Data": "4",
    "IOS/Android": "5",
    "UI Design": "6",
    Other: "7"
}),
angular.module("templates-dist", ["../app/views/admin/admin-books.html", "../app/views/admin/admin-events.html", "../app/views/admin/admin-item.html", "../app/views/admin/admin-logs.html", "../app/views/admin/admin-main.html", "../app/views/admin/admin-new.html", "../app/views/admin/adminlogin.html", "../app/views/book/allbooks.html", "../app/views/book/detailbook.html", "../app/views/book/main.html", "../app/views/user/home.html", "../app/views/user/login.html", "../app/views/user/register.html"]),
angular.module("../app/views/admin/admin-books.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-books.html", '<div>\n  <script type="text/ng-template" id="headerCheckbox.html">\n    <input type="checkbox" ng-model="checkboxes.checked" class="select-all" value="" />\n  </script>\n  <div class="row">\n    <button ui-sref="manage.newBook" class="btn btn-success navbar-btn"><span class="glyphicon glyphicon-plus"></span> New</button>\n    <button class="btn btn-danger navbar-btn" ng-click="deleteBooks()"><span class="glyphicon glyphicon-trash"></span> Delete</button>\n    <button class="btn btn-primary navbar-btn" ng-click="modifyBook()"><span class="glyphicon glyphicon-pencil"></span> Modify</button>\n    <button class="btn btn-warning navbar-btn pull-right" data-toggle="modal" data-target="#myModal" ng-click="setTable()"><span class="glyphicon glyphicon-cog"></span> Setting</button>\n    <div class="alert alert-success bookAlert" role="alert" ng-show="currentState.book.message.type==1">Book&nbsp;(<strong>"{{currentState.book.message.book.unqId}}",&nbsp;"{{currentState.book.message.book.name}}"</strong>)&nbsp;has been added.</div>\n    <div class="alert alert-success bookAlert" role="alert" ng-show="currentState.book.message.type==2">Book&nbsp;(<strong>"{{currentState.book.message.book.unqId}}",&nbsp;"{{currentState.book.message.book.name}}"</strong>)&nbsp;has been deleted.</div>\n    <div class="alert alert-success bookAlert" role="alert" ng-show="currentState.book.message.type==3"><strong>{{currentState.book.message.book.count}}</strong>&nbsp;Book have been deleted.</div>\n    <div class="alert alert-success bookAlert" role="alert" ng-show="currentState.book.message.type==4">Book&nbsp;(<strong>"{{currentState.book.message.book.unqId}}",&nbsp;"{{currentState.book.message.book.name}}"</strong>)&nbsp;has been saved.</div>\n    <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==9">Book Delete:<strong>{{currentState.book.message.book.succCount}}</strong> Success, <strong>{{currentState.book.message.book.failCount}}</strong> Failed.</div>\n  </div>\n  <table ng-table="tableParams" class="table table-condensed table-hover" show-filter="setting.showAllFilters">\n    <tr ng-repeat="book in $data" ng-class="{success: book.status==2, danger: book.status== 1}">\n      <td class="text-center" header="\'headerCheckbox.html\'">\n        <input type="checkbox" ng-model="checkboxes.items[book.unqId]" />\n      </td>\n      <td class="text-center" title="\'#\'">\n        <a ng-href="#/manage/book/{{book.unqId}}"><span class="glyphicon glyphicon-pencil"></span></a>\n      </td>\n      <td class="text-center" title="\'ID\'" filter="{ unqId: \'text\'}" sortable="\'unqId\'">{{book.unqId}}\n      </td>\n      <td class="text-center" title="\'ISBN\'" filter="{ isbn: \'text\'}" sortable="\'isbn\'">\n        {{book.isbn}}\n      </td>\n      <td class="text-center" title="\'Name\'" filter="{ name: \'text\'}" sortable="\'name\'">\n        {{book.name}}\n      </td>\n      <td class="text-center" title="\'Author\'" filter="{ author: \'text\'}" sortable="\'author\'">\n        {{book.author}}\n      </td>\n      <td class="text-center" title="\'Publisher\'" ng-if="setting.showPublisher" filter="{ publisher: \'text\'}" sortable="\'publisher\'">\n        {{book.publisher}}\n      </td>\n      <td class="text-center" title="\'Category\'" filter="{ category: \'select\'}" sortable="\'category\'">\n        {{book.category}}\n      </td>\n      <td class="text-center" title="\'Borrower\'" filter="{ borrower: \'text\'}" sortable="\'borrower\'">\n        {{book.intrID}}\n      </td>\n      <td class="text-center" title="\'History\'"sortable="\'history\'">\n        <span ng-repeat="item in book.borrower">{{item.name}} </span>\n      </td>\n      <td class="text-center" title="\'BorrowTime\'" filter="{ borrowTime: \'text\'}" sortable="\'borrowTime\'">\n        {{book.borrowTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'ReturnTime\'" filter="{ returnTime: \'text\'}" sortable="\'returnTime\'">\n        {{book.returnTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'ApplyTime\'" filter="{ applyTime: \'text\'}" sortable="\'applyTime\'">\n        {{book.applyTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'PageCount\'" ng-if="setting.showPageCount" filter="{ pageCount: \'number\'}" sortable="\'pageCount\'">\n        {{book.pageCount}}\n      </td>\n      <td class="text-center" title="\'Price\'" ng-if="setting.showPrice" filter="{ price: \'number\'}" sortable="\'price\'">\n        {{book.price}}\n      </td>\n      <td class="text-center" title="\'Likes\'" ng-if="setting.showLikes" filter="{ likeNum: \'number\'}" sortable="\'likeNum\'">\n        {{book.likes.length}}\n      </td>\n      <td class="text-center" title="\'Comments\'" ng-if="setting.showComments" filter="{ commentNum: \'number\'}" sortable="\'commentNum\'">\n        {{book.commentNum}}\n      </td>\n      <td class="text-center" title="\'Evaluation\'" ng-if="setting.showEvaluations" filter="{ \'evaluation.number\': \'number\'}" sortable="\'evaluation.number\'">\n        {{book.evaluation.value}}{{book.evaluation.number}}\n      </td>\n      <td class="text-center" title="\'Status\'" filter="{ status: \'select\'}" filter-data="[{ id: \'\', title: \'All\'},{ id: \'0\', title: \'Free\'},{ id: \'1\', title: \'Reserved\'},{ id: \'2\', title: \'Borrowed\'}]" sortable="\'status\'">\n        {{book.status==0? \'Free\':(book.status==1?\'Reserved\':\'Borrowed\')}}\n      </td>\n    </tr>\n  </table>\n</div>\n<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="myModalLabel">Setting</h4>\n      </div>\n      <div class="modal-body">\n        <form class="form-horizontal">\n          <div class="form-group">\n            <label class="col-sm-2 control-label">Search</label>\n            <div class="col-md-8 input-group" id="selectdiv">\n              <span class="input-group-btn" id="selectspan">\n                    <select class="form-control" id="selectselect" ng-model="setting.search.type">\n                      <option value="0">ID</option>\n                      <option value="1">Name</option>\n                      <option value="2">Author</option>\n                      <option value="3">ISBN</option>\n                    </select>\n                  </span>\n              <input type="text" class="form-control" id="selectinput" ng-model="setting.search.value">\n              <span class="glyphicon glyphicon-search form-control-feedback"></span>\n            </div>\n          </div>\n          <div class="form-group">\n            <label class="col-sm-2 control-label">Status</label>\n            <div class="col-md-8">\n              <select class="form-control" ng-model="tableParams.filter().status" ng-options="status.id as status.title for status in statuses">\n              <option value="">All</option>\n              </select>\n            </div>\n          </div>\n          <div class="form-group">\n            <label class="col-sm-2 control-label">Filter</label>\n            <div class="col-md-8">\n              <div class="checkbox">\n                <label>\n                  <input type="checkbox" ng-model="setting.showAllFilters"> Show all filters\n                </label>\n              </div>\n              <div class="checkbox">\n                <label class="radio-inline">\n                  <input type="radio" ng-model="tableParams.settings().filterOptions.filterComparator" ng-change="tableParams.reload()" ng-value="true" /> Strict\n                </label>\n                <label class="radio-inline">\n                  <input type="radio" ng-model="tableParams.settings().filterOptions.filterComparator" ng-change="tableParams.reload()" ng-value="false" /> No strict\n                </label>\n              </div>\n            </div>\n          </div>\n          <div class="form-group">\n            <label class="col-sm-2 control-label">Column</label>\n            <div class="col-md-8">\n              <div>\n                <label class="checkbox-inline col-sm-3">\n                  <input type="checkbox" ng-model-options="{ getterSetter: true }" ng-model="setting.showPublisher">Publisher\n                </label>\n                <label class="checkbox-inline col-sm-3">\n                  <input type="checkbox" value="option1" ng-model="setting.showPageCount">PageCount\n                </label>\n                <label class="checkbox-inline">\n                  <input type="checkbox" ng-model="setting.showPrice">Price\n                </label>\n              </div>\n              <div>\n                <label class="checkbox-inline col-sm-3">\n                  <input type="checkbox" ng-model="setting.showLikes">Likes\n                </label>\n                <label class="checkbox-inline col-sm-3">\n                  <input type="checkbox" ng-model="setting.showComments">Comments\n                </label>\n                <label class="checkbox-inline">\n                  <input type="checkbox" ng-model="setting.showEvaluations">Evaluations\n                </label>\n              </div>\n            </div>\n          </div>\n        </form>\n        <div class="modal-footer">\n          <div class="center-block">\n            <button type="button" class="btn btn-danger" ng-click="restoreTable()">Restore</button>\n            <button type="button" class="btn btn-success" data-dismiss="modal">Save</button>\n            <button type="button" class="btn btn-default" data-dismiss="modal" ng-click="cancelTable()">Cancel</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="modal fade" id="deleteBooksModal" tabindex="-1" role="dialog" aria-labelledby="deleteBooksModalLabel">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="gridSystemModalLabel">Delete Books</h4>\n      </div>\n      <div class="modal-body">\n        <div class="container-fluid">\n          <h4>Are you sure to <strong>delete</strong> these books below?</h4>\n          <table class="table table-striped">\n            <colgroup span="1" width="5%" />\n            <colgroup span="1" width="10%" />\n            <thead>\n              <tr>\n                <th>#</th>\n                <th>ID</th>\n                <th>Name</th>\n                <th>ISBN</th>\n                <th ng-show="deleteBookList.isDeleting">Result</th>\n              </tr>\n            </thead>\n            <tr ng-repeat="book in deleteBookList.list">\n              <th>{{$index + 1}}</th>\n              <th>{{book.unqId}}</th>\n              <th>{{book.name}}</th>\n              <th>{{book.isbn}}</th>\n              <th ng-show="deleteBookList.isDeleting"><span ng-show="book.delSuc == 1" class="glyphicon glyphicon-ok"></span><span ng-show="book.delSuc ==2" class="glyphicon glyphicon-remove"></span></th>\n            </tr>\n          </table>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="startDelete()" id="deleteButton" data-loading-text="Deleting..." autocomplete="off">Delete</button>\n        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n      </div>\n    </div>\n  </div>\n</div>\n');
}]),
angular.module("../app/views/admin/admin-events.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-events.html", '<div class="row">\n  <div class="col-sm-12 col-md-12">\n  <table ng-table="eventTableParams" class="table table-condensed table-hover" show-filter="false">\n    <tr ng-repeat="event in $data track by $index" ng-class="{success: event.status==2}">\n      <td class="text-center" title="\'#\'">{{$index+1}}\n      </td>\n      <td class="text-center" title="\'ID\'" filter="{ unqId: \'text\'}" sortable="\'unqId\'">{{event.unqId}}\n      </td>\n      <td class="text-center" title="\'ISBN\'" filter="{ isbn: \'text\'}" sortable="\'isbn\'">\n        {{event.isbn}}\n      </td>\n      <td class="text-center" title="\'Name\'" filter="{ name: \'text\'}" sortable="\'name\'">\n        {{event.name}}\n      </td>\n      <td class="text-center" title="\'Borrower\'" filter="{ borrower: \'text\'}" sortable="\'borrower\'">\n        {{event.intrID}}\n      </td>\n      <td class="text-center" title="\'BorrowTime\'" filter="{ borrowTime: \'text\'}" sortable="\'applyTime\'">\n        {{event.borrowTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'ReturnTime\'" filter="{ returnTime: \'text\'}" sortable="\'returnTime\'">\n        {{event.returnTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'ApplyTime\'" filter="{ applyTime: \'text\'}" sortable="\'applyTime\'">\n        {{event.applyTime | date:\'yyyy-MM-dd\'}}\n      </td>\n      <td class="text-center" title="\'Status\'" filter="{ status: \'select\'}" filter-data="[{ id: \'\', title: \'All\'},{ id: \'0\', title: \'Free\'},{ id: \'1\', title: \'Reserved\'},{ id: \'2\', title: \'Borrowed\'}]" sortable="\'status\'">\n        {{event.status==0? \'Free\':(event.status==1?\'Reserved\':\'Borrowed\')}}\n      </td>\n      <td class="text-center" title="\'Manage\'">\n        <button type="button" class="btn btn-success" ng-click="accept(event)" ng-hide="event.status!=1">Deliver</button>\n        <button type="button" class="btn btn-danger" ng-click="return(event)"  ng-hide="event.status!=2">Return</button>\n      </td>\n    </tr>\n  </table>\n  </div>\n</div>\n\n<div class="modal fade" id="warningModal" tabindex="-1" role="dialog" aria-labelledby="warningModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Warning</h4>\n      </div>\n      <div class="modal-body">\n        <p>Failed to deliver the <strong>{{curEvent.name}}</strong>, please try again.</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n<div class="modal fade" id="returnModal" tabindex="-1" role="dialog" aria-labelledby="returnModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Warning</h4>\n      </div>\n      <div class="modal-body">\n        <p>Failed to return the <strong>{{curEvent.name}}</strong>, please try again.</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/admin/admin-item.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-item.html", '<div class="col-xs-6 col-md-3" style="width:200px; margin-right: 100px; margin-left: 50px">\n  <label>Image</label>\n  <a ng-href="{{book.image}}" target="_blank" style="width: 200px; height: 280px;">\n    <img class="" style="width: 200px; height: 280px; background-image: url({{book.image}}); background-size: 200px 280px; background-repeat:no-repeat; display: block; overflow:hidden">\n  </a>\n</div>\n<form class="form-horizontal col-md-8 pull-left " ng-submit="addBook()">\n  <div class="form-group">\n    <label for="inputEmail3" class="col-sm-2 control-label">ID<span class="red">*</span></label>\n    <div class="col-sm-5">\n      <input type="text" class="form-control" ng-model="book.unqId" ng-disabled="true" placeholder="ID" required>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">ISBN<span class="red">*</span></label>\n    <div class="col-sm-6">\n      <div class="input-group">\n        <input type="text" class="form-control" ng-disabled="true" ng-model="book.isbn" placeholder="ISBN" required>\n        <span class="input-group-btn">\n          <button class="btn btn-default" type="button" ng-click="getDouban()" ><span class="glyphicon glyphicon-refresh"></span></button>\n        </span>\n      </div>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Name<span class="red">*</span></label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.name" placeholder="Name" required>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Category<span class="red">*</span></label>\n    <div class="col-sm-6">\n      <select class="form-control" ng-model="book.category" required>\n        <option value="Frontend">Frontend</option>\n        <option value="Backend">Backend</option>\n        <option value="Database">Database</option>\n        <option value="Big Data">Big Data</option>\n        <option value="IOS/Android">IOS/Android</option>\n        <option value="UI Design">UI Design</option>\n        <option value="Other">Other</option>\n      </select>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Image URL</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.image" placeholder="Image URL">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Author</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.author" placeholder="Author">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Publisher</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.publisher" placeholder="Publisher">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">PageCount</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.pageCount" placeholder="PageCount">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Price</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.price" placeholder="Price" />\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Description</label>\n    <div class="col-sm-10">\n      <textarea type="text" class="form-control" rows="3" ng-model="book.desc" placeholder="Description"></textarea>\n    </div>\n  </div>\n  <div class="form-group">\n    <div class="col-sm-offset-2 col-sm-10">\n      <button type="submit" class="btn btn-success" id="saveButton" ng-click="saveBook()" data-loading-text="Saving..." autocomplete="off">Save</button>\n      <button type="button" class="btn btn-danger" data-toggle="modal" data-target="#deleteBookModal" autocomplete="off">Delete</button>\n      <a ng-href="#/manage/books" class="btn btn-default">Cancel</a>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==7"><strong>Failed to delete!</strong>This book doesn\'t exist</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==8"><strong>Failed to delete!</strong>Server Error, please try again.</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==11"><strong>Failed to save!</strong>This book doesn\'t exist.</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==12"><strong>Failed to save!</strong>Server Error, please try again.</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==15">This book doesn\'t exist in Douban.</div>\n    </div>\n  </div>\n</form>\n<div class="modal fade" id="deleteBookModal" tabindex="-1" role="dialog" aria-labelledby="deleteBookModalLabel">\n  <div class="modal-dialog" role="document">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title" id="gridSystemModalLabel">Delete Book</h4>\n      </div>\n      <div class="modal-body">\n        <div class="container-fluid">\n          <h4>Are you sure to <strong>delete</strong> this book?</h4>\n          <table class="table table-striped">\n            <colgroup span="1" width="5%" />\n            <colgroup span="1" width="10%" />\n            <thead>\n              <tr>\n                <th>#</th>\n                <th>ID</th>\n                <th>Name</th>\n                <th>ISBN</th>\n              </tr>\n            </thead>\n            <tr>\n              <th>{{$index + 1}}</th>\n              <th>{{book.unqId}}</th>\n              <th>{{book.name}}</th>\n              <th>{{book.isbn}}</th>\n            </tr>\n          </table>\n        </div>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" ng-click="deleteBook()" id="deleteButton" data-loading-text="Deleting..." autocomplete="off">Delete</button>\n        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/admin/admin-logs.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-logs.html", '<div>\n  <table ng-table="logTableParams" class="table table-condensed table-hover table-striped">\n    <tr ng-repeat="log in $data">\n      <td class="text-center" title="\'#\'">{{$index + 1}}\n      </td>\n      <td class="text-center" title="\'_id\'" sortable="\'_id\'">{{log._id}}\n      </td>\n      <td class="text-center" title="\'Date\'" sortable="\'Date\'">\n        {{log.time | date:\'yyyy-MM-dd HH:mm:ss\'}}\n      </td>\n      <td class="text-center" title="\'URL\'" sortable="\'URL\'">\n        {{log.url}}\n      </td>\n      <td class="text-center" title="\'Request\'" sortable="\'Request\'">\n        {{log.req}}\n      </td>\n      <td class="text-center logTd" title="\'Error\'" sortable="\'Error\'">\n        <p title="{{log.err}}"> {{log.err}}\n        </p>\n      </td>\n      <td class="text-center">\n        <button type="button" class="close" aria-label="Close" ng-click="deleteLog(log._id)"><span aria-hidden="true">&times;</span></button>\n      </td>\n    </tr>\n  </table>\n</div>\n')
}]),
angular.module("../app/views/admin/admin-main.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-main.html", '<div id="Header">\n  <a href="#/" id="logo"></a>\n  <ul class="list-inline pull-right" style="margin-top: 30px; margin-right: 100px">\n    <li>\n      <a href=\'\' ng-click="adminLogOut()">Log out</a>\n    </li>\n  </ul>\n</div>\n<div id="wrapper">\n  <div id="ColumnContainer">\n    <nav class="navbar navbar-default col-md-11">\n      <div class="container-fluid">\n        <div class="navbar-header">\n          <a class="navbar-brand" href="#/manage/books">Manage</a>\n        </div>\n        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">\n          <ul class="nav navbar-nav">\n            <li ng-class="{active: currentState.route==0}"><a ui-sref="manage.books" ng-click="currentState.route=0">Books <span class="label label-info badge" style="background-color: #286090">{{currentState.book.count.totalNum}}</span></a></li>\n            <li ng-class="{active: currentState.route==1}"><a ui-sref="manage.events" ng-click="currentState.route=1">Events <span class="label label-info badge" style="background-color: #5bc0de">{{currentState.events.count}}</span></a></li>\n            <li ng-class="{active: currentState.route==2}"><a ui-sref="manage.logs" ng-click="currentState.route=2">Logs <span class="label label-info badge" style="background-color: #d9534f">{{currentState.logs.count}}</span></a></li>\n          </ul>\n          <p ng-if="currentState.route==0" class="navbar-text"><strong>{{currentState.book.count.totalNum}}</strong>&nbsp; books:&nbsp;&nbsp;<strong>{{currentState.book.count.freeNum}}</strong>&nbsp;free&nbsp;&nbsp;&nbsp;<strong>{{currentState.book.count.resNum}}</strong>&nbsp;reserved&nbsp;&nbsp;&nbsp;<strong>{{currentState.book.count.borNum}}</strong>&nbsp;borrowed&nbsp;&nbsp;&nbsp;</p>\n        </div>\n      </div>\n    </nav>\n    <div ui-view class="col-md-11"></div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/admin/admin-new.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/admin-new.html", '<div class="col-xs-6 col-md-3" style="width:200px; margin-right: 100px; margin-left: 50px">\n  <label>Image</label>\n  <a ng-href="{{book.image}}" target="_blank" style="width: 200px; height: 280px;">\n    <img class="" style="width: 200px; height: 280px; background-image: url({{book.image}}); background-size: 200px 280px; background-repeat:no-repeat; display: block; overflow:hidden">\n  </a>\n</div>\n<form class="form-horizontal col-md-8 pull-left " ng-submit="addBook()">\n  <div class="form-group">\n    <label for="inputEmail3" class="col-sm-2 control-label">ID<span class="red">*</span></label>\n    <div class="col-sm-5">\n      <input type="text" class="form-control" ng-model="book.unqId" placeholder="ID" required>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">ISBN<span class="red">*</span></label>\n    <div class="col-sm-6">\n      <div class="input-group">\n        <input type="text" class="form-control" ng-model="book.isbn" placeholder="ISBN" required>\n        <span class="input-group-btn">\n            <button class="btn btn-default" type="button" ng-disabled="!book.isbn" ng-click="getDouban()" ><span class="glyphicon glyphicon-refresh"></span></button>\n        </span>\n      </div>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Name<span class="red">*</span></label>\n    <div class="col-sm-6">\n      <input type="text" class="form-control" ng-model="book.name" placeholder="Name" required>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Category<span class="red">*</span></label>\n    <div class="col-sm-6">\n      <select class="form-control" ng-model="book.category" ng-init="book.category=\'Frontend\'" required>\n        <option value="Frontend">Frontend</option>\n        <option value="Backend">Backend</option>\n        <option value="Database">Database</option>\n        <option value="Big Data">Big Data</option>\n        <option value="IOS/Android">IOS/Android</option>\n        <option value="UI Design">UI Design</option>\n        <option value="Other">Other</option>\n      </select>\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Image URL</label>\n    <div class="col-sm-10">\n      <input type="url" class="form-control" ng-model="book.image" ng-init="book.image=null" placeholder="Image URL">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Author</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.author" ng-init="book.author=null" placeholder="Author">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Publisher</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.publisher" ng-init="book.publisher=null" placeholder="Publisher">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">PageCount</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.pageCount" ng-init="book.pageCount=null" placeholder="PageCount">\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Price</label>\n    <div class="col-sm-10">\n      <input type="text" class="form-control" ng-model="book.price" ng-init="book.price=null" placeholder="Price" />\n    </div>\n  </div>\n  <div class="form-group">\n    <label class="col-sm-2 control-label">Description</label>\n    <div class="col-sm-10">\n      <textarea type="text" class="form-control" rows="3" ng-model="book.desc" ng-init="book.desc=null" placeholder="Description"></textarea>\n    </div>\n  </div>\n  <div class="form-group">\n    <div class="col-sm-offset-2 col-sm-10">\n      <button type="submit" class="btn btn-success" id="addButton" data-loading-text="Adding..." autocomplete="off">Add</button>\n      <a ng-href="#/manage/books" class="btn btn-default">Cancel</a>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==5"><strong>Failed to add!</strong>This book has existed.</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==6"><strong>Failed to add!</strong>Server Error, please try again.</div>\n      <div class="alert alert-danger bookAlert" role="alert" ng-show="currentState.book.message.type==15">This book doesn\'t exist in Douban.</div>\n    </div>\n  </div>\n</form>\n')
}]),
angular.module("../app/views/admin/adminlogin.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/admin/adminlogin.html", '<div id="LoginPage">\n  <div id="Header">\n    <a href="#/" id="logo"> </a>\n  </div>\n  <div id="Content">\n    <h1 class="pageTitle">Log in with your Admin ID</h1>\n    <div id="Login">\n      <div id="LoginForm">\n        <form name="loginForm" ng-submit="login()">\n          <ul>\n            <li>\n              <!-- Username -->\n              <div class="fieldContainer userField">\n                <input type="text" class="field" ng-model="user.intrID" placeholder="Admin ID" required>\n              </div>\n            </li>\n            <li>\n              <!-- Password -->\n              <div class="fieldContainer passField">\n                <input type="password" class="field" ng-model="user.pwd" placeholder="Password" required>\n              </div>\n            </li>\n          </ul>\n          <button type="submit" class="loginTrigger btn btn-info adminLoginTrigger" id="adminLoginBtn" ng-click="login()" data-loading-text="Logging...">Log in</button>\n        </form>\n      </div>\n      <div class="formError" ng-show="adminloginError">\n        <span>User name or passowrd goes wrong. Please try again.</span>\n      </div>\n       <div class="formError" ng-show="adminemailError">\n        <span>User name or passowrd goes wrong. Please try again.</span>\n      </div>\n      <div class="formError" ng-show="serverError">\n        <span>Server goes wrong. Please try again.</span>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/book/allbooks.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/book/allbooks.html", '<div id="Grid" infinite-scroll="showMoreBooks()">\n  <div masonry>\n    <div class="masonry-brick" ng-repeat="book in books | filter : cate==\'userLiked\'? {isLiked: true} : ( cate==\'userBorrowed\' ? {intrID: logInUser.intrID}: {category: cate})">\n      <div class="gridItem" ng-class="{aHover: hover, notFree: book.status != 0}" ng-mouseenter="hover = true" ng-mouseleave="hover = false">\n        <div class="bookShot">\n          <div>\n            <div class="hoverInfo">\n              <h4><strong>{{ book.name }}</strong></h4>\n              <h5>- {{book.author}}</h5>\n              <h5>- {{book.publisher}}</h5>\n              <h5>- {{book.category}}</h5>\n            </div>\n            <div class="freeInfo">\n            </div>\n            <div class="hoverLike">\n              <span>{{book.likes.length}}</span>\n              <a class="liked" ng-class="{isLiked: book.isLiked==true}" ng-click="like(book)"></a>\n            </div>\n            <a class="hoverLink" ng-href="#/book/{{book.isbn}}">\n              <img style="width:206px; min-width: 206px; min-height: 206px;" ng-src="{{ book.image }}" />\n            </a>\n          </div>\n          <div class="bookInfoFooter">\n            <ul class="bookInfoFooter">\n              <li class="comment"><span>{{ book.comments.length }}</span></li>\n              <li class="like"><span>{{ book.likes.length }}</span></li>\n            </ul>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/book/detailbook.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/book/detailbook.html", '<div id="content" class="group">\n  <h1 style="margin-top:0;height:33px">{{ books[index].name }}</h1>\n  <div class="group">\n    <div class="main-shot">\n      <div class="the-shot">\n        <div class="book-pic">\n          <a target="_blank" ng-href="{{books[index].image}}">\n            <img style="max-width: 210px; height: 290px; min-width: 210px; min-height: 290px;" src="{{books[index].image}}" alt="" />\n          </a>\n        </div>\n        <div class="book-info">\n          <div class="meta-act">\n            <span>Author: {{books[index].author}}</span>\n          </div>\n          <div class="meta-act">\n            <span>ISBN: {{books[index].isbn}}</span>\n          </div>\n          <div class="meta-act">\n            <span>Publisher: {{books[index].publisher}}</span>\n          </div>\n          <div class="meta-act">\n            <span>Page Count: {{books[index].pageCount}}</span>\n          </div>\n          <div class="meta-act">\n            <span>Category: {{books[index].category}}</span>\n          </div>\n        </div>\n      </div>\n      <div class="screenshot-meta">\n        <div class="social-media meta-act meta-act-full" id="BorrowBtn" ng-mouseenter="hover = true" ng-mouseleave="hover = false">\n          <a href="" class="meta-act-link free" ng-click="borrow()" ng-show="books[index].status==0"><span class="glyphicon glyphicon-plus" aria-hidden="true"></span> Borrow</a>\n          <!-- <p ng-show="books[index].status==1 && books[index].intrID == logInUser.intrID && logInUser.intrID" style="color:red;position:absolute;top:-45px">Contact Admin and take the book within two days.</p> -->\n          <a href="" class="meta-act-link cancel" ng-click="cancel()" ng-show="books[index].status==1 && books[index].intrID == logInUser.intrID && logInUser.intrID && !hover"><span class="glyphicon glyphicon-check" aria-hidden="true"></span> Reserved</a>\n          <a href="" class="meta-act-link cancel" data-toggle="modal" data-target="#cancelModal" ng-show="books[index].status==1 && books[index].intrID == logInUser.intrID && logInUser.intrID && hover"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span> Cancel</a>\n          <a href="" class="meta-act-link borrowed" ng-show="books[index].status==2 || (books[index].status==1 && books[index].intrID != logInUser.intrID)"><span class="glyphicon glyphicon-share" aria-hidden="true"></span> Borrowed</a>\n        </div>\n        <div class="meta-act">\n          <div class="group fav">\n            <a class="meta-act-link meta-like" href="" ng-class="{ILiked: books[index].isLiked}" ng-click="like()">{{books[index].likes.length}} Favorite</a>\n          </div>\n        </div>\n        <div class="meta-act">\n          <div class="group fav evaluate" ng-class="{noEvent: books[index].isRated}">\n            <a class="meta-evaluate" href="" ng-class="{moreRate: tarValue>=1 || books[index].rateValue>=1}" ng-mouseenter="tarValue = 1" ng-mouseleave="tarValue = 0" ng-click="rate(1)"><span></span></a>\n            <a class="meta-evaluate" href="" ng-class="{moreRate: tarValue>=2 || books[index].rateValue>=2}" ng-mouseenter="tarValue = 2" ng-mouseleave="tarValue = 0" ng-click="rate(2)"><span></span></a>\n            <a class="meta-evaluate" href="" ng-class="{moreRate: tarValue>=3 || books[index].rateValue>=3}" ng-mouseenter="tarValue = 3" ng-mouseleave="tarValue = 0" ng-click="rate(3)"><span></span></a>\n            <a class="meta-evaluate" href="" ng-class="{moreRate: tarValue>=4 || books[index].rateValue>=4}" ng-mouseenter="tarValue = 4" ng-mouseleave="tarValue = 0" ng-click="rate(4)"><span></span></a>\n            <a class="meta-evaluate" href="" ng-class="{moreRate: tarValue>=5 || books[index].rateValue>=5}" ng-mouseenter="tarValue = 5" ng-mouseleave="tarValue = 0" ng-click="rate(5)"><span></span></a>\n            <a class="meta-act-link" href="" ng-show="books[index].avaValue">(Average:{{books[index].avaValue}})</a>\n            <a class="meta-act-link" href="" ng-show="!books[index].avaValue">(No rates)</a>\n          </div>\n        </div>\n        <div id="contactDiv" class="meta-act">\n          <h3 class="meta-head">Contact Admin</h3>\n          <img src="../images/thumb_admin.jpg" alt="admin" class="img-inset">\n          <a class="meta-act-link" style="padding: 10px 0;">Charlene</a>\n          <a href="mailto:lzishuo@cn.ibm.com?subject=11Library" class="meta-act-link" style="padding: 0 0;"><span class="glyphicon glyphicon-envelope"></span> lzishuo@cn.ibm.com</a>\n          <a class="meta-act-link" style="padding: 10px 0;"><span class="glyphicon glyphicon-phone"></span> 17709812886</a>\n          <br />\n        </div>\n        <h3 class="meta-head" ng-show="showSimilarBooks">More Similar Books</h3>\n        <ol class="more-thumbs" ng-show="showSimilarBooks">\n          <li class="multi-thumb" ng-repeat="book in simBooks">\n            <a ng-href="#/book/{{book.isbn}}">\n              <img ng-src="{{book.image}}">\n            </a>\n          </li>\n        </ol>\n        <h3 class="meta-head">More Popular Books</h3>\n        <ol class="more-thumbs">\n          <li class="multi-thumb">\n            <a ng-href="#/book/{{popBooks[0].isbn}}">\n              <img ng-src="{{popBooks[0].image}}">\n            </a>\n          </li>\n          <li class="multi-thumb">\n            <a ng-href="#/book/{{popBooks[1].isbn}}">\n              <img ng-src="{{popBooks[1].image}}">\n            </a>\n          </li>\n          <li class="multi-thumb">\n            <a ng-href="#/book/{{popBooks[2].isbn}}">\n              <img ng-src="{{popBooks[2].image}}">\n            </a>\n          </li>\n          <li class="multi-thumb">\n            <a ng-href="#/book/{{popBooks[3].isbn}}">\n              <img ng-src="{{popBooks[3].image}}">\n            </a>\n          </li>\n        </ol>\n      </div>\n      <div class="shot-desc">\n        <p>{{books[index].desc}}</p>\n      </div>\n      <div id="comments-section">\n        <h2 class="count section ">{{books[index].comments.length}} Comments</h2>\n        <ol id="comments" class="comments">\n          <li class="response group " ng-repeat="comment in books[index].comments track by $index">\n            <div class="user_pic">\n              <img src="https://w3-connectionsapi.ibm.com/profiles/photo.do?email={{comment.intrID}}">\n            </div>\n            <div class="comments">\n              <button type="button" class="close" aria-label="Close" ng-show="comment.intrID == logInUser.intrID" ng-click="deleteComment(comment._id)"><span aria-hidden="true">&times;</span></button>\n              <span class="pull-right" style="margin-right:15px">{{$index + 1}}#</span>\n              <h2>{{comment.intrID}}</h2>\n              <div class="comment-body">\n                <p>{{comment.content}}</p>\n              </div>\n              <p class="comment-meta">\n                <a class="posted">{{comment.time | date:\'yyyy-MM-dd HH:mm:ss\'}}</a>\n              </p>\n            </div>\n          </li>\n        </ol>\n        <div class="form-group">\n          <legend class="color2" ng-hide="books[index].comments.length==0"></legend>\n          <textarea type="text" class="form-control" rows="5" style="border: 1px solid #dddddd; margin-bottom:5px;" ng-init="content=\'\'" ng-model="content"></textarea>\n          <span style="margin-top:5px;">Count: {{content.length}}</span>\n          <a class="btn btn-default pull-right" role="button" ng-click="comment()" ng-disabled="content.length==0">Submit</a>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="alert alert-success warningBox center-block" role="alert" ng-show="books[index].status==1 && books[index].intrID == logInUser.intrID && logInUser.intrID && showMsg" ng-init="showMsg = true">Please take the book from Adminstrator before <strong>{{expireDate | date:\'fullDate\'}}</strong><a href="" data-toggle="modal" data-target="#cancelModal">Cancel</a><button type="button" class="close" aria-label="Close" ng-click="showMsg = false"><span aria-hidden="true">&times;</span></button></div>\n<div class="alert alert-success warningBox center-block" role="alert" ng-show="books[index].status==2 && books[index].intrID == logInUser.intrID && logInUser.intrID && showMsg" ng-init="showMsg = true" style="width: 40%; left:30%">Please return the book before <strong>{{books[index].returnTime | date:\'fullDate\'}}</strong><button type="button" class="close" aria-label="Close" ng-click="showMsg = false"><span aria-hidden="true">&times;</span></button></div>\n\n<div class="modal fade" id="warningModal" tabindex="-1" role="dialog" aria-labelledby="warningModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Warning</h4>\n      </div>\n      <div class="modal-body">\n        <p>You have borrowed <strong>TWO</strong> books, please read them first.</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="modal fade" id="noneModal" tabindex="-1" role="dialog" aria-labelledby="noneModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Warning</h4>\n      </div>\n      <div class="modal-body">\n        <p>The book: <strong>{{books[index].name}}</strong> is out of stock.</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="modal fade" id="errorModal" tabindex="-1" role="dialog" aria-labelledby="errorModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Warning Dialog</h4>\n      </div>\n      <div class="modal-body">\n        <p>Server error! Please try again.</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-default" data-dismiss="modal">OK</button>\n      </div>\n    </div>\n  </div>\n</div>\n<div class="modal fade" id="cancelModal" tabindex="-1" role="dialog" aria-labelledby="cancelModalLabel">\n  <div class="modal-dialog">\n    <div class="modal-content">\n      <div class="modal-header">\n        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>\n        <h4 class="modal-title">Confirm Dialog</h4>\n      </div>\n      <div class="modal-body">\n        <p>Do you really want to cancel to borrow this book ?</p>\n      </div>\n      <div class="modal-footer">\n        <button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="cancel();showMsg = false">Yes</button>\n        <button type="button" class="btn btn-default" data-dismiss="modal">No</button>\n      </div>\n    </div>\n  </div>\n</div>\n');
}]),
angular.module("../app/views/book/main.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/book/main.html", '<!-- Header -->\n<header id="Header">\n  <a ui-sref="main.all" id="logo"></a>\n  <ul class="list-inline pull-right" style="margin-top: 30px; margin-right: 100px">\n    <li ng-show="!logInUser.name">\n      <a ui-sref="login">Login</a>\n    </li>\n    <li ng-show="logInUser.name">\n      <div class="dropdown">\n        <a class="dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style="cursor:pointer"><img class="img-rounded" src="{{logInUser.image}}" alt="" style="width:25px">\n          {{logInUser.name}}\n          <span class="caret"></span>\n        </a>\n        <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">\n          <li><a ui-sref="main.home">Home</a></li>\n          <li><a ng-class="{selected: cate==\'userLiked\'}" ng-click="cate=\'userLiked\'" ui-sref="main.liked">My Favorites</a></li>\n          <li><a ng-class="{selected: cate==\'userBorrowed\'}" ng-click="cate=\'userBorrowed\'" ui-sref="main.borrowed">My Orders</a></li>\n          <li role="separator" class="divider"></li>\n          <li><a ui-sref="main.all" ng-click="logOut()">Logout</a></li>\n        </ul>\n      </div>\n    </li>\n    <li>\n      <div>\n        <!-- <a style="cursor:pointer">Search<em></em></a> -->\n      </div>\n    </li>\n  </ul>\n</header>\n<!-- Page -->\n<section>\n  <div id="wrapper">\n    <div id="ColumnContainer">\n      <div id="SideColumn">\n        <h3>Discover</h3>\n        <ul class="nav menu" ng-init="cate==\'\'">\n          <li><a ng-class="{selected: cate==\'\'}" ui-sref="main.all">All</a></li>\n          <li><a ng-class="{selected: cate==\'Frontend\'}" ui-sref="main.frontend">Frontend</a></li>\n          <li><a ng-class="{selected: cate==\'Backend\'}" ui-sref="main.backend">Backend</a></li>\n          <li><a ng-class="{selected: cate==\'Database\'}" ui-sref="main.database">Database</a></li>\n          <li><a ng-class="{selected: cate==\'Big Data\'}" ui-sref="main.bigdata">Big Data</a></li>\n          <li><a ng-class="{selected: cate==\'IOS/Android\'}" ui-sref="main.ios">IOS/Android</a></li>\n          <li><a ng-class="{selected: cate==\'UI Design\'}" ui-sref="main.ui">UI Design</a></li>\n          <li><a ng-class="{selected: cate==\'Other\'}" ui-sref="main.other">Other</a></li>\n          <span class="line" ng-show="logInUser.name"></span>\n          <li ng-show="logInUser.name"><a ng-class="{selected: cate==\'userLiked\'}" ui-sref="main.liked">My Favorites</a></li>\n          <li ng-show="logInUser.name"><a ng-class="{selected: cate==\'userBorrowed\'}" ui-sref="main.borrowed">My Orders</a></li>\n        </ul>\n      </div>\n      <div ui-view></div>\n    </div>\n  </div>\n</section>\n')
}]),
angular.module("../app/views/user/home.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/user/home.html", '<div id="Profile">\n  <div id="userProfile">\n    <h3>Profile</h3>\n    <a href="{{logInUser.image}}" id="userProfileImage" target="_blank">\n      <img src="{{logInUser.image}}" class="img-rounded">\n    </a>\n    <div class="userInfo">\n      <h2 id="userName">{{logInUser.name}}</h2>\n      <h2 id="userEmail">{{logInUser.intrID}}</h2>\n      <h2 id="userEmail">{{logInUser.phoneNum}}</h2>\n      <ul class="profileLinks">\n        <li>\n          <a href="">\n            <span>{{borrowedBooks.length}}</span> Orders\n          </a>\n        </li>\n        <li>\n          <a href="">\n            <span>{{likedBooks.length}}</span> Favorites\n          </a>\n        </li>\n      </ul>\n    </div>\n  </div>\n  <div id="borrowedDiv">\n    <h3>My Orders</h3>\n    <div masonry>\n      <div class="masonry-brick" ng-repeat="book in borrowedBooks">\n        <a href="#/book/{{book.isbn}}">\n          <img ng-src="{{book.image}}" style="width: 130px" />\n        </a>\n      </div>\n    </div>\n  </div>\n  <div id="likedDiv">\n    <h3>My Favorites</h3>\n    <div masonry>\n      <div class="masonry-brick" ng-repeat="book in likedBooks">\n        <a href="#/book/{{book.isbn}}">\n          <img ng-src="{{book.image}}" style="width: 130px" />\n        </a>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/user/login.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/user/login.html", '<div id="LoginPage">\n  <div id="Header">\n    <a href="#/" id="logo"></a>\n  </div>\n  <div class="Content">\n    <h1 class="pageTitle">Login with your Intranet ID</h1>\n    <div id="Login">\n      <div id="LoginForm">\n        <form name="loginForm" novalidate>\n          <ul>\n            <li>\n              <!-- Username -->\n              <div class="fieldContainer userField">\n                <input type="text" class="field" name="email" tabindex="1" ng-model="user.intrID" placeholder="Intranet ID" required />\n              </div>\n            </li>\n            <li>\n              <!-- Password -->\n              <div class="fieldContainer passField">\n                <input type="password" class="field" name="password" tabindex="2" ng-model="user.pwd" placeholder="Password" required />\n              </div>\n            </li>\n          </ul>\n          <button type="submit" id="loginBtn" data-loading-text="Logging..." class="loginTrigger btn btn-info" ng-click="login()" >Login</button>\n        </form>\n      </div>\n      <div class="formError" ng-show="loginForm.submitted" ng-messages="loginForm.email.$error">\n        <span ng-message="required">Your email is required.</span>\n      </div>\n      <div class="formError" ng-show="loginForm.submitted" ng-messages="loginForm.password.$error">\n        <span ng-message="required">Your password is required.</span>\n      </div>\n      <div class="formError" ng-show="pwdError"> <!-- Password wrong actually -->\n        <span >User name or password is wrong.</span>\n      </div>\n      <div class="formError" ng-show="userError">\n        <span >This account doesn\'t exist.</span>\n      </div>\n      <div class="formError" ng-show="serverError">\n        <span >Server goes wrong. Please try again.</span>\n      </div>\n      <div id="LoginBelow">\n        <p class="signupText">\n        </p>\n      </div>\n    </div>\n  </div>\n</div>\n')
}]),
angular.module("../app/views/user/register.html", []).run(["$templateCache",
function($templateCache) {
    $templateCache.put("../app/views/user/register.html", '<div id="Header">\n  <a href="#/" id="logo"></a>\n</div>\n<div class="Content">\n  <h1 class="pageTitle medium setWidth">Enter your profile details to get started.</h1>\n  <div id="SignupContainer">\n    <form id="signupForm" name="signupForm" novalidate ng-submit="register()">\n      <ul>\n        <li>\n          <div class="fieldContainer">\n            <input type="email" class="field" name="email" tabindex="1" ng-model="user.intrID" placeholder="Email*" custom-email-format ng-maxlength=33 required />\n          </div>\n        </li>\n        <li>\n          <div class="fieldContainer">\n            <input type="text" class="field" name="username" tabindex="2" ng-model="user.name" placeholder="Username*" ng-maxlength=22 required/>\n          </div>\n        </li>\n        <li>\n          <div class="fieldContainer">\n            <input type="password" class="field" name="password" tabindex="3" ng-model="user.pwd" placeholder="Password*" ng-minlength=6 custom-pwd-format required />\n          </div>\n        </li>\n        <li>\n          <div class="fieldContainer">\n            <input type="password" class="field" name="confirm_password" tabindex="4" ng-model="user.rpwd" placeholder="Re-enter Password*" required/>\n          </div>\n        </li>\n        <li>\n          <div class="fieldContainer">\n            <input type="number" class="field" name="phoneNum" tabindex="5" ng-model="user.phoneNum" placeholder="PhoneNumber" custom-phone-num-format/>\n          </div>\n        </li>\n      </ul>\n      <div class="formError" ng-show="signupForm.email.$dirty && signupForm.email.$invalid" ng-messages="signupForm.email.$error">\n        <span ng-message="email">Your email is invalid.</span>\n        <span ng-message="format">Your email is not owned by IBM.</span>\n        <span ng-message="maxlength">Your email can\'t exceed 33 characters.</span>\n      </div>\n      <div class="formError" ng-messages="signupForm.username.$error">\n        <span ng-message="maxlength">Your name can\'t exceed 22 characters.</span>\n      </div>\n      <div class="formError" ng-show="signupForm.password.$dirty && signupForm.password.$invalid" ng-messages="signupForm.password.$error">\n        <span ng-message="minlength">Password can\'t less than 6 characters.</span>\n        <span ng-message="format">Wrong password format</span>\n      </div>\n      <div class="formError" ng-show="signupForm.phoneNum.$dirty && signupForm.phoneNum.$invalid" ng-messages="signupForm.phoneNum.$error">\n        <span ng-message="format">Please input 11 numbers.</span>\n      </div>\n\n\n      <div class="formError" ng-show="signupForm.submitted" ng-messages="signupForm.email.$error">\n        <span ng-message="required">Your email is required.</span>\n      </div>\n      <div class="formError" ng-show="signupForm.submitted" ng-messages="signupForm.username.$error">\n        <span ng-message="required">Your Username is required.</span>\n      </div>\n      <div class="formError" ng-show="signupForm.submitted" ng-messages="signupForm.password.$error">\n        <span ng-message="required">Your Password is required.</span>\n      </div>\n       <div class="formError" ng-show="signupForm.submitted" ng-messages="signupForm.phoneNum.$error">\n        <span ng-message="required">Your Password is required.</span>\n      </div>\n\n\n      <div class="formError" ng-show="signupForm.confirm_password.$dirty && user.pwd !== user.rpwd">\n        <span> Two passwords should be the same.</span>\n      </div>\n      <div class="formError" ng-show="emailError">\n        <span class="errorMessage">The email has existed.</span>\n      </div>\n      <div class="formError" ng-show="formatError">\n        <span class="errorMessage">The format is wrong.</span>\n      </div>\n      <div class="formError" ng-show="serverError">\n        <span class="errorMessage">Server goes wrong. Please try again.</span>\n      </div>\n      <div id="LoginBelow">\n        <p class="subPageText">Have an account? <a href="#/login">Log in now</a></p>\n      </div>\n      <button type="submit" class="registerBtn btn btn-info">Create and Log in</button>\n    </form>\n  </div>\n</div>\n')
}]);