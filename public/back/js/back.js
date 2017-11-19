
var app = angular.module('angularBack', ['ngRoute','ngSanitize','angularUtils.directives.dirPagination', 'checklist-model', 'ng-file-model']);


app.controller('ad_template',function ($scope, $rootScope, $http){
    $rootScope.lang_active = $('#ad_lang').attr('lang');
    $http.get('/language/'+$rootScope.lang_active+'/back.json').then(function(res,status,xhr) {
       $rootScope.lang_ad = res.data;
    });
});

app.controller('backLang',function ($scope,$http){
  $http.get('/api/v1.0/language').then(function(res,status, xhr) {
     $scope.lang_list = res.data;
  });
});


//login history
app.controller('loginHistorys',function($scope, $http){
    $scope.loginHistorys = []; //declare an empty array
    $http.get("/administrator/api/loginHistorys").then(function(res,status,xhr) {
        $scope.loginHistorys = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});

//menu
app.controller('menu',function($scope,$rootScope,$http){
    $scope.newsCategorys = []; //declare an empty array
    $http.get("/api/v1.0/menu").then(function(res,status,xhr) {
        $scope.menu = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $rootScope.catParent = $('#catParent').attr('catParent');
});


//news category
app.controller('newsCategorys',function($scope,$rootScope,$http){
    $scope.newsCategorys = []; //declare an empty array
    $http.get("/api/v1.0/newsCat").then(function(res,status,xhr) {
        $scope.newsCategorys = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $rootScope.catParent = $('#catParent').attr('catParent');
});
//news
app.controller('news',function($scope,$rootScope,$http){
    $scope.news = []; //declare an empty array
    $http.get("/api/v1.0/news").then(function(res,status,xhr) {
        $scope.news = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});

//banner------------------------------------------------------------------------
app.controller('banner',function($scope,$rootScope,$http){
    $scope.news = []; //declare an empty array
    $http.get("/api/v1.0/banner").then(function(res,status,xhr) {
        $scope.banner = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});
//banner------------------------------------------------------------------------


//ev news-----------------------------------------------------------------------
app.controller('evNews',function($scope,$rootScope,$http){
    $scope.evNews = []; //declare an empty array
    $http.get("/api/v1.0/evNews").then(function(res,status,xhr) {
        $scope.evNews = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});

app.controller('evNewsGroup',function($scope,$rootScope,$http){
    var _csrf = document.querySelector('[name="_csrf"]').value;
    $scope.evNewsGroup = []; //declare an empty array
    $scope.event = [];
    $http.get("/api/v1.0/evNews/group").then(function(res,status,xhr) {
        $scope.evNewsGroup = res.data;
    });
    
    $scope.randomCode = Math.floor(Math.random() * 9999999999);
    $rootScope.catParent = $('#catParent').attr('catParent');
    $rootScope.evNews_id = $('#evNews_id').val();

    $http.get("/api/v1.0/evNews/edit/cat/"+$rootScope.evNews_id).then(function(res,status,xhr) {
      $scope.ev_id = [];
      angular.forEach(res.data, function(value, key) {
        $scope.ev_id.push(value.event_id);
      });
      $scope.user = {
        event: $scope.ev_id
      }
    });

    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }

    $http.get("/api/v1.0/evNews/edit/images/"+$rootScope.evNews_id).then(function(res,status,xhr) {
      $scope.event_images = res.data;
    });

    //delete images
    $scope.deleteEvnewsImage = function(id){
      var _csrf = document.querySelector('[name="_csrf"]').value;
      var req = {
        method: 'POST',
        url: '/administrator/evNews/dell/images',
        data: { id: id, _csrf:_csrf }
      }
      $http(req).then(function(){
          $window.location.reload();
      }, function(){
          $window.location.reload();
      });
      location.reload();
    }
    //add images
    $scope.addEvnewsImage = function(){
        var _csrf = document.querySelector('[name="_csrf"]').value;
        var txtTitle = $scope.txtTitle;
        var txtNumber = $scope.txtNumber;
        var id = $('#evNews_id').val();
        var fileUp = document.getElementById('txtFileImgAdd').files[0];

        if(fileUp === undefined){
          alert($rootScope.lang_ad._error_file_upload);
          location.reload();
        }

        var fd = new FormData();
        fd.append('id', id);
        fd.append('_csrf', _csrf);
        fd.append('fileUp', fileUp);
        fd.append('txtTitle', txtTitle);
        fd.append('txtNumber', txtNumber);

        var req = {
          method: 'POST',
          url: '/administrator/evNews/add/images',
          data: fd,
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        }
        $http(req).then(function(){
            $window.location.reload();
        }, function(){
            $window.location.reload();
        });
        location.reload();
    }

    //update images
    $scope.editEvnewsImage = function(val3){
        var _csrf = document.querySelector('[name="_csrf"]').value;
        var id = val3.id;
        var ev_imgaes_description = val3.ev_imgaes_description;
        var ev_imgaes_sort = val3.ev_imgaes_sort;
        var fd = new FormData();
        fd.append('id', id);
        fd.append('ev_imgaes_description', ev_imgaes_description);
        fd.append('ev_imgaes_sort', ev_imgaes_sort);
        fd.append('_csrf', _csrf);

        var req = {
          method: 'POST',
          url: '/administrator/evNews/edit/images',
          data: fd,
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined},
        }
        $http(req).then(function(){
            $window.location.reload();
        }, function(){
            $window.location.reload();
        });
        location.reload();
    }
});


//ev news-----------------------------------------------------------------------






//products category-------------------------------------------------------------
app.controller('productsCategorys',function($scope,$rootScope,$http){
    $scope.productsCategorys = []; //declare an empty array
    $http.get("/api/v1.0/productsCat").then(function(res,status,xhr) {
        $scope.productsCategorys = res.data;
    });
    $rootScope.catParent = $('#catParent').attr('catParent');
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
    $scope.randomCode = Math.floor(Math.random() * 9999999999);
});

//products----------------------------------------------------------------------
app.controller('products',function($scope,$rootScope,$http){
    $scope.products = []; //declare an empty array
    $http.get("/api/v1.0/products").then(function(res,status,xhr) {
        $scope.products = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
});
//products----------------------------------------------------------------------



//change language
$("#back_lang").change(function(){
    var _csrf = document.querySelector('[name="_csrf"]').value;
    $.ajax({
        type: 'POST',
        url: "/administrator/postLang",
        data: {
          language_code: $('#back_lang option:selected').val(),
          _csrf: _csrf
        }
    }).done(function() {
      window.location.assign("/administrator/home")
    });
});

//close flash message
setTimeout(function(){
  $('.background-finish').fadeOut()
  $('.background-error').fadeOut()
}, 3000);


//form post
function postFrom(){
    var form = document.getElementById("adForm");
    form.submit();
}


//check all checkbox
function checked_all(obj){
   var checked = obj.checked;
   var list_checkbox = document.getElementsByName('ckb[]');
   for (var i = 0; i < list_checkbox.length; i++){
       if (checked){
           list_checkbox[i].setAttribute('checked', 'true');
       }else{
           list_checkbox[i].removeAttribute('checked');
       }
   }
}

//show image first upload
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#showImageUpload').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

$("#flImage").change(function(){
    readURL(this);
});

//alias
function ChangeToSlug(){
    var title, slug;

    //Lấy text từ thẻ input title
    title = document.getElementById("txtName").value;

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();

    //Đổi ký tự có dấu thành không dấu
    slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
    slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
    slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
    slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
    slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
    slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
    slug = slug.replace(/đ/gi, 'd');
    //Xóa các ký tự đặt biệt
    slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
    //Đổi khoảng trắng thành ký tự gạch ngang
    slug = slug.replace(/ /gi, "-");
    //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
    //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
    slug = slug.replace(/\-\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-\-/gi, '-');
    slug = slug.replace(/\-\-\-/gi, '-');
    slug = slug.replace(/\-\-/gi, '-');
    //Xóa các ký tự gạch ngang ở đầu và cuối
    slug = '@' + slug + '@';
    slug = slug.replace(/\@\-|\-\@|\@/gi, '');
    //In slug ra textbox có id “slug”
    document.getElementById('txtAlias').value = slug;
}
