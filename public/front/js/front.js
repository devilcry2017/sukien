//onload------------------------------------------------------------------------
$(window).on("load", function () {
    "use strict";
    $(".loader").fadeOut(2000);
});
//onload------------------------------------------------------------------------


var app = angular.module('angularFront', ['ngRoute','ngSanitize','angularUtils.directives.dirPagination', 'checklist-model', 'ng-file-model']);


app.controller('front_template',function ($scope, $rootScope, $http){
    $rootScope.lang_active = $('#lang').attr('lang');
    $http.get('/language/'+$rootScope.lang_active+'/front.json').then(function(res,status,xhr) {
       $rootScope.lang_trans = res.data;
    });
    $rootScope.token = document.querySelector('[name="_csrf"]').value;
    $http.get('/api/v1.0/system').then(function(res,status, xhr) {
       $rootScope.system = res.data;
    });
    $rootScope.url_host = 'http://localhost:3333/';
});


app.controller('frontLang',function ($scope,$http){
  $http.get('/api/v1.0/language').then(function(res,status, xhr) {
     $scope.lang_list = res.data;
  });
});

app.controller('frontHeader',function ($scope,$http){
  $http.get('/api/v1.0/menu_header').then(function(res,status, xhr) {
    $scope.menu = res.data;
  });
  $scope.getClass = function (path) {
    return ($location.path().substr(0, path.length) === path) ? 'active' : '';
  }

  $http.get("/api/v1.0/banner_top").then(function(res,status,xhr) {
      $scope.banner_top = res.data;
  });

});

//banner right
app.controller('frontBannerRight',function ($scope,$http){
  $http.get("/api/v1.0/banner_right").then(function(res,status,xhr) {
      $scope.banner_right = res.data;
  });
});

//footer
app.controller('frontFooter',function($scope,$http){
  $http.get('/api/v1.0/menu_footer').then(function(res,status, xhr) {
    $scope.menu_footer = res.data;
  });
});
//tag
app.controller('frontTag',function($scope,$http){
  $http.get('/api/v1.0/menu_footer').then(function(res,status, xhr) {
    $scope.menu_footer = res.data;
  });
});

//contact
app.controller('frontContact',function($scope,$http){
    $http.get('/api/v1.0/system').then(function(res,status, xhr) {
       $scope.contact = res.data;
    });
});

//ev new hightlights
app.controller('frontEvnewsHightlight8',function($scope,$http){
    $http.get('/api/v1.0/evNewsHightlightLimit/8').then(function(res,status, xhr) {
       $scope.frontEvnewsHightlight8 = res.data;
    });
});
//ev news groups
app.controller('frontEvNewsGroup',function($scope,$http){
    $http.get('/api/v1.0/frontEvNewsGroupWhereAlias').then(function(res,status, xhr) {
       $scope.frontNewsViewRight5 = res.data;
    });
});

//ev news views
app.controller('frontNewsViewRight5',function($scope,$http){
    $http.get('/api/v1.0/evNewsViewtLimit/5').then(function(res,status, xhr) {
       $scope.frontNewsViewRight5 = res.data;
    });
});
//ev news lastest
app.controller('frontLastestNews10',function($scope,$http){
    $http.get('/api/v1.0/evLastestNewsLimit/10').then(function(res,status, xhr) {
       $scope.frontLastestNews10 = res.data;
    });
});

//news lastest 2
app.controller('newsLastestLimit2',function($scope,$http){
    $http.get('/api/v1.0/newsLastestLimit/2').then(function(res,status, xhr) {
       $scope.newsLastestLimit2 = res.data;
    });
});

//all news
app.controller('frontNews',function($scope,$http){
    $http.get('/api/v1.0/news').then(function(res,status, xhr) {
       $scope.listNews = res.data;
    });
});





//change language
$("#front_lang").change(function(){
    var _csrf = document.querySelector('[name="_csrf"]').value;
    $.ajax({
        type: 'POST',
        url: "/lang",
        data: {
          language_code: $('#front_lang option:selected').val(),
          _csrf: _csrf
        }
    }).done(function() {
      window.location.assign("/home")
    });
});


$('.icon_menu_mobile').click(function(){
    alert('Đang cập nhật...');
});
