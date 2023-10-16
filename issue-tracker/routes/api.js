'use strict';
const Issues = require('./../models').Issues;

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(function (req, res) {
      let project = req.params.project;
      const filter = { project: project };
      for (let q in req.query) {
        let value = req.query[q];
        if (q === 'open') {
          value = value.toLowerCase() === 'true';
        }
        filter[q] = value;
      }
      (async () => {
        const result = await Issues.find(filter);

        res.json(result);
      })();
    })

    .post(function (req, res) {
      let project = req.params.project;
      if (
        !(req.body.issue_title && req.body.issue_text && req.body.created_by)
      ) {
        return res.json({ error: 'required field(s) missing' });
      }
      const doc = {
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
      };
      (async () => {
        const result = await Issues.create(doc);
        res.json(result);
      })();
    })

    .put(function (req, res) {
      //let project = req.params.project;
      const _id = req.body._id;
      const doc = {};
      for (let i in req.body) {
        if (i !== '_id') {
          if (req.body[i] !== '') {
            doc[i] = req.body[i];
          }
        }
      }
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      if (Object.values(doc).every((el) => el === undefined)) {
        return res.json({ error: 'no update field(s) sent', _id: _id });
      }
      doc.updated_on = new Date().toISOString();

      (async () => {
        try {
          const resultData = await Issues.findByIdAndUpdate(_id, doc);
          if (!resultData) {
            res.json({ error: 'could not update', _id: _id });
          }
          res.json({ result: 'successfully updated', _id: _id });
        } catch (error) {
          res.json({ error: 'could not update', _id: _id });
        }
      })();
    })

    .delete(function (req, res) {
      let project = req.params.project;
      const { _id } = req.body;
      if (!_id) {
        return res.json({ error: 'missing _id' });
      }
      if (req.body.length > 1) {
        return res.json({ error: 'could not delete', _id: _id });
      }

      (async () => {
        try {
          const resultData = await Issues.findByIdAndDelete(_id);
          if (!resultData) {
            return res.json({ error: 'could not delete', _id: _id });
          }
          return res.json({ result: 'successfully deleted', _id: _id });
        } catch (error) {
          return res.json({ error: 'could not delete', _id: _id });
        }
      })();
    });
};
