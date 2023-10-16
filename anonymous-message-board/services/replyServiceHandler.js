const Message = require('../models/message').Message;

exports.postReply = async (req, res, next) => {
  try {
    let board = req.params.board;
    let foundBoard = await Message.findById(req.body.thread_id);
    const sameDate = new Date().toUTCString();
    foundBoard.bumpes_on = sameDate;
    let allReplies = [...foundBoard.replies];
    foundBoard.replies.push({
      text: req.body.text,
      created_on: sameDate,
      delete_password: req.body.delete_password,
      reported: false,
    });

    await foundBoard.save();
    return res.redirect('/b/' + board + '/' + foundBoard._id);

    // if (foundBoard) {
    //   res.json(foundBoard);
    // }
  } catch (err) {
    res.json('error');
  }
};

exports.getReply = async (req, res) => {
  try {
    let board = req.params.board;
    const thread = await Message.findById(req.query.thread_id);
    if (thread) {
      thread.delete_password = undefined;
      thread.reported = undefined;
      thread.replycount = thread.replies.length;

      thread.replies.forEach((reply) => {
        reply.delete_password = undefined;
        reply.reported = undefined;
      });

      return res.json(thread);
    }

    res.json('error');
  } catch (err) {
    res.json('error');
  }
};

exports.deleteReply = async (req, res) => {
  try {
    let foundThread = await Message.findById(req.body.thread_id);
    foundThread.replies.forEach(async (ele) => {
      if (
        ele._id == req.body.reply_id &&
        ele.delete_password == req.body.delete_password
      ) {
        ele.text = '[deleted]';
        await foundThread.save();
        return res.send('success');
      } else if (
        ele._id == req.body.reply_id &&
        ele.delete_password != req.body.delete_password
      ) {
        return res.send('incorrect password');
      }
    });
  } catch (err) {
    res.json('error');
  }
};

exports.putReply = async (req, res) => {
  try {
    let foundThread = await Message.findById(req.body.thread_id);
    await foundThread.replies.forEach((ele) => {
      if (ele._id == req.body.reply_id) {
        ele.reported = true;
        foundThread.save();
        return res.send('reported');
      }
    });
  } catch (err) {
    res.json('error');
  }
};
