'use strict';
let threadHandler = require('../services/threadServiceHandler');
let replyHandler = require('../services/replyServiceHandler');

module.exports = function (app) {
  app
    .route('/api/threads/:board')
    .post(threadHandler.postThread)
    .get(threadHandler.getThread)
    .delete(threadHandler.deleteThread)
    .put(threadHandler.putThread);

  app
    .route('/api/replies/:board')
    .post(replyHandler.postReply)
    .get(replyHandler.getReply)
    .delete(replyHandler.deleteReply)
    .put(replyHandler.putReply);
};
