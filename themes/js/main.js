$( document).ready(function(e) {
	startChat();
	
   $("body>[data-role='panel']").panel();
   
    $('#menupanel').show();
 $(".jqm-navmenu-link, #mainmenu a,#footermenu").off('click').on("click", function () {
   menuOpen();
 });
 
 $('.sendsignalr').off('click').on('click',function(){
	 
    showLoader();
	var url = $('#RootUrl').val() + 'api.aspx?option=chat&chat-id='+$(this).attr('rel')+'&message='+$('#chatmessage').val();
	 $('.send-btn').attr('rel',$(this).attr('rel'));
	$.getJSON(url, function(data) {
	   var $cont = $('#chatcont'); 
		$cont.html('');  
		$.each(data,function(key, value) {
			
		var data='<span class="chat-inner-date">'+value.date_sent+'</span>';
		   data +='<div class="talk-bubble tri-right round  '+value.cssclass+'">';
           data +='<div class="talktext">';
           data +='<p> '+value.message+'</p>';
           data +='</div>';
           data +='</div>';
		   $cont.append(data);
		   
	    });
		$('#chatmessage').val('');
		hideLoader();
		 $('.lnkChat').trigger('click');
		
		}).fail(function() {
			alert("Check your internet connection.");
		}).always(function() {
			hideLoader();
		}); 


});// $('.send-btn')
$('#btn-ask').on('click',function(){
	  allFilled = true;
	  $('#frmaskquiz :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
        if (allFilled) {
			  var url = $('#RootUrl').val() + 'api.aspx?option=ask-quiz-set&user-id='+ $('#USERID').val()+'&' + $('#frmaskquiz').serialize();
            showLoader();
            $.get(url, function(data) {
				$('#lnkPayments').attr('href',data.trim());
				$('#payment-popup').trigger('click');
				// ProcessMessageList();
				 startChat();
            }).fail(function() {
                alert("Check your internet connection.");
            }).always(function() {
                hideLoader();
            });
		}else{
			 alert('All fields are required.');
		}
});	 //$('#btn-ask')

});
$(window).load(function(e) {
    $('#customPreloader').remove();
});
$( document).bind( "mobileinit", function() {
    // Make your jQuery Mobile framework configuration changes here!
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true; 
	
});

$(document).on("pageshow",function(){ 
$("a[target='_blank']").off('click').click(function(e){
		
	  e.preventDefault();
	  var linktarget=$(e.currentTarget).attr('href');
	  //window.open($(e.currentTarget).attr('href'), '_blank', 'location=yes');
	 // window.open($(e.currentTarget).attr('href'), '_system', '');
	   navigator.app.loadUrl(linktarget, {openExternal: true});
	  return false;
	});
 $('.close-popup').off('click').on("click", function(e) {
        window.history.back();
        e.preventDefault();
        return false;
    });
 $('.btnBack').off('click').on("click", function(e) {
        window.history.back();
        e.preventDefault();
        return false;
    });
	

	
});


$(document).on("pageshow","#nearby",function(){ 
 
 $('.btn-NearBySubmit').off('click').on("click", function(e) {
        e.preventDefault();  
		if($('#HFLatitude').val()!==""){
		showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-hospitals-by-distance&distance='+ $('#DDNearBy').val()+'&Latitude='+$('#HFLatitude').val()+'&Longitude='+$('#HFLongitude').val();
        $.getJSON(url, function(data) {
		   var $cont = $('.ul-hospital-list'); 
			$cont.find('li').remove();  
			var count=0;
			$.each(data,function(key, value) 
			{
				$cont.append('<li><a rel=' + value.hospital_id + ' class="li-hospital ui-btn ui-btn-icon-right ui-icon-carat-r" href="#">' + value.hospital_name + ' - '+parseFloat(value.distance_from_selected_town).toFixed(2)+'KM</a></li>').enhanceWithin();
				count++;
			});
			if(count==0){
				$cont.append('<li><a class="no-data ui-btn ui-btn-icon-right ui-icon-carat-r" href="#">No Hospitals Found</a></li>').enhanceWithin();
			}
			
			$('.lnkhosListHidden').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
		}else{
			alert('Please enable Location Access to use this service.\n\r System Settings->Location Access -> Access to my location');
		}
        return false;
    });   
 
 });
$(document).on("pageshow","#hospitals-search",function(){ 
 
 $('#btn-search-hospital').off('click').on("click", function(e) {
        e.preventDefault();  showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-hospitals&'+ $('#frmHospitalSearch').serialize();
        $.getJSON(url, function(data) {
		   var $cont = $('.ul-hospital-list'); 
			$cont.find('li').remove();  
			var count=0;
			$.each(data,function(key, value) 
			{
				
				$cont.append('<li><a rel=' + value.hospital_id + ' class="li-hospital ui-btn ui-btn-icon-right ui-icon-carat-r" href="#">' + value.hospital_name + '</a></li>').enhanceWithin();
				count++;
				
			});
			if(count==0){
				$cont.append('<li><a class="no-data ui-btn ui-btn-icon-right ui-icon-carat-r" href="#">No Hospitals Found</a></li>').enhanceWithin();
			}
			
			$('.lnkhosListHidden').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
        return false;
    });   
 
 });
$(document).on("pageshow","#hospitals-list",function(){ 
 
 $('.li-hospital').off('click').on("click", function(e) {
        e.preventDefault();  showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-one-hospital&hospital-id='+ $(this).attr('rel');
        $.getJSON(url, function(data) {
			$.each(data,function(key, value) 
			{
				$('#HOSPITALID').val(value.hospital_id);
				$('#hospital-name').text(value.hospital_name);
				$('#hospital-logo').attr('src',$('#SiteUrl').val()+'uploads/hospitals/'+value.logo);
				$('#HospitalLatitude').val(value.Latitude);
				$('#HospitalLongitude').val(value.Longitude);
				$('#desc').text(value.hospital_desc);
				
				
				
			});
			$('.lnkhosDetails').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
        return false;
    });   
 
 });

 $(document).on("pageshow","#hospitals-details",function(){ 
 
 $('.lnkBookNow').off('click').on('click',function(){
   showLoader();
   var url = $('#RootUrl').val() + 'get.aspx?option=book&hospital-id='+ $('#HOSPITALID').val()+'&speciality-id=0';
	$('#bookcont').html('');
	$.get(url, function(data) {
		$('#bookcont').html(data).enhanceWithin();
		$('.lnkBookhidden').trigger('click');
		hideLoader();
	}).fail(function(data) {
		alert("Check your internet connection");
		return false;
	}).always(function() {
		hideLoader();
	});
});
 $('.lnkAskNow').off('click').on('click',function(){
   showLoader();
   var url = $('#RootUrl').val() + 'get.aspx?option=ask-quiz&hospital-id='+ $('#HOSPITALID').val()+'&speciality-id=0';
	$('#frmaskquiz #fetchedData').html('');
	$.get(url, function(data) {
		$('#frmaskquiz #fetchedData').html(data).enhanceWithin();
		$('.lnkAskhidden').trigger('click');
		hideLoader();
	}).fail(function(data) {
		alert("Check your internet connection");
		return false;
	}).always(function() {
		hideLoader();
	});
});
 $('.insurance-accepted').off('click').on("click", function(e) {
      
       showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-insurance&hospital-id='+ $('#HOSPITALID').val();
        $.getJSON(url, function(data) {
		   var $cont = $('#insurance-cont'); 
			$cont.find('li').remove();  
			var count=0;
			 $('.poptext').text('The following are the insurance accepted in '+$('#hospital-name').text());
			$.each(data,function(key, value) 
			{
				
				$cont.append('<li>' + value.insurance_company_name + '</li>').enhanceWithin();
				count++;
				
			});
			if(count==0){
				$cont.append('<li>Sorry, No data found</li>').enhanceWithin();
			}
			
			$('#insurance-popup').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
        return false;
    });   
	
	$('.branches').off('click').on("click", function(e) {
       e.preventDefault();  showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-branches&hospital-id='+ $('#HOSPITALID').val();
        $.getJSON(url, function(data) {
		   var $cont = $('#insurance-cont'); 
			$cont.find('li').remove();  
			var count=0;
			 $('.poptext').text($('#hospital-name').text()+' has the following branches');
			$.each(data,function(key, value) 
			{
				
				$cont.append('<li>' + value.branch_name + '</li>').enhanceWithin();
				count++;
				
			});
			if(count==0){
				$('.poptext').text('Sorry, No branches found');
			}
			
			$('#insurance-popup').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
        return false;
    });   
 
 });

$(document).on("pageshow","#appointments",function(){ 

$('.lnkOpen').off('click').on('click',function(e){
 e.preventDefault();
 showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-one-appointments&id='+ $(this).attr('rel');
		// $('#appointments-count').html('');
        $.getJSON(url, function(data) {
            $('#appointments-count').html(data).enhanceWithin();
			
			$.each(data,function(key, value) 
			{
				$.each(value,function(key2, value2) 
			     {
					 if(key2=='time'){
						 $('.'+key2).val(fomartTimeShow(value2));
					 }else{
					 $('.'+key2).val(value2);
					 }
				   
				});
				
			});
			
			$('.lnkViewAppoitmentHidden').trigger('click');
			
			
			hideLoader();
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
		}); // Open

});

$(document).on("pageshow","#login",function(){ // When entering login
$('#btnLogin').off('click').on("click", function(e) {
         var allFilled = true;
        $('#frm-login :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
		
        if (allFilled) {
	   var url = $('#RootUrl').val() + 'api.aspx?option=login&' + $('#frm-login').serialize();
        console.log(url);
        showLoader();
        $.get(url, function(data) {
            hideLoader();
			var rdata=data.trim();
			
            if (rdata.indexOf("Error") === 0) {
                alert(rdata);
            } 
			else if (rdata === "incorrect") {
                alert("Email and password did not match.");
            }
			else{
               $("#USERID").val(rdata);		
               startChat();	
                try{		   
			   SaveUserDetails(data);		
				}catch(err){}			   
			   
			   
			   $('.span-success').show();
			   $.mobile.changePage( '#landing', {
					type: "get",
					transition: "slide"
				});
            } 
        }).fail(function(data) {
			console.log(data);
            alert("Check your internet connection");
            
            return false;
        }).always(function() {
            hideLoader();
        });
       
		}else{
		  alert('All fields are required');	
		}
		 e.preventDefault();
        return false;
    });
});


$(document).on("pageshow","#account",function(){

	if($('#selgender').val()==='1'){
		$('#male').addClass('ui-btn-active');
		$('#male').addClass('ui-radio-on');
	}else{
		alert('female');
		$('#female').addClass('ui-btn-active ui-radio-on');
	}
	$('#btnUpdateProfile').off('click').on("click", function(e) {
         var allFilled = true;
        $('#frm-profile :input:not(:button) :not("#upassword") :not("#upasswordconfirm")').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
			 console.log(element);
        });
		
		 if ($('#upassword').val().length > 1 && $('#upassword').val().length < 6) {
            alert("Passwords must be at least 6 characters.");
            return false;
        }
		
		if ($('#upassword').val() != $('#uconfirmpassword').val()) {
            alert("Password and Confirm Password must match");
            return false;
        }
        if (allFilled) {
	   var url = $('#RootUrl').val() + 'api.aspx?option=update-profile&' + $('#frm-profile').serialize();
        console.log(url);
        showLoader();
        $.get(url, function(data) {
            hideLoader();
			var rdata=data.trim();
			
            if (rdata.indexOf("Error") === 0) {
                alert(rdata);
            } else{
               $("#USERID").val(rdata);
			   $('.span-success').show();
			   $.mobile.changePage( '#logins', {
					type: "get",
					transition: "flip"
				});
            } 
        }).fail(function(data) {
            alert("Check your internet connection");
            
            return false;
        }).always(function() {
            hideLoader();
        });
       
		}else{
		  alert('All fields are required');	
		}
		 e.preventDefault();
        return false;
    });
});
$(document).on("pageshow","#landing",function(){ // When entering landing

$('.lnkAskQuiz').off('click').on('click',function(){
   showLoader();
   var url = $('#RootUrl').val() + 'get.aspx?option=ask-quiz';
	$('#frmaskquiz #fetchedData').html('');
	$.get(url, function(data) {
		$('#frmaskquiz #fetchedData').html(data).enhanceWithin();
		$('body .aspNetHidden').remove();
		$('.lnkAskhidden').trigger('click');
		hideLoader();
	}).fail(function(data) {
		alert("Check your internet connection"+data);
		return false;
	}).always(function() {
		hideLoader();
	});
});
$('.lnkBook').off('click').on('click',function(){
	   showLoader();
       var url = $('#RootUrl').val() + 'get.aspx?option=book&hospital-id=0&speciality-id=0';
		$('#bookcont').html('');
        $.get(url, function(data) {
            $('#bookcont').html(data).enhanceWithin();
			$('.lnkBookhidden').trigger('click');
			hideLoader();
        }).fail(function(data) {
            alert("Check your internet connection"+data);
            return false;
        }).always(function() {
            hideLoader();
        });
});
$('.lnkMyQuestions').off('click').on('click',function(){
	ProcessMessageList();
});
$('.lnkAppointments').off('click').on('click',function(){
	   showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-appointments&user-id='+ $('#USERID').val();
        $.getJSON(url, function(data) {
            $('#appointments-count').html(data).enhanceWithin();
			var $tbl = $('#tb-appointments'); 
			$tbl.find('tr').remove();  
			$tbl.append('<tr><th>Hospital</th><th>Date</th><th>Status</th><th><th></tr>');
			$.each(data,function(key, value) 
			{
				
				$tbl.append('<tr><td>' + value.hospital_name + '</td><td>' + value.booked_date +' '+ fomartTimeShow(value.time) + '</td><td>' + value.status_name + '</td><td><a class="lnkOpen" href="#" rel="'+value.appointment_id+'">Open</a></td><td><a class="lnkCancel"  rel="'+value.appointment_id+'">Cancel</a></td>');
			});
			$('.lnkAppointments-hidden').trigger('click');
			hideLoader();
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
});


$('.lnkfirstaid').off('click').on('click',function(){
showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=first-aid-all';
        $.getJSON(url, function(data) {
		   var $cont = $('.firstaid-list'); 
			$cont.find('li').remove();  
			$.each(data,function(key, value) 
			{
				$cont.append('<li><a rel=' + value.id + ' class="lnk-first-aid-get ui-btn" href="#">' + value.title + '</a></li>').enhanceWithin();
			});
			$.mobile.changePage( '#first-aid', {
            type: "get",
			transition: "slide"
		});
			
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });	

});

$('.lnkMyAccount').off('click').on('click',function(){
showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-profile&user-id='+ $('#USERID').val();
        $.getJSON(url, function(data) {
		  
		console.log(data);
			$.each(data,function(key, value) 
			{
				$('#surname').val(value.user_surname);
				$('#firstname').val(value.user_first_name);
				$('#lastname').val(value.user_second_name);
				$('#phone').val(value.user_phone);
				$('#email').val(value.Email);
				$('#dob').val(value.user_dob);
				$('#selgender').val(value.user_gender_id);
				
				// 
				
				
			});
			
			$.mobile.changePage( '#account', {
            type: "get",
			transition: "slide"
		});
			
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });	

});



$('.lnkhospitalsearch').off('click').on('click',function(){
	  showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-counties';
        $.getJSON(url, function(data) {
		   var $select = $('#ddCounties'); 
			$select.find('option').remove();  
			$select.append('<option value=0>Any</option>');
			$.each(data,function(key, value) 
			{
				$select.append('<option value=' + value.county_id + '>' + value.county_name + '</option>');
			});
			$('.lnkhospitalsearchHidden').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
	
});

});
$(document).on("pageshow","#first-aid",function(){ 
  $('.lnk-first-aid-get').off('click').on('click',function(){
showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=first-aid-one&id='+$(this).attr('rel');
	$.getJSON(url, function(data) {
	   var $cont = $('.detailscont'); 
		$cont.html('');  
		$.each(data,function(key, value) 
		{
			$cont.append('<h2>' + value.title + '</h2><div class="paratext">' + value.description + '</div>').enhanceWithin();
		});
		$.mobile.changePage( '#first-aid-details', {
		type: "get",
		transition: "slide"
	});
		
	}).fail(function(data) {
		alert("Check your internet connection");
		return false;
	}).always(function() {
		hideLoader();
	});	

});

}); //#first-aid
$(document).on("pageshow","#chat",function(){ 
$('html,body').scrollTop(1E10);
});

$(document).on("pageshow","#my-questions",function(){ 
 $('.questions-list').off('click').on('click', '.li-chat-list',function(){
 //$('.li-chat-list').off('click').on('click',function(){
	 showLoader();
	var url = $('#RootUrl').val() + 'api.aspx?option=get-chat-list&chat-id='+$(this).attr('rel');
	 $('.send-btn').attr('rel',$(this).attr('rel'));
	 $('#DoctorID').val($(this).attr('data-rel'));
	$.getJSON(url, function(data) {
	   var $cont = $('#chatcont'); 
		$cont.html('');  
		$.each(data,function(key, value) {
			
		var data='<span class="chat-inner-date">'+value.date_sent+'</span>';
		   data +='<div class="talk-bubble tri-right round  '+value.cssclass+'">';
           data +='<div class="talktext">';
           data +='<p> '+value.message+'</p>';
           data +='</div>';
           data +='</div>';
		   $cont.append(data);
		    $('#chatControlsCont').addClass('chat-'+value.chat_id);
			$('#chatStatus').addClass('chat-'+value.chat_id);
			 
		   if(value.status_id==='0'){
			  $('#chatStatus p').html('Pending Payment'); 
			  $('#chatStatus').show();
			  $('#chatControlsCont').hide();
		   }else if(value.status_id==='-1'){
			    $('#chatStatus').show();
			    $('#chatControlsCont').hide();
			    $('#chatStatus p').html('Question closed.'); 
		   }else{
			    $('#chatStatus').hide();
			    $('#chatControlsCont').show(); 
		   }
		   
	    });
		
		hideLoader();
		 $('.lnkChat').trigger('click');
		
		}).fail(function() {
			alert("Check your internet connection.");
		}).always(function() {
			hideLoader();
		}); 

		});// ('.li-chat-list')

});
$(document).on("pageshow","#ask-quiz",function(){ 


$('#ddHospitals').on('change',function(){
	 showLoader();
	 var url = $('#RootUrl').val() + 'api.aspx?option=get-branches&hospital-id='+$('#ddHospitals').val()+'&speciality-id='+$('#ddSpeciality').val();
	
	$.getJSON(url, function(data) {
	   var $select = $('#ddBranches'); 
		$select.find('option').remove();  
		$.each(data,function(key, value) {
			$select.append('<option value=' + value.branch_id + '>' + value.branch_name + '</option>');
	    });
		hideLoader();
  })
});

if($('#ddHospitals').val()!='0'){
 $('#ddHospitals').trigger('change');	
}

$('#ddSpeciality').on('change',function(){
	 showLoader();
	var url = $('#RootUrl').val() + 'api.aspx?option=doctors&hospital-id='+$('#ddHospitals').val()+'&speciality-id='+$('#ddSpeciality').val();
	$.getJSON(url, function(data) {
	   var $select = $('#ddDoctors'); 
		$select.find('option').remove();  
		$.each(data,function(key, value){
			
			$select.append('<option value=' + value.dr_UserId + '>' + value.dr_name + '</option>');
	    });
		hideLoader();
  });
});
$('.lnkCloseQuizPopup').off('click').on('click',function(){

 });

});
$(document).on("pageshow","#book",function(){ // When entering pagetwo

	 RegisterBookTriggers();
});
function RegisterBookTriggers(){
 $("input").prop("name",$("#inputname").prop("id")); 
 $('#ddHospitals').on('change',function(){
	 showLoader();
	var url = $('#RootUrl').val() + 'api.aspx?option=get-branches&hospital-id='+$('#ddHospitals').val()+'&speciality-id='+$('#ddSpeciality').val();
	$.getJSON(url, function(data) {
	   var $select = $('#ddBranches'); 
		$select.find('option').remove();  
		$.each(data,function(key, value) {
			$select.append('<option value=' + value.branch_id + '>' + value.branch_name + '</option>');
	    });
		hideLoader();
  })
});

if($('#ddHospitals').val()!='0'){
 $('#ddHospitals').trigger('change');	
}

 $('#ddSpeciality').on("change", function(e) {
		 ReloadBook();
    });
	$('#ddPaymentMode').on("change", function(e) {
	  if($('#ddPaymentMode').val()=='1')
	  {
		 $('.bookinsurance').slideUp();
	  }else{
		  $('.bookinsurance').slideDown();
	  }
      
    });	
	
	$('#btn-book').off('click').on('click',function(e){
		 e.preventDefault();
		 var allFilled = true;
	     if($('#ddPaymentMode').val()=='1')
		  {
			 $('#membershipno').val('0');
			 
		  }
        $('#frmbook :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
		  if($('#ddPaymentMode').val()=='1')
		  {
			 $('#membershipno').val('');
		  }
		  allFilled = true;
        if (allFilled) {
			  var url = $('#RootUrl').val() + 'api.aspx?option=book&user-id='+ $('#USERID').val()+'&' + $('#frmbook').serialize();
            showLoader();
            $.get(url, function(data) {
                $('.popup-header').html('Success');
                $('.popup-text').html('Your appointment has been submited. The hospital will get back to you soon.');
                // $('#frmbook')[0].reset();
				$('.lnkpopup').trigger('click');
				
              
            }).fail(function() {
                alert("Check your internet connection.");
            }).always(function() {
                hideLoader();
            });
		}else{
			 alert('All fields are required');
		}
		return false;
    });	
	
	$('.close-popup').off('click').on("click", function(e) {
        window.history.back();
        e.preventDefault();
        return false;
    });
} // RegisterBookTriggers

$(document).on("pageshow","#register",function(){ 

$('#btnRegister').off('click').on("click", function(e) {
         var allFilled = true;
        $('#frm-register :input:not(:button)').each(function(index, element) {
            if (element.value === '') {
                console.log(element);
                allFilled = false;
            }
        });
		 if ($('.password').val().length < 6) {
            alert("Passwords must be at least 6 characters.");
            return false;
        }
		if ($('.password').val() != $('.passwordconfirm').val()) {
            alert("Password and Confirm Password must match");
            return false;
        }
        if (allFilled) {
	   var url = $('#RootUrl').val() + 'api.aspx?option=register&' + $('#frm-register').serialize();
        console.log(url);
        showLoader();
        $.get(url, function(data) {
            hideLoader();
			var rdata=data.trim();
			
            if (rdata.indexOf("Error") === 0) {
                alert(rdata);
            } else{
               $("#USERID").val(rdata);
			   $('.span-success').show();
			   $.mobile.changePage( '#login', {
					type: "get",
					transition: "flip"
				});
            } 
        }).fail(function(data) {
            alert("Check your internet connection");
            
            return false;
        }).always(function() {
            hideLoader();
        });
       
		}else{
		  alert('All fields are required');	
		}
		 e.preventDefault();
        return false;
    });
});
function ReloadBook(){
	 showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=doctors&hospital-id='+$('#ddHospitals').val()+'&speciality-id='+$('#ddSpeciality').val();
        $.getJSON(url, function(data) {
		
		   var $select = $('#ddDoctors'); 
			$select.find('option').remove();  
			$.each(data,function(key, value) 
			{
				$select.append('<option value=' + value.dr_UserId + '>' + value.dr_name + '</option>');
			});
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });
		
		
}

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
function OpenExternal(linktarget){
	 navigator.app.loadUrl(linktarget, {openExternal: true});
}
function fomartTimeShow(h_24) {
	var dArray=h_24.split(":");
	
	h_24=dArray[0];
    var h = ((h_24 + 11) % 12)+1;
    return (h < 10 ? '0' : '') + h + ':'+dArray[1] + (h_24 < 12 ? 'am' : 'pm');
}
function ProcessMessageList(){
 showLoader();
       var url = $('#RootUrl').val() + 'api.aspx?option=get-questions&user-id='+ $('#USERID').val();
        $.getJSON(url, function(data) {
		   var $cont = $('.questions-list'); 
			$cont.find('li').remove();  
			$.each(data,function(key, value) 
			{
				
				$cont.append('<li class="chat-' + value.chat_id + '"><a data-rel=' + value.dr_UserId + ' rel=' + value.chat_id + ' class="li-chat-list ui-btn" href="#"><span class="sender-title">' + value.name + '</span><span class="timespan">' + value.last_message_time + '</span><span class="chat-msg">' + value.last_message + '</span></a></li>').enhanceWithin();
			});
			$('.lnkMyQuestionshidden').trigger('click');
        }).fail(function(data) {
            alert("Check your internet connection");
            return false;
        }).always(function() {
            hideLoader();
        });	
	
}
function menuOpen(){
	var activePage = $.mobile.activePage[0].id;
	// if (activePage != 'login' && activePage != 'validate' && activePage != 'register' && activePage != 'forgotpassword') {
	  
		if ($('#menupanel').hasClass('ui-panel-open')) {
			$('#menuclose').trigger('click');
        } else {
            $('#menuicon').trigger('click');
        }
	//}//end if
}