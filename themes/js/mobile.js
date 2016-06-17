var db;
var dbCreated = false;

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {


    try{ db = window.openDatabase("Radioson", "1.0", "PhoneGap Demo", 200000);} catch(err){}

    var firstrun = window.localStorage.getItem("runned");

    if (firstrun === null || firstrun==='null') {
       // $.mobile.changePage( '#login', {type: "get", transition: "slide"});
        populateDB();
    }
    else {
      //  $.mobile.changePage( '#dashboard', {type: "get", transition: "slide"});
        GetUserDetails();
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    var watchID = navigator.geolocation.watchPosition(onSuccess2, onError2, {timeout: 30000});

} //onDeviceReady

// onSuccess Callback
// This method accepts a Position object, which contains the
// current GPS coordinates
//
function onSuccess(position) {
    $('#HFLatitude').val(position.coords.latitude);
    $('#HFLongitude').val(position.coords.longitude);
    RemoveLocationNotification();
};

// onError Callback receives a PositionError object
//
function onError(error) {

    setTimeout(function () {
       // alert('Please Enable Location Access for better service.');
        SetLocationNotification();
    }, 4000);

}

// onSuccess Callback
//   This method accepts a `Position` object, which contains
//   the current GPS coordinates
//
function onSuccess2(position) {

    // alert('Latitude: '  + position.coords.latitude);
    $('#HFLatitude').val(position.coords.latitude);
    $('#HFLongitude').val(position.coords.longitude);
    RemoveLocationNotification();
}

// onError Callback receives a PositionError object
//
function onError2(error) {
    SetLocationNotification();
}
// Options: throw an error if no update is received every 30 seconds.
//	


function populateDB(data) {

//Create Table
    db.transaction(
        function (tx) {

//Create user table

            var sql = "DROP TABLE IF EXISTS fd_users";
            tx.executeSql(sql);
            sql = " CREATE TABLE IF NOT EXISTS fd_users ( " +
                "id INTEGER PRIMARY KEY AUTOINCREMENT, " +
                "UserName VARCHAR(200), " +
                "AccountType VARCHAR(200), " +
                "UserId INTEGER(20))";
            tx.executeSql(sql);
        },
        function (error) {
            console.log(error);
            alert('An error has occured.'+error);
        }
    );


}


function GetUserDetails() {

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM fd_users", [],
            function (tx, result) { // On Success
                var len = result.rows.length;


                var row = result.rows.item(0);
                $('#UserId').val(row.UserId);
                $.mobile.changePage( '#landing', {
                    type: "get",
                    transition: "flip"
                });
                setTimeout(function () {
                    startChat();

                }, 1000);
            },
            function (error) { // On error
                var err=JSON.stringify(error, null, 4);
              alert(err);
            });

    });	//transaction

} // GetUserDetails

function transaction_error(tx, error) {
    console.log('Error Message');
    console.log(error);
    alert("Database Error: " + error);
}

function SaveUserDetails(data) {
   var dArray=data.split(",");
//
// alert(dArray[0] + " " + dArray[1]);

    var sql = "insert into fd_users(UserName,UserId,AccountType) values('user','" + dArray[0] + "'," + dArray[1] + ")";
    db.transaction(
        function (tx) {
            tx.executeSql(sql);
            window.localStorage.setItem("runned", "1");

        },
        function (error) {
            console.log(error);
            var err=JSON.stringify(error, null, 4);
            alert(err + 'An error has occured. Please try again and check your internet connection');
        }
    );
}


function notification(title,id, msg) {

    var now = new Date().getTime();
    _3seconds_from_now = new Date(now + 1 * 10);
    _1seconds_from_now = new Date(now + 1 * 10);
    cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        text: msg,
        at: _1seconds_from_now,
        smallIcon: 'res://icon',
        data: {chatId:id}
    });
    // Join BBM Meeting when user has clicked on the notification
    cordova.plugins.notification.local.on("click", function (notification) {
       /*
        $.mobile.changePage('#patient-queries', {
            type: "get",
            transition: "flip"
        });*/
		// var err=JSON.stringify(notification, null, 4);        
         var chatId=notification.id;
		var activePage = $.mobile.activePage.attr('id')
if(activepage != 'chatList')
{ 
        var scope = angular.element(document.querySelector('body')).scope();
		scope.getChatList(chatId);
}  
		
    });
} //Close notification

function notificationAppointment(title,id, msg) {
    var now = new Date().getTime();
    _1seconds_from_now = new Date(now + 1 * 10);
    cordova.plugins.notification.local.schedule({
        id: id,
        title: title,
        text: msg,
        at: _1seconds_from_now,
        smallIcon: 'res://icon',
        data: { chatId:id}
    });
    cordova.plugins.notification.local.on("click", function (notification) {      
		var scope = angular.element(document.querySelector('body')).scope();
		scope.getAppointmentDetails(notification.data.chatId);
    });
} //Close notification

function SetLocationNotification() {
    if ($('#HFLatitude').val() === "") {
        $('body').find('.bottom-notification').remove();
        $('.ui-footer').each(function () {
            $(this).append('<div class="bottom-notification warning">Please enable Location Access for better service.</div>');
            $('.ui-footer').show();
        });
        // $('.ui-footer').append('<div class="bottom-notification warning">Please enable Location Access for better service.</div>');
    }
}
function RemoveLocationNotification() {
    // $('.bottom-notification').remove();
    $('body').find('.bottom-notification').remove();
    $('.ui-footer').hide();
}


$(document).on("pageshow", function() { // login


    $('.lnkLogout').off('click').on("click", function (e) {

        setTimeout(function() {
            window.localStorage.setItem("runned", null);

        }, 2000);

        $.mobile.changePage( '#login', {
            type: "get",
            transition: "flip"
        });

    });

});
$(document).on("pageshow",'#decoyLanding', function() { // login


    showLoader();
    var firstrun = window.localStorage.getItem("runned");

    if (firstrun === null || firstrun==='null') {

       // $.mobile.changePage('#login-page', {type: "get", transition: "slide"});

        setTimeout(function () {
            $('.lnkToLoginPage').trigger('click');
        }, 1000);
        setTimeout(function () {
            populateDB();
        }, 2000);
    }
    else {
        setTimeout(function () {
            $.mobile.changePage( '#landing', {type: "get", transition: "slide"});
        }, 1000);
    }
});
function landing(){

    var firstrun = window.localStorage.getItem("runned");
    if (firstrun === null || firstrun==='null') {
        $.mobile.changePage('#login', {type: "get", transition: "slide"});
    }
    else {
        $.mobile.changePage('#landing', {type: "get", transition: "slide"});
    }
}