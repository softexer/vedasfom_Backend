const dbQueries = require('../../Controllers/customers/customerdbQuaries');
var FCM = require('fcm-push');

module.exports.sendMultipleNotifications = function sendMultipleNotifications(userID, data) {
    let fetchMessagesUnreadCountQuery = dbQueries.getUserUnreadNotifificationCountAggregateQuery(userID);
    fetchMessagesUnreadCountQuery.then((messages) => {
        
        data.notification.badge = messages.length + 1;
        let notifyQuery = dbQueries.getUserNotificationsQuery(userID);
        notifyQuery.then((dc) => {
            if (dc.length > 0) {
                var type = dc[0].devices.mobile;
                var wType = dc[0].devices.web;
                if (type.length > 0) {
                    for (var j = 0; j < dc[0].devices.mobile.length; j++) {
                        if (dc[0].devices.mobile[j].login == true) {
                            var serverkey = "AAAAsMuweAo:APA91bEx-qnAjWDuYzl_XRkoa5WUJQMZLTiYg8QWYtz1DFq5a-BWn_SbmQhN4cC3d9H0zzOfgq00VfSRwQI3XbVBS3Lsy6be_nbUO3fMbq88TV7M3FrQJ-n0H-NceXYmkbF8UA1D3aa3";
                            var fcm = new FCM(serverkey);
                            var message = {
                                to: dc[0].devices.mobile[j].deviceToken, // required fill with device token or topics
                                notification: data.notification,
                                data: data.data
                            };
                            //callback style
                            fcm.send(message, function (err, response) {
                                if (err) {
                                    
                                } else {
                                    console.log("Successfully sent with response: ", response);

                                }
                            });

                        } else {
                          
                        }
                    }
                }
                if (wType.length > 0) {
                  
                    for (var j = 0; j < dc[0].devices.web.length; j++) {
                        if (dc[0].devices.web[j].login == true) {
                            var serverkey = "AAAAsMuweAo:APA91bEx-qnAjWDuYzl_XRkoa5WUJQMZLTiYg8QWYtz1DFq5a-BWn_SbmQhN4cC3d9H0zzOfgq00VfSRwQI3XbVBS3Lsy6be_nbUO3fMbq88TV7M3FrQJ-n0H-NceXYmkbF8UA1D3aa3";
                            var fcm = new FCM(serverkey);
                            var message = {
                                to: dc[0].devices.web[j].deviceToken, // required fill with device token or topics
                                notification: data.notification,
                                data: data.data
                            };
                            //callback style
                            fcm.send(message, function (err, response) {
                                if (err) {
                                  
                                } else {
                                    console.log("Successfully sent with response: ", response);

                                }
                            });

                        } else {
                           
                        }
                    }
                }
            }
        })
    })
  
    let addingNotificationToInbox = dbQueries.addingPushNotificationsToInboxQuery(userID, data);
    addingNotificationToInbox.then((added) => {
     
    })

    return;

}
