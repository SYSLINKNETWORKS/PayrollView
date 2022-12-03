
function CallNotification(_messageCategory) {
    //Socket Start

    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl_Notification + "/notificationMessageHub").build();
    connection.on("ReceiveNotificationMessage", function (topic, _DateTime, customerId, customerName, messageCategory, message) {
        if (topic == apiUrl_NotificationCompany) {
            if (messageCategory == _messageCategory) {
                // ReadyForDelivery();
                var msg = message;
                var msgDateTime = moment(_DateTime).format('LT');
                alertcnt += 1;
                titlecnt += 1;
                var ulmsgmaster = $('#ul_msg_master ul');
                var ulmsgmaster_old = ulmsgmaster.html();
                ulmsgmaster.empty();
                ulmsgmaster.append(
                    '<li>' +
                    '<a href="javascript:;">' +
                    '<span class="time">' + msgDateTime + '</span>' +
                    '<span class="details">' +
                    msg +
                    '</span>' +
                    '</a>' +
                    '</li>'
                );
                ulmsgmaster.append(ulmsgmaster_old);
                $('#spn_alert_master').html(alertcnt);
                $('#spn_alert_master').css("background", "red");
                lbltitle.html('(' + titlecnt + ')' + title);


                //Web Notification Start
                if (Notification.permission === "granted") {
                    //alert("we have permission");
                    showWebNotification(msgDateTime, msg);
                }
                else if (Notification.permission !== "denied") {

                    Notification.requestPermission().then(permission => {
                        if (permission === "granted") { showWebNotification(); }
                    });
                }    //Web Notification End
            }
        }
    });
    connection.start().then(function () {
    }).catch(function (err) {
        return console.error(err.toString());
    });
}


function CallNotificationAttendanceMachine(_messageCategory) {
    //Socket Start

    var connection = new signalR.HubConnectionBuilder().withUrl(apiUrl_Notification + "/notificationMessageHub").build();
    connection.on("ReceiveNotificationMessage", function (topic, _DateTime, customerId, customerName, messageCategory, message) {
        if (topic == apiUrl_NotificationCompany) {
            if (messageCategory == _messageCategory) {
                MachineSocket(customerName, message + " Last seen : " + moment(_DateTime).format("DD-MMM-YYYY HH:mm:ss"));
            }
        }
    });
    connection.start().then(function () {
    }).catch(function (err) {
        return console.error(err.toString());
    });
}