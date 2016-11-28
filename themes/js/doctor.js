var ajaxError = function (object) {
    alert("Error!!!\n\nAn error has occured processing your request. \n\nPlease try again or Contact Us.");
    hideLoader();
   // $('#output').text(JSON.stringify(object, null, 4));
};

var app = angular.module("clientApp", ["AxelSoft","ngSanitize"]).filter('htmlToPlaintext', function() {
    return function(text) {
        if(text===null || text==='null' || text==='')
            return '';

        return String(text).replace(/<[^>]+>/gm, '');
    }
}).filter('httpWebsite', function() {
    return function(text) {
        return 'http://'+String(text).replace('http://', '');
    }
}).filter('Distance', function() {
    return function(lat1,lon1) {

        var d='';
        if($('#HFLatitude').val()!=='0' && typeof lat1!=='undefined' && lat1!==null) {
            var lat2 = $('#HFLatitude').val();
            var lon2 = $('#HFLongitude').val();
            var R = 6371; // km (change this constant to get miles)
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            d = R * c;
            d = 'Aprox '+ d.toFixed(2)+' km';
        }
        return d;
    }
});
app.controller('clientCtrl',['$scope','$http','$filter', function (scope,http,filter){
    var rootUrl = $('#RootUrl').val();
    scope.SiteUrl=$('#SiteUrl').val();
    scope.UploadsRoot = $('#SiteUrl').val()+'Content/uploads/images';

    scope.initApp=function(){
        var url = $('#RootUrl').val() + 'Client/Init/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {

            scope.featuredProducts = data['featuredProducts'];
            scope.user = data['user'];
            scope.hospitals = data['hospitals'];
            scope.specialities = data['specialities'];
            scope.counties = data['counties'];
            scope.locations = data['locations'];
            scope.examCategories = data['examCategories'];
            scope.examPreparations = data['examPreparations'];
            scope.titles = data['userTitles'];
             $('#customPreloader,#customPreloaderBg').remove();
            hideLoader();


        });
    };
	scope.initCarousel = function(){
	setTimeout(function(){
   $(".owl-carousel").owlCarousel({items:3,margin:5,nav:false,dots:false,autoplay:true,autoplayTimeout:5000,loop:true});
    $('.featured-products h2').fadeIn();
    },1000);
};

    scope.getPatientQueries=function(){
        var url = $('#RootUrl').val() + 'Doctor/Queries/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
//           scope.countries = data;
            console.log(data);
            scope.queries = data;
            $.mobile.changePage( '#patient-queries', {type: "get", transition: "slide"});
            hideLoader();
        });
    };
    scope.register=function(){
        var url =rootUrl+'Doctor/Register/';
        showLoader();
        http.get(url).success(function(data) {
            scope.specialities = data;
            $.mobile.changePage( '#register', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getChatList=function(id){		
        var url = rootUrl+'Doctor/Queries/'+id+'/Details/';
        $('#chat-'+id).removeClass('read-status-0');
        showLoader();
        http.get(url).success(function(data) {
            $('.sendsignalr,#btn-close-consultation').attr('rel',data.Id);
            scope.chatList = data.ChatMessages;
            console.log( scope.chatList);
            $.mobile.changePage( '#chatList', {type: "get", transition: "slide"});
            hideLoader();

            if(data.StatusId ===5){

                $('#chatStatus').show();
                $('#chatStatus').html('<p>Consultation closed.</p>');
                $('#chatStatus').show();
                $('.btnPayConsultationNow,.send-btn,#chatmessage,#btn-close-consultation').hide();
            }else{
                $('#chatStatus').hide();
            }

        }).error(ajaxError);
    };// End Function
    scope.getClinic=function(){
        var url = rootUrl+'Doctor/Clinics/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.clinics = data;
            $.mobile.changePage( '#my-clinics', {type: "get", transition: "slide"});
            hideLoader();
        });
    };
    scope.getHospitalSearchResults=function(){
        var url = rootUrl+'Hospitals/'+$('#searchTerm').val()+'/'+$('#SearchCountyId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.hospitals = data;
            $.mobile.changePage( '#hospitals-list', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function

    scope.getHospitalDetails=function(id){
        var url = rootUrl+'Hospitals/Details/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.hospital = data.hospital;
            scope.hospitalBranches = data.branches;
            $.mobile.changePage( '#hospitals-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function

    scope.askQuiz=function(){
        var url =rootUrl+'PatientQueries/Init/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.user = data['user'];
            scope.hospitals = data['hospitals'];
            scope.specialities = data['specialities'];
            $.mobile.changePage( '#ask-quiz', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getBranches=function(){
        var url =rootUrl+'Hospitals/Branches/'+scope.selectedHospital;
        showLoader();
        http.get(url).success(function(data) {
            scope.branches = data;
            hideLoader();
        });


    }; // End Function
    scope.getDoctors=function(){
        var url =rootUrl+'Client/Doctors/'+scope.selectedBranch+'/'+scope.selectedSpeciality;
        showLoader();
        http.get(url).success(function(data) {
            scope.doctors = data;
            hideLoader();
        });
    }; // End Function
    scope.getMyAppointments=function(){
        var url =rootUrl+'Appointments/Doctor/List/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.appointments = data;
            $.mobile.changePage( '#my-appointments', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getAppointmentDetails=function(id){
        var url = rootUrl+'Appointments/'+id;
        $('#app-'+id).removeClass('read-status-0');
        console.log(url);
        showLoader();
        http.get(url).success(function(data) {
            scope.appointment = data;
            $('.insurance-cont').removeClass('ng-hide');
            $.mobile.changePage( '#appointmentDetails', {type: "get", transition: "slide"});
            $('input:radio[name="GenderId"]').filter('[value="'+data.GenderId+'"]').parent().find("label[for].ui-btn").click();
            hideLoader();
        });
    };
    scope.getFirstAidList=function(){
        var url =rootUrl+'FirstAid';
        showLoader();
        http.get(url).success(function(data) {
            scope.firstAidList = data;
            $.mobile.changePage( '#first-aid', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getFirstAid=function(id){
        var url =rootUrl+'FirstAid/'+id;
        showLoader();
        http.get(url).success(function(data) {
            scope.firstAidItem = data;
            $.mobile.changePage( '#first-aid-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function


    scope.getProfile=function(id){
        var url =rootUrl+'Doctor/Profile/'+$('#UserId').val();
        showLoader();
        http.get(url).success(function(data) {
            scope.user = data.user;
            scope.specialities = data.specialities;
            $.mobile.changePage( '#profile', {type: "get", transition: "slide"});

            $('input:radio[name="GenderId"]').filter('[value="'+data.user.GenderId+'"]').parent().find("label[for].ui-btn").click();
            hideLoader();
        });
    }; // End Function
    scope.getProductDetails=function(id){
        var url = rootUrl+'Products/'+id+'/';
        showLoader();
        http.get(url).success(function(data) {
            scope.product = data;
            $.mobile.changePage( '#product-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function
 scope.searchHospitals = function () {
        $.mobile.changePage('#hospitals-search', {type: "get", transition: "slide"});
        /*var url = rootUrl+'Mobile/Counties';
         showLoader();
         http.get(url).success(function(data) {
         scope.counties = data['Counties'];
         scope.locations = data['Locations'];
         $.mobile.changePage( '#hospitals-search', {type: "get", transition: "slide"});
         hideLoader();
         });*/
    };
    scope.getHospitalSearchResults = function () {
        var city = scope.dirCity;
        if (typeof city === 'undefined' || city === '') {
            city = 0;
        }
        var location = scope.dirLocation;
        if (typeof location === 'undefined' || location === '') {
            location = 0;
        }
        var specialist = scope.dirSpecialist;
        if (typeof specialist === 'undefined' || specialist === '') {
            specialist = 0;
        }


        var search = 'any';
        if ($('#searchTerm').val() !== '') {
            search = $('#searchTerm').val();
        }


        var url = rootUrl + 'Hospitals/' + search + '/' + city + '/' + location + '/' + specialist + '/';
        showLoader();
        http.get(url).success(function (data) {
            scope.hospitals = data;
            $.mobile.changePage('#hospitals-list', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function
    scope.getDoctorsSearchResults = function () {
        var city = scope.dirCity;
        if (typeof city === 'undefined' || city === '') {
            city = 0;
        }
        var location = scope.dirLocation;
        if (typeof location === 'undefined' || location === '') {
            location = 0;
        }
        var specialist = scope.docSpecialistId;
        if (typeof specialist === 'undefined' || specialist === '') {
            specialist = 0;
        }


        var search = 'any';
        if ($('#SpecialistSearchTerm').val() !== '') {
            search = $('#SpecialistSearchTerm').val();
        }


        var url = rootUrl + 'DoctorsDirectory/' + search + '/' + city + '/' + location + '/' + specialist + '/';
        showLoader();
        http.get(url).success(function (data) {
            scope.doctorsDirectories = data;
            $.mobile.changePage('#doctors-list', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function
    scope.getDoctorDetails = function (id) {
        scope.doctorId=id;

        $.mobile.changePage('#doctors-details', {type: "get", transition: "slide"});
    };// End Function
    scope.getHospitalDetails = function (id, hasBranches) {
        if (hasBranches === true) {
            var city = scope.dirCity;
            if (typeof city === 'undefined' || city === '') {
                city = 0;
            }
            var location = scope.dirLocation;
            if (typeof location === 'undefined' || location === '') {
                location = 0;
            }
            var search = 'any';
            if ($('#searchTerm').val() !== '') {
                search = $('#searchTerm').val();
            }
            var url = rootUrl + 'Hospitals/GetBranchesByHospital/' + id + '/' + search + '/' + city + '/' + location + '/';
            showLoader();
            http.get(url).success(function (data) {
                scope.hospitalBranches = data;
                $.mobile.changePage('#branches-list', {type: "get", transition: "slide"});
                hideLoader();
            });
        } else {
            var url = rootUrl + 'Hospitals/Details/' + id;
            showLoader();
            http.get(url).success(function (data) {
                scope.hospital = data.hospital;
                scope.clinics = data.clinics;
                scope.insurancesAccepted = data.insuranceAccepted;
                $.mobile.changePage('#hospitals-details', {type: "get", transition: "slide"});
                hideLoader();
            });
        }
    };// End Function
    scope.getBranchDetails = function (hospitalId, branchId) {

        var url = rootUrl + 'Hospitals/Branch/Details/' + hospitalId + '/' + branchId + '/';
        showLoader();
        http.get(url).success(function (data) {
            scope.hospital = data.hospital;
            scope.branch = data.branch;
            scope.insurancesAccepted = data.insuranceAccepted;
            scope.galleryImages = data.galleryImages;
            $.mobile.changePage('#branch-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    };// End Function
    scope.getFirstAidList = function () {
        var url = rootUrl + 'FirstAid';
        showLoader();
        http.get(url).success(function (data) {
            scope.firstAidList = data;
            $.mobile.changePage('#first-aid', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
    scope.getFirstAid = function (id) {
        var url = rootUrl + 'FirstAid/' + id;
        showLoader();
        http.get(url).success(function (data) {
            scope.firstAidItem = data;
            $.mobile.changePage('#first-aid-details', {type: "get", transition: "slide"});
            hideLoader();
        });
    }; // End Function
 scope.getExamPreparation = function (id) {
        scope.examId=id;
        $.mobile.changePage('#exam-preparation-details', {type: "get", transition: "slide"});
    };// End Function


}]);

$(window).load(function(e) {
    $('#customPreloader').remove();

});
$(function(){

startChat();
var rootUrl = $('#RootUrl').val();
var  ajaxAlways = function (object) {
   // showResponse;
    hideLoader();
};
var showResponse = function (object) {
    $('.ui-mobile .ui-footer').show();
    $('#output').text(JSON.stringify(object, null, 4));
};

$('#updateProfile').on('click',function(){
     $('#IdNumberUpdate').val($('#phoneUpdate').val());
    var $form = $('#frmUpdateProfile');
    var options = {
        url: rootUrl+'Account/UpdateProfile',
        type:'Post',
        data: $form.serialize()
    };
    showLoader();
    $.ajax(options).done(function (data) {
        hideLoader();
        $('#lnk-profile-popup').trigger('click');
    });
});
$(document).on("pageshow", function () {

});
$(document).on("pageshow",'#my-appointments', function () {
    $('.li-appointment').on('click',function(){
      $(this).find('.read-status-0').removeClass('read-status-0');
    });
});
$(document).on("pageshow", "#register", function () {
    $('#registerSpecialityId').selectmenu(); // initialize
    $('#registerSpecialityId').selectmenu('refresh');
     $('#btnRegister').off('click').on("click", function(e) {
         var allFilled = true;
          $('#registerIdNumber').val($('#registerPhoneNumber').val());
        $('#frm-register :input:not(:button):not([class*=undefined])').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
		 if ($('.password').val().length < 4) {
            alert("Passwords must be at least 4 characters.");
            return false;
        }
		if ($('.password').val() != $('.passwordconfirm').val()) {
            alert("Password and Confirm Password must match");
            return false;
        }
		 var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
         var $email = $('#RegUserEmail');
        if ($email.val() == '' || !re.test($email.val())) {
            alert('Please enter a valid email address.');
            return false;
        }
        if (allFilled) {

	   var url = $('#RootUrl').val() + 'account/register/';
	   var data=$('#frm-register').serialize();
        console.log(url);
        showLoader();
        $.post(url,data).done(function(data) {
            hideLoader();
			var rdata=data.trim();
			
            if (rdata.indexOf("Error") === 0) {
                alert(rdata);
            } else{
                var dArray=rdata.split(",");
                $("#UserId").val(dArray[0]);
			   $('.span-success').show();
                try {
                    //Save Data
                    SaveUserDetails(rdata, '1');
                }catch(err){}
			   $.mobile.changePage( '#login', {
					type: "get",
					transition: "flip"
				});
            } 
        }).error(function(data){
            try{
                alert(data.responseJSON.ModelState['']);
            }catch(err){
                alert("An error has occurred processing your request.");
            }

        }).always(ajaxAlways);
       
		}else{
		  alert('All fields are required');	
		}
		 e.preventDefault();
        return false;
    });
		
 }); // pageshow

$(document).on("pageshow", "#chatList", function (){

$('#btn-close-consultation').on('click',function(){
    var txt;
    var r = confirm("Close this consultation?");
    if (r == true) {
        var options = {
            url: rootUrl + 'PatientQueries/Close/'+$(this).attr('rel')+'/',
            type: 'Post',
            data: {Id: $(this).attr('rel')}
        };
        showLoader();
        $.ajax(options).done(function (data) {
            hideLoader();
            $('#edit-appointment-popup .popup-text p').text('Appointment Closed.');
            $('#lnk-close-chat').trigger('click');
            $('.sendsignalr,#chatmessage,#btn-close-consultation').fadeOut();

            $('#chatStatus').show();
            $('#chatStatus').html('<p>Consultation closed.</p>');
            $('#chatStatus').show();

        }).fail(ajaxError);
    }
});

});



$('.close-popup').off('click').on("click", function(e) {
    window.history.back();
    e.preventDefault();
    return false;
});
});
function showLoader() {
	
    $.mobile.loading("show", {
        text: 'loading',
        textVisible: false,
        theme: 'a',
        textonly: false,
        html: ''
    });
}

function hideLoader() {
	
    $.mobile.loading("hide");
}

$.urlParam = function(shows)
{ var results = new RegExp('[\\?&]' + shows+ '=([^&#]*)').exec(window.location.href);
    if (!results)   {          return '';      }     return results[1] || '';
}



