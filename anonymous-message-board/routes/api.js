'use strict';
const Reply = require('./../models').Reply;
const Thread = require('./../models').Thread;

module.exports = function (app) {
  app.post('/api/threads/:board', (request, response) => {
    const newThread = new Thread(request.body);
    if (!newThread.board || newThread.board === '') {
      newThread.board = request.params.board;
    }
    newThread.createdon_ = new Date().toUTCString();
    newThread.bumpedon_ = new Date().toUTCString();
    newThread.reported = false;
    (async () => {
      const result = await Thread.create(newThread);
      if (result) {
        return response.redirect('/b/' + result.board + '/' + result.id);
      }
    })();
  });

  app.post('/api/replies/:board', (request, response) => {
    let newReply = new Reply({
      text: request.body.text,
      delete_password: request.body.delete_password,
    });
    newReply.createdon_ = new Date().toUTCString();
    newReply.reported = false;

    (async () => {
      const result = await Thread.findByIdAndUpdate(
        request.body.thread_id,
        { $push: { replies: newReply }, bumpedon_: new Date().toUTCString() },
        { new: true },
      );
      if (result) {
        response.redirect(
          '/b/' +
            result.board +
            '/' +
            result.id +
            '?new_reply_id=' +
            newReply.id,
        );
      }
    })();
  });

  app.get('/api/threads/:board', (request, response) => {
    (async () => {
      const resultArray = await Thread.find({ board: request.params.board })
        .sort({ bumpedon_: 'desc' })
        .limit(10)
        .select('-delete_password')
        .lean();

      if (resultArray) {
        resultArray.forEach((thread) => {
          thread['replycount'] = thread.replies.length;

          /* Sort Replies by Date */
          thread.replies.sort((thread1, thread2) => {
            return thread2.createdon_ - thread1.createdon_;
          });

          /* Limit Replies to 3 */
          thread.replies = thread.replies.slice(0, 3);

          /* Remove Delete Pass from Replies */
          thread.replies.forEach((reply) => {
            reply.delete_password = undefined;
            reply.reported = undefined;
          });
        });

        return response.json(resultArray);
      }
    })();
  });

  app.get('/api/replies/:board', (request, response) => {
    (async () => {
      const result = await Thread.findById(request.query.thread_id);

      if (result) {
        result.delete_password = undefined;

        /* Sort Replies by Date */
        result.replies.sort((thread1, thread2) => {
          return thread2.createdon_ - thread1.createdon_;
        });

        /* Remove Delete Pass from Replies */
        result.replies.forEach((reply) => {
          reply.delete_password = undefined;
        });

        return response.json(result);
      }
    })();
  });

  app.delete('/api/threads/:board', (request, response) => {
    (async () => {
      const result = await Thread.findById(request.body.thread_id);

      if (result) {
        if (result.delete_password === request.body.delete_password) {
          const resultRemove = await Thread.findByIdAndRemove(
            request.body.thread_id,
          );
          if (resultRemove) {
            return response.json('success');
          }
        } else {
          return response.json('incorrect password');
        }
      }
    })();
  });

  app.delete('/api/replies/:board', (request, response) => {
    //console.log(request.body);
    (async () => {
      const result = await Thread.findById(request.body.thread_id);
      //console.log(result);
      if (result) {
        let i;
        for (i = 0; i < result.replies.length; i++) {
          if (result.replies[i].id === request.body.reply_id) {
            if (
              result.replies[i].delete_password === request.body.delete_password
            ) {
              result.replies[i].text = '[deleted]';
            } else {
              return response.json('incorrect password');
            }
          }
        }

        const resultSave = await Thread.findByIdAndUpdate(
          request.body.thread_id,
          result,
        );
        if (resultSave) {
          return response.json('success');
        }
      }
    })();
  });

  app.put('/api/threads/:board', (request, response) => {
    (async () => {
      const result = await Thread.findByIdAndUpdate(
        request.body.thread_id,
        { reported: true },
        { new: true },
      );

      if (result) {
        return response.json('success');
      }
    })();
  });

  app.put('/api/replies/:board', (request, response) => {
    (async () => {
      const result = await Thread.findById(request.body.thread_id);

      if (result) {
        let i;
        for (i = 0; i < result.replies.length; i++) {
          if (result.replies[i].id === request.body.reply_id) {
            result.replies[i].reported = true;
          }
        }

        const resultSave = await Thread.findByIdAndUpdate(
          request.body.thread_id,
          result,
        );
        if (resultSave) {
          return response.json('success');
        }
      }
    })();
  });
};
