// show images upload demo
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#blah').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
$("#flFileUpload").change(function(){
    readURL(this);
});
// check images demo
var _validFileExtensions = [".jpg", ".jpeg",".gif", ".png", ".svg"];
function Validate(oForm) {
    var arrInputs = oForm.getElementsByTagName("input");
    if(arrInputs === ''){
      alert('File upload: *jpg *jpeg *gif *png *svg');
      return false;
    }
    for (var i = 0; i < arrInputs.length; i++) {
        var oInput = arrInputs[i];
        if (oInput.type == "file") {
            var sFileName = oInput.value;
            if (sFileName.length > 0) {
                var blnValid = false;
                for (var j = 0; j < _validFileExtensions.length; j++) {
                    var sCurExtension = _validFileExtensions[j];
                    if (sFileName.substr(sFileName.length - sCurExtension.length, sCurExtension.length).toLowerCase() == sCurExtension.toLowerCase()) {
                        blnValid = true;
                        break;
                    }
                }

                if (!blnValid) {
                    alert('File upload: *jpg *jpeg *gif *png *svg');
                    return false;
                }
            }
        }
    }
    return true;
}

//get token file
var app = angular.module('angularBack', ['ngRoute','ngSanitize']);

app.controller('upload_token',function($scope,$rootScope,$http){
    $scope.upload_token = []; //declare an empty array
    $http.get("/administrator/upload_token").then(function(res,status,xhr) {
        $scope.upload_token = res.data;
    });
});

//add data folder upload to form
$(document).on('click', '#js-folder-switcher li', function () {
  var html_folder = $(this).html();
  document.getElementById("txtFolderUpload").value = html_folder;
  if(html_folder !== '/'){
    $('.control_template').show();
    document.getElementById('txtControlFolder').value = html_folder;
    document.getElementById('txtControlFolderHidden').value = html_folder;
  }else{
    $('.control_template').hide();
  }
});


//add random folder to form
document.getElementById("txtCreatFolder").value = 'folder_'+Math.floor(Math.random()*90000) + 10000;

//creat folder
$('#btnCreatFolder').click(function(){
    var folder_i = $('#txtCreatFolder').val();
    var folder = folder_i.replace(/\s+/g, '').toLowerCase().replace(/đ/g, "d").replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y").replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u").replace(/ì|í|ị|ỉ|ĩ/g, "i").replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o").replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a").replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    $.ajax({
      url: '/administrator/creat_folder',
      type: 'POST',
      dataType: 'text',
      data: {
          folder: folder,
          _csrf: $('#_csrf').val()
      },
      success: function(result){
        location.reload();
      }
    });
});

//edit folder
$('#btnEdit').click(function(){
  var folder = $('#txtControlFolderHidden').val();
  var folder_edit = $('#txtControlFolder').val();
  $.ajax({
    url: '/administrator/edit_folder',
    type: 'POST',
    dataType: 'text',
    data: {
        folder: folder,
        folder_edit: folder_edit,
        _csrf: $('#_csrf').val()
    },
    success: function(result){
      location.reload();
    }
  });
});

//delete folder
$('#btnDel').click(function(){
    var folder_del = $('#txtControlFolderHidden').val();
    $.ajax({
      url: '/administrator/delete_folder',
      type: 'POST',
      dataType: 'text',
      data: {
          folder_del: folder_del,
          _csrf: $('#_csrf').val()
      },
      success: function(result){
        location.reload();
      }
    });
});

//delete file
$(document).on('click', '.show_image_list span', function () {
  var url_del = $(this).attr('data-image')
  if(url_del.split('/').pop() !== 'no-image.png'){
      $.ajax({
        url: '/administrator/delete_file',
        type: 'POST',
        dataType: 'text',
        data: {
            url_del: url_del,
            _csrf: $('#_csrf').val()
        },
        success: function(result){
          location.reload();
        }
      });
  }else{
      alert('Cannot delete "no-image.png" ')
  }
});
