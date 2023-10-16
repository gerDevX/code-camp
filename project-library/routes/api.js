/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

'use strict';
const Books = require('./../models').Books;

module.exports = function (app) {
  app
    .route('/api/books')
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      (async () => {
        const response = [];
        const result = await Books.find({});
        result?.map((v) => {
          response.push({
            _id: v._id,
            title: v.title,
            commentcount: v.comments.length,
          });
        });
        res.json(response);
      })();
    })

    .post(function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title

      if (!title) {
        return res.json('missing required field title');
      }
      (async () => {
        const result = await Books.create({ title: title });
        res.json({ title: result.title, _id: result._id });
      })();
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      (async () => {
        const result = await Books.deleteMany();
        res.json('complete delete successful');
      })();
    });

  app
    .route('/api/books/:id')
    .get(function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      if (!bookid) {
        return res.json('missing required field id');
      }

      (async () => {
        try {
          const result = await Books.findById(bookid);
          if (!result) {
            return res.json('no book exists');
          }

          res.json(result);
        } catch (error) {
          return res.json('no book exists');
        }
      })();
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if (!bookid) {
        return res.json('missing required field id');
      }
      if (!comment) {
        return res.json('missing required field comment');
      }

      (async () => {
        try {
          const resultData = await Books.findByIdAndUpdate(bookid, {
            $push: {
              comments: comment,
            },
          });
          if (!resultData) {
            return res.json('no book exists');
          }

          const resultUpdated = await Books.findById(bookid);
          res.json(resultUpdated);
        } catch (error) {
          return res.json('no book exists');
        }
      })();
    })

    .delete(function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      if (!bookid) {
        return res.json('no book exists');
      }

      (async () => {
        try {
          const result = await Books.findByIdAndDelete(bookid);
          if (!result) {
            return res.json('no book exists');
          }

          res.json('delete successful');
        } catch (error) {
          return res.json('no book exists');
        }
      })();
    });
};
