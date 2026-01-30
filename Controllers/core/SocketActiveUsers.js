const userSocketIdMap = new Map(); //a map of online usernames and their clients

module.exports = {
  getActiveUsers: () => {
    return userSocketIdMap.keys();
  }, //a map of online usernames and their clients
  checkActiveUser: (userID) => {
    return userSocketIdMap.has(userID);
  },
  getActiveUserSockets: (userID) => {
    return userSocketIdMap.get(userID);
  },
  addClientToMap: (userID, socketId) => {
    if (!userSocketIdMap.has(userID)) {
      //when user is joining first time
      userSocketIdMap.set(userID, new Set([socketId]));
      //console.log("User Added one time", userID);
    } else {
      //user had already joined from one client and now joining using another client;
      userSocketIdMap.get(userID).add(socketId);
      // console.log("User Added one more time", userID);
    }
  },
  removeClientFromMap: (userID, socketId) => {
    if (userSocketIdMap.has(userID)) {
      let userSocketIdSet = userSocketIdMap.get(userID);
      userSocketIdSet.delete(socketId);
      //  console.log("User disconnected from one device", userID);
      //if there are no clients for a user, remove that user from online list(map);
      if (userSocketIdSet.size == 0) {
        userSocketIdMap.delete(userID);
        // console.log("User disconnected from all devices", userID);
      }
    }
  },
};
