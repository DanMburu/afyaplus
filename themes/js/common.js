
$(document).ready(function () {

    $("body>[data-role='panel']").panel();
    $(".jqm-navmenu-link,#mainmenu a, #footermenu").on("click", function () {
        menuOpen();
    });
    setTimeout(function() {
        $('#menupanel').show();
    }, 1000);

    $('#chatmessage').keypress(function (e) {
        if (e.keyCode == 13)
            $('.sendsignalr').trigger('click');
    });
    $('#DateBooked').on('click',function(){
        $('#datepicker .input-group-addon').trigger('click');
    });
});
var ajaxAlways = function (object) {
    hideLoader();
};
var ajaxError = function (object) {
    alert("An error has occured processing your request. Please check your internet connection and try again.");
    hideLoader();
};
$(document).on("pageshow",function(){ 
$("a[target='_blank']").off('click').click(function(e){
        
      e.preventDefault();
      var linktarget=$(e.currentTarget).attr('href');
      //window.open($(e.currentTarget).attr('href'), '_blank', 'location=yes');
     // window.open($(e.currentTarget).attr('href'), '_system', '');
       navigator.app.loadUrl(linktarget, {openExternal: true});
      return false;
    });
    
});

$(document).on("pageshow", "#login", function () { // When entering login

    $('#btnLogin').off('click').on("click", function (e) {
        var allFilled = true;
        $('#frm-login :input:not(:button)').each(function (index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });

        if (allFilled) {
            var url = $('#RootUrl').val() + 'Account/MobileLogin/';
            var data = $('#frm-login').serialize();
            console.log(url);
            showLoader();
            //alert(url);
            //alert(data);
            $.post(url, data).done(function (data) {
               // hideLoader();
                var rdata = data.trim();

                if (rdata.indexOf("Error") === 0) {
                    alert(rdata);
                }
                else if (rdata === "incorrect") {
                    alert("Email and password did not match.");
                }
                else {
                    var dArray=rdata.split(",");
                    $("#UserId").val(dArray[0]);
                    startChat();


                    try{
                        SaveUserDetails(data);
                    }catch(err){}

                   
                    // $('.span-success').show();
                    $.mobile.changePage('#landing', {
                        type: "get",
                        transition: "slide"
                    });

                }
            }).fail(ajaxError).always(ajaxAlways);


        } else {
            alert('All fields are required');
        }
        e.preventDefault();
        return false;
    });
});

$(document).on("pageshow","#landing", function () { // When entering login

  
var scope = angular.element(document.querySelector('body')).scope();
if(typeof scope.specialities==='undefined'){
     $('#lnkInit').trigger('click');
}


    setTimeout(function(){
         try{
$("#owl-carousel").data('owlCarousel').destroy();   
}catch(err){}

         $("#owl-carousel").owlCarousel({items:3,margin:5,autoplay:true,autoplayTimeout:5000,loop:true,responsive: false});

    },100);
}); //pageshow


$(document).on("pageshow", "#forgot-password", function () {
    $('.passwordResetButton').off('click').on('click', function() {
        if(!validateEmail($('#txtEmailReset').val())){
            return false;
        }

        var options = {
            url: $('#RootUrl').val()+'account/ForgotPassword/'+$('#txtEmailReset').val()+'/',
            type: 'get',

        };
        showLoader();
        $.ajax(options).success(function (data) {
            hideLoader();
            if (data.trim().toLowerCase() === 'success') {
                $.dynamic_popup('<span>New password sent to your email.</span>');

            }else if(data.trim() === 'notFound'){
                $.dynamic_popup('<span class="error">Email address not registered.</span>');
            }else if(data.trim() === 'fail'){
                $.dynamic_popup('<span class="error">Sorry we haven\'t managed to reset your password\nKindly try again or Contact us .</span>');
            }


        }).error(ajaxError).always(ajaxAlways);

    });

});





function convertDateTime(strDate) {
    alert('convertDateTime');
    return 'here';
}
$(document).on("pageshow", "#chatList", function () {

    // $('html,body,#chatList .ui-content').scrollTop(1E10);
    // var target = $("#chatmessage").get(0).offsetTop;
    // alert(target);
    $("html, body").animate({ "scrollTop" : 1E10 }, 500);
});

function indexByKeyValue(arraytosearch, key, valuetosearch) {

    for (var i = 0; i < arraytosearch.length; i++) {

        if (arraytosearch[i][key] == valuetosearch) {
            return i;
        }
    }
    return null;
}
function menuOpen() {
    var activePage = $.mobile.activePage[0].id;
    // if (activePage != 'login' && activePage != 'validate' && activePage != 'register' && activePage != 'forgotpassword') {

    if ($('#menupanel').hasClass('ui-panel-open')) {
        $('#menuclose').trigger('click');
    } else {
        $('#menuicon').trigger('click');
    }
    //}//end if
}

$.urlParam = function (shows) {
    var results = new RegExp('[\\?&]' + shows + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return '';
    }
    return results[1] || '';
}
function OpenExternal(linktarget) {
    navigator.app.loadUrl(linktarget, {openExternal: true});
}
function fomartTimeShow(h_24) {
    var dArray = h_24.split(":");

    h_24 = dArray[0];
    var h = ((h_24 + 11) % 12) + 1;
    return (h < 10 ? '0' : '') + h + ':' + dArray[1] + (h_24 < 12 ? 'am' : 'pm');
}

function menuClose() {
    $('#menuclose').trigger('click');
}

function menuOpen(){
    var activePage = $.mobile.activePage[0].id;
    if (activePage != 'login' && activePage != 'validate' && activePage != 'register' && activePage != 'forgotpassword') {

        if ($('#menupanel').hasClass('ui-panel-open')) {

            $('#menuclose').trigger('click');
        } else {

            $('#menuicon').trigger('click');
        }

    }//end if
}
function validateEmail(email){

    var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (email == '' || !re.test(email)) {

        $.dynamic_popup('<span class="error">Please enter a valid email address.</span>');
        return false;
    }
    return true;
}



$(document).ready(function(){
    setTimeout(function(){
       // $('#lnkInit').trigger('click');
       hideLoader();
    },1000);
});